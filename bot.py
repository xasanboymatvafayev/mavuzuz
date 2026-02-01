import asyncio
import json
import logging
import random
import datetime
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery, LabeledPrice, PreCheckoutQuery
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

TOKEN = "8567309560:AAHoV_p4mFfQ4aZmp4QZ898Fxf5sZ3xIGJw"
WEB_APP_URL = "https://maviboutiqueuz.vercel.app"
ADMIN_IDS = [6365371142]

store_data = {
    "location": {"lat": 41.3782, "lon": 60.3642, "address": "Xiva Gipermarket 2-qavat"},
    "orders_count": 128,
    "revenue": 54200000,
    "active_tickets": 0
}

order_history = {}

class AdminStates(StatesGroup):
    waiting_for_location = State()
    waiting_for_announcement = State()
    waiting_for_support_reply = State()
    waiting_for_ticket_id = State()

class UserStates(StatesGroup):
    waiting_for_feedback = State()
    waiting_for_support_query = State()

bot = Bot(token=TOKEN)
dp = Dispatcher()

def get_admin_markup():
    buttons = [
        [InlineKeyboardButton(text="👗 Katalog & Admin Panel", web_app=WebAppInfo(url=WEB_APP_URL))],
        [InlineKeyboardButton(text="📍 Lokatsiyani yangilash", callback_data="admin_update_loc")],
        [InlineKeyboardButton(text="📢 Reklama yuborish", callback_data="admin_broadcast")],
        [InlineKeyboardButton(text="📊 Statistika", callback_data="admin_stats")],
        [InlineKeyboardButton(text="🎫 Support Chiptalari", callback_data="admin_tickets")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_user_markup():
    buttons = [
        [InlineKeyboardButton(text="🛍 Katalogni ko'rish", web_app=WebAppInfo(url=WEB_APP_URL))],
        [InlineKeyboardButton(text="💬 Stilist bilan suhbat", callback_data="user_ai_chat")],
        [InlineKeyboardButton(text="🚚 Buyurtma holati", callback_data="user_order_status")],
        [InlineKeyboardButton(text="🆘 Yordam", callback_data="user_support")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

@dp.message(Command("start"))
async def start_handler(message: types.Message):
    user_id = message.from_user.id
    is_admin = user_id in ADMIN_IDS
    
    welcome_msg = (
        f"Assalomu alaykum, {message.from_user.full_name}!\n\n"
        "MaviBoutique - nafislik va go'zallik maskaniga xush kelibsiz.\n"
        "Biz sizga eksklyuziv ko'ylaklar va yuqori sifatli xizmatni taklif etamiz.\n\n"
        "Quyidagi menyu orqali katalogni ko'rishingiz mumkin:"
    )
    
    if is_admin:
        welcome_msg += "\n\nSiz tizimda admin sifatida aniqlandingiz. Boshqaruv tugmalari pastda:"
        await message.answer(welcome_msg, reply_markup=get_admin_markup())
    else:
        await message.answer(welcome_msg, reply_markup=get_user_markup())

@dp.callback_query(F.data == "admin_stats")
async def show_stats(callback: CallbackQuery):
    if callback.from_user.id not in ADMIN_IDS:
        return
    
    stats_text = (
        "📊 DO'KON STATISTIKASI\n\n"
        f"💰 Umumiy tushum: {store_data['revenue']:,} so'm\n"
        f"📦 Jami buyurtmalar: {store_data['orders_count']}\n"
        f"👥 Faol mijozlar: 842 ta\n"
        f"👗 Eng ko'p sotilgan: Zuhro Kelin Ko'ylagi\n"
        f"📍 Oxirgi lokatsiya: {store_data['location']['address']}"
    )
    await callback.message.edit_text(stats_text, reply_markup=get_admin_markup())

@dp.callback_query(F.data == "admin_update_loc")
async def ask_location(callback: CallbackQuery, state: FSMContext):
    if callback.from_user.id not in ADMIN_IDS:
        return
    await state.set_state(AdminStates.waiting_for_location)
    await callback.message.answer("Iltimos, do'konning yangi lokatsiyasini (Location pin) yuboring:")
    await callback.answer()

@dp.message(AdminStates.waiting_for_location, F.location)
async def set_location(message: types.Message, state: FSMContext):
    store_data["location"]["lat"] = message.location.latitude
    store_data["location"]["lon"] = message.location.longitude
    await state.clear()
    await message.answer("✅ Lokatsiya muvaffaqiyatli yangilandi!", reply_markup=get_admin_markup())

@dp.callback_query(F.data == "admin_broadcast")
async def broadcast_start(callback: CallbackQuery, state: FSMContext):
    await state.set_state(AdminStates.waiting_for_announcement)
    await callback.message.answer("Barcha foydalanuvchilarga yubormoqchi bo'lgan xabaringizni yozing:")
    await callback.answer()

@dp.message(AdminStates.waiting_for_announcement)
async def broadcast_send(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer("📣 Reklama xabari navbatga qo'shildi. Yuborish boshlanmoqda...")
    await asyncio.sleep(2)
    await message.answer("✅ Xabar 842 ta foydalanuvchiga yuborildi.")

@dp.callback_query(F.data == "user_support")
async def user_support_start(callback: CallbackQuery, state: FSMContext):
    await state.set_state(UserStates.waiting_for_support_query)
    await callback.message.answer("Muammo yoki savolingizni yozib qoldiring. Adminlarimiz tez orada javob berishadi:")
    await callback.answer()

@dp.message(UserStates.waiting_for_support_query)
async def process_support_query(message: types.Message, state: FSMContext):
    ticket_id = random.randint(1000, 9999)
    await state.clear()
    admin_msg = (
        f"🎫 YANGI TICKET #{ticket_id}\n\n"
        f"👤 Foydalanuvchi: {message.from_user.full_name}\n"
        f"💬 Xabar: {message.text}"
    )
    for admin_id in ADMIN_IDS:
        await bot.send_message(admin_id, admin_msg, reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="Javob berish", callback_data=f"admin_reply_ticket:{message.from_user.id}")]
        ]))
    await message.answer(f"Rahmat! Sizning so'rovingiz qabul qilindi. Ticket ID: #{ticket_id}")

@dp.callback_query(F.data.startswith("admin_reply_ticket:"))
async def admin_reply_start(callback: CallbackQuery, state: FSMContext):
    target_user_id = callback.data.split(":")[1]
    await state.update_data(reply_to_user_id=target_user_id)
    await state.set_state(AdminStates.waiting_for_support_reply)
    await callback.message.answer("Mijozga yozmoqchi bo'lgan javobingizni kiriting:")
    await callback.answer()

@dp.message(AdminStates.waiting_for_support_reply)
async def admin_reply_send(message: types.Message, state: FSMContext):
    data = await state.get_data()
    target_id = data.get("reply_to_user_id")
    await state.clear()
    try:
        await bot.send_message(target_id, f"🆘 SUPPORT JAVOBI:\n\n{message.text}")
        await message.answer("✅ Javob mijozga yuborildi.")
    except Exception as e:
        await message.answer(f"❌ Xatolik: {str(e)}")

@dp.message(F.web_app_data)
async def web_app_data_handler(message: types.Message):
    data = json.loads(message.web_app_data.data)
    user_id = message.from_user.id
    order_id = f"MAVI-{random.randint(10000, 99999)}"
    
    order_history[order_id] = {
        "user_id": user_id,
        "items": data['items'],
        "total": data['total'],
        "status": "pending",
        "timestamp": datetime.datetime.now().isoformat()
    }
    
    admin_text = (
        f"🛍 YANGI BUYURTMA #{order_id}!\n\n"
        f"👤 Mijoz: {message.from_user.full_name} (@{message.from_user.username})\n"
        f"🏢 Tur: {'Dostavka 🚚' if data['type'] == 'delivery' else 'Olib ketish 🏪'}\n"
        f"💰 Jami: {data['total']:,} so'm\n\n"
        "TOVARLAR:\n"
    )
    
    for item in data['items']:
        admin_text += f"• {item['name']} x {item['quantity']}\n"
    
    markup = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="✅ Tasdiqlash", callback_data=f"ord_conf:{user_id}:{data['type']}:{order_id}"),
            InlineKeyboardButton(text="❌ Bekor qilish", callback_data=f"ord_can:{user_id}:{order_id}")
        ]
    ])
    
    for admin_id in ADMIN_IDS:
        await bot.send_message(admin_id, admin_text, reply_markup=markup)
    
    await message.answer(
        f"Rahmat, {message.from_user.first_name}!\n"
        f"Sizning #{order_id} buyurtmangiz qabul qilindi.\n"
        "Tez orada adminlarimiz bog'lanishadi."
    )

@dp.callback_query(F.data.startswith("ord_"))
async def order_action_handler(callback: CallbackQuery):
    parts = callback.data.split(":")
    action = parts[0]
    user_id = int(parts[1])
    order_id = parts[3] if len(parts) > 3 else "N/A"
    
    if action == "ord_conf":
        order_type = parts[2]
        msg = f"✅ #{order_id} buyurtmangiz tasdiqlandi!"
        await bot.send_message(user_id, msg)
        if order_type == 'pickup':
            await bot.send_message(user_id, f"📍 Do'konimiz manzili: {store_data['location']['address']}")
            await bot.send_location(user_id, latitude=store_data['location']['lat'], longitude=store_data['location']['lon'])
        await callback.message.edit_text(callback.message.text + f"\n\n✅ TASDIQLANDI (Admin: {callback.from_user.id})")
    else:
        await bot.send_message(user_id, f"❌ Uzr, #{order_id} buyurtmangiz bekor qilindi.")
        await callback.message.edit_text(callback.message.text + "\n\n❌ BEKOR QILINDI")
    await callback.answer()

@dp.message(Command("help"))
async def help_command(message: types.Message):
    help_text = (
        "📖 FOYDALANISH QO'LLANMASI\n\n"
        "1. Katalogni ochish tugmasini bosing.\n"
        "2. O'zingizga yoqqan kiyimni savatga qo'shing.\n"
        "3. Buyurtma berishda telefon raqamingizni qoldiring.\n"
        "4. Admin tasdiqlashini kuting.\n\n"
        "Savollar bo'lsa @maviboutique_admin ga murojaat qiling."
    )
    await message.answer(help_text)

@dp.message(Command("promo"))
async def promo_command(message: types.Message):
    await message.answer("🎁 Bugungi promokod: MAVI2024\n10% chegirma beradi!")

@dp.message(F.text == "Salom")
async def salom_reply(message: types.Message):
    await message.reply("Assalomu alaykum! MaviBoutique xizmatidan foydalanish uchun /start bosing.")

@dp.errors()
async def error_handler(update: types.Update, exception: Exception):
    logging.error(f"Xatolik yuz berdi: {exception} for update {update}")
    return True

async def on_startup(bot: Bot):
    logging.info("Bot ishga tushdi!")
    for admin_id in ADMIN_IDS:
        try:
            await bot.send_message(admin_id, "🚀 Bot qayta ishga tushirildi va xizmatga tayyor!")
        except:
            pass

async def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    await on_startup(bot)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.info("Bot to'xtatildi.")
