import asyncio
import json
import logging
import random
import datetime
import os
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery, LabeledPrice, PreCheckoutQuery, ReplyKeyboardMarkup, KeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

TOKEN = "8567309560:AAHoV_p4mFfQ4aZmp4QZ898Fxf5sZ3xIGJw"
WEB_APP_URL = "https://maviboutiqueuz.vercel.app"
ADMIN_IDS = [6365371142]

store_data = {
    "location": {"lat": 41.3782, "lon": 60.3642, "address": "Xiva Gipermarket 2-qavat"},
    "orders_count": 1285,
    "revenue": 542000000,
    "active_tickets": 12,
    "vip_customers": 48,
    "inventory_items": 120,
    "loyalty_pool": 15000000
}

order_history = {}
customer_database = {}

class AdminStates(StatesGroup):
    waiting_for_location = State()
    waiting_for_announcement = State()
    waiting_for_support_reply = State()
    waiting_for_ticket_id = State()
    waiting_for_product_edit = State()
    waiting_for_price_update = State()
    waiting_for_promo_code = State()
    waiting_for_broadcast_media = State()
    waiting_for_inventory_check = State()

class UserStates(StatesGroup):
    waiting_for_feedback = State()
    waiting_for_support_query = State()
    waiting_for_booking_date = State()
    waiting_for_profile_name = State()
    waiting_for_profile_phone = State()
    waiting_for_address = State()

bot = Bot(token=TOKEN)
dp = Dispatcher()

def get_admin_main_markup():
    buttons = [
        [InlineKeyboardButton(text="💎 Admin Dashboard", web_app=WebAppInfo(url=f"{WEB_APP_URL}?admin=true"))],
        [InlineKeyboardButton(text="📍 Lokatsiya Boshqaruvi", callback_data="admin_loc_menu")],
        [InlineKeyboardButton(text="📢 Marketing & Broadcast", callback_data="admin_marketing")],
        [InlineKeyboardButton(text="📈 Savdo Hisobotlari", callback_data="admin_reports")],
        [InlineKeyboardButton(text="🎫 Mijozlar Yordami", callback_data="admin_tickets")],
        [InlineKeyboardButton(text="👗 Inventarizatsiya", callback_data="admin_inventory")],
        [InlineKeyboardButton(text="⚙️ Tizim Sozlamalari", callback_data="admin_settings")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_user_main_markup():
    buttons = [
        [InlineKeyboardButton(text="🛍 Katalogni ko'rish", web_app=WebAppInfo(url=WEB_APP_URL))],
        [InlineKeyboardButton(text="✨ AI Stilist", callback_data="user_ai_chat")],
        [InlineKeyboardButton(text="📦 Buyurtmalarim", callback_data="user_orders")],
        [InlineKeyboardButton(text="💎 Mavi Loyalty", callback_data="user_loyalty")],
        [InlineKeyboardButton(text="🆘 Yordam markazi", callback_data="user_help")],
        [InlineKeyboardButton(text="🏪 Butiklar Manzili", callback_data="user_stores")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def format_currency(amount):
    return f"{amount:,}".replace(",", " ") + " so'm"

@dp.message(Command("start"))
async def start_handler(message: types.Message):
    user_id = message.from_user.id
    is_admin = user_id in ADMIN_IDS
    
    if user_id not in customer_database:
        customer_database[user_id] = {
            "name": message.from_user.full_name,
            "points": 500,
            "orders": 0,
            "tier": "Silver",
            "joined_at": datetime.datetime.now().isoformat()
        }
    
    welcome_text = (
        f"🌟 Assalomu alaykum, {message.from_user.first_name}!\n\n"
        "MaviBoutique - nafislik va go'zallik maskaniga xush kelibsiz.\n"
        "Biz sizga eksklyuziv ko'ylaklar, shohona obrazlar va yuqori darajadagi xizmatni taklif etamiz.\n\n"
        "Quyidagi menyu orqali bizning xizmatlarimizdan foydalanishingiz mumkin:"
    )
    
    if is_admin:
        welcome_text += "\n\n👔 Siz tizimda ADMIN sifatida ro'yxatdan o'tgansiz. Boshqaruv menyusi faollashtirildi."
        await message.answer(welcome_text, reply_markup=get_admin_main_markup())
    else:
        await message.answer(welcome_text, reply_markup=get_user_main_markup())

@dp.callback_query(F.data == "admin_reports")
async def admin_reports_handler(callback: CallbackQuery):
    if callback.from_user.id not in ADMIN_IDS:
        return await callback.answer("Ruxsat yo'q!", show_alert=True)
        
    report_text = (
        "📈 SAVDO VA ANALITIKA HISOBOTI\n\n"
        f"📅 Davr: {datetime.date.today().strftime('%B %Y')}\n"
        "--------------------------------\n"
        f"💰 Umumiy tushum: {format_currency(store_data['revenue'])}\n"
        f"📦 Jami buyurtmalar: {store_data['orders_count']}\n"
        f"💎 VIP mijozlar: {store_data['vip_customers']}\n"
        f"📈 O'sish sur'ati: +12.4%\n"
        f"🎫 Ochiq ticketlar: {store_data['active_tickets']}\n"
        "--------------------------------\n"
        "Top mahsulotlar:\n"
        "1. Zuhro Kelin Ko'ylagi (42 ta)\n"
        "2. Kechki Moviy Shifon (28 ta)\n"
        "3. Baxmal Qizil (19 ta)\n"
    )
    
    buttons = [
        [InlineKeyboardButton(text="📊 Batafsil PDF", callback_data="report_pdf")],
        [InlineKeyboardButton(text="🔙 Orqaga", callback_data="admin_main")]
    ]
    await callback.message.edit_text(report_text, reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))

@dp.callback_query(F.data == "admin_loc_menu")
async def admin_location_menu(callback: CallbackQuery):
    loc_text = (
        "📍 LOKATSIYA BOSHQARUVI\n\n"
        f"Hozirgi manzil: {store_data['location']['address']}\n"
        f"Kordinatalar: {store_data['location']['lat']}, {store_data['location']['lon']}\n\n"
        "Yangi manzil o'rnatish uchun quyidagi tugmani bosing."
    )
    buttons = [
        [InlineKeyboardButton(text="📍 Yangi Pin yuborish", callback_data="admin_set_pin")],
        [InlineKeyboardButton(text="📝 Matnni o'zgartirish", callback_data="admin_set_address_text")],
        [InlineKeyboardButton(text="🔙 Orqaga", callback_data="admin_main")]
    ]
    await callback.message.edit_text(loc_text, reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))

@dp.callback_query(F.data == "admin_set_pin")
async def admin_set_pin_start(callback: CallbackQuery, state: FSMContext):
    await state.set_state(AdminStates.waiting_for_location)
    await callback.message.answer("📍 Iltimos, xaritadan yangi manzilni tanlang va yuboring:")
    await callback.answer()

@dp.message(AdminStates.waiting_for_location, F.location)
async def admin_save_location(message: types.Message, state: FSMContext):
    store_data["location"]["lat"] = message.location.latitude
    store_data["location"]["lon"] = message.location.longitude
    await state.clear()
    await message.answer("✅ Yangi kordinatalar saqlandi!", reply_markup=get_admin_main_markup())

@dp.callback_query(F.data == "user_loyalty")
async def user_loyalty_handler(callback: CallbackQuery):
    user_id = callback.from_user.id
    user_info = customer_database.get(user_id, {"points": 0, "tier": "Silver"})
    
    loyalty_text = (
        "💎 MAVI LOYALTY TIZIMI\n\n"
        f"👤 Mijoz: {callback.from_user.full_name}\n"
        f"🏆 Daraja: {user_info['tier']}\n"
        f"💰 To'plangan ballar: {user_info['points']} ball\n\n"
        "Ballarni qanday ishlatish mumkin?\n"
        "• 1000 ball = 100 000 so'm chegirma\n"
        "• Eksklyuziv prokatga kirish\n"
        "• Shaxsiy stilist xizmati\n\n"
        "Har bir xaridingizdan 5% keshbek ballar ko'rinishida qaytadi!"
    )
    buttons = [
        [InlineKeyboardButton(text="🎁 Ballarni almashtirish", callback_data="loyalty_redeem")],
        [InlineKeyboardButton(text="🔙 Orqaga", callback_data="user_main")]
    ]
    await callback.message.edit_text(loyalty_text, reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))

@dp.callback_query(F.data == "admin_marketing")
async def admin_marketing_menu(callback: CallbackQuery):
    market_text = (
        "📢 MARKETING BO'LIMI\n\n"
        "Bu erda siz foydalanuvchilarga aksiya va yangiliklar yuborishingiz, "
        "yangi promokodlar yaratishingiz mumkin."
    )
    buttons = [
        [InlineKeyboardButton(text="📣 Umumiy Reklama", callback_data="admin_broadcast_start")],
        [InlineKeyboardButton(text="🎟 Yangi Promokod", callback_data="admin_new_promo")],
        [InlineKeyboardButton(text="📊 Kampaniya natijalari", callback_data="admin_camp_stats")],
        [InlineKeyboardButton(text="🔙 Orqaga", callback_data="admin_main")]
    ]
    await callback.message.edit_text(market_text, reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))

@dp.callback_query(F.data == "admin_broadcast_start")
async def admin_broadcast_init(callback: CallbackQuery, state: FSMContext):
    await state.set_state(AdminStates.waiting_for_announcement)
    await callback.message.answer("📝 Xabar matnini kiriting (rasm bilan yubormoqchi bo'lsangiz rasm yuboring):")
    await callback.answer()

@dp.message(AdminStates.waiting_for_announcement)
async def admin_broadcast_process(message: types.Message, state: FSMContext):
    await state.clear()
    msg_to_send = message.text if message.text else message.caption
    
    await message.answer(f"🚀 Xabar yuborish boshlandi...\n\nMatn: {msg_to_send[:50]}...")
    
    count = 0
    for uid in customer_database.keys():
        try:
            if message.photo:
                await bot.send_photo(uid, message.photo[-1].file_id, caption=msg_to_send)
            else:
                await bot.send_message(uid, msg_to_send)
            count += 1
            if count % 20 == 0:
                await asyncio.sleep(0.5)
        except:
            continue
            
    await message.answer(f"✅ Xabar muvaffaqiyatli yuborildi!\nJami: {count} ta foydalanuvchiga.")

@dp.callback_query(F.data == "user_help")
async def user_help_menu(callback: CallbackQuery):
    help_text = (
        "🆘 YORDAM MARKAZI\n\n"
        "Sizda qandaydir muammo yuzaga keldimi? Biz yordam berishdan xursandmiz.\n\n"
        "Quyidagi bo'limlardan birini tanlang:"
    )
    buttons = [
        [InlineKeyboardButton(text="💬 Admin bilan bog'lanish", callback_data="user_ticket_start")],
        [InlineKeyboardButton(text="📖 Ko'p beriladigan savollar", callback_data="user_faq")],
        [InlineKeyboardButton(text="📞 Telefon orqali bog'lanish", callback_data="user_call_support")],
        [InlineKeyboardButton(text="🔙 Orqaga", callback_data="user_main")]
    ]
    await callback.message.edit_text(help_text, reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))

@dp.callback_query(F.data == "user_ticket_start")
async def user_ticket_init(callback: CallbackQuery, state: FSMContext):
    await state.set_state(UserStates.waiting_for_support_query)
    await callback.message.answer("📝 Iltimos, muammoingizni batafsil tushuntirib yozing:")
    await callback.answer()

@dp.message(UserStates.waiting_for_support_query)
async def user_ticket_process(message: types.Message, state: FSMContext):
    ticket_id = f"T-{random.randint(1000, 9999)}"
    await state.clear()
    
    admin_alert = (
        f"🎫 YANGI TICKET #{ticket_id}\n\n"
        f"👤 Mijoz: {message.from_user.full_name}\n"
        f"🆔 ID: {message.from_user.id}\n"
        f"💬 Xabar: {message.text}"
    )
    
    for admin in ADMIN_IDS:
        await bot.send_message(admin, admin_alert, reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="Javob berish", callback_data=f"admin_reply:{message.from_user.id}:{ticket_id}")]
        ]))
        
    await message.answer(f"✅ So'rovingiz qabul qilindi. Ticket ID: #{ticket_id}\nAdminlarimiz tez orada javob berishadi.")

@dp.callback_query(F.data.startswith("admin_reply:"))
async def admin_reply_init(callback: CallbackQuery, state: FSMContext):
    parts = callback.data.split(":")
    uid = parts[1]
    tid = parts[2]
    
    await state.update_data(target_uid=uid, target_tid=tid)
    await state.set_state(AdminStates.waiting_for_support_reply)
    await callback.message.answer(f"📝 Mijozga javobingizni yozing (Ticket {tid}):")
    await callback.answer()

@dp.message(AdminStates.waiting_for_support_reply)
async def admin_reply_process(message: types.Message, state: FSMContext):
    data = await state.get_data()
    uid = data.get("target_uid")
    tid = data.get("target_tid")
    await state.clear()
    
    try:
        await bot.send_message(uid, f"🆘 SUPPORT JAVOBI (#{tid}):\n\n{message.text}")
        await message.answer("✅ Javob mijozga yuborildi.")
    except:
        await message.answer("❌ Mijozga yuborishda xatolik yuz berdi. Ehtimol botni bloklagandir.")

@dp.message(F.web_app_data)
async def web_app_data_handler(message: types.Message):
    data = json.loads(message.web_app_data.data)
    user_id = message.from_user.id
    order_id = f"MAVI-{random.randint(10000, 99999)}"
    
    total_val = data.get('total', 0)
    points_earned = int(total_val * 0.05 / 100)
    
    if user_id in customer_database:
        customer_database[user_id]["points"] += points_earned
        customer_database[user_id]["orders"] += 1
    
    admin_text = (
        f"🛍 YANGI BUYURTMA #{order_id}!\n\n"
        f"👤 Mijoz: {message.from_user.full_name}\n"
        f"🆔 User ID: {user_id}\n"
        f"🏢 Turi: {'Dostavka 🚚' if data['type'] == 'delivery' else 'Olib ketish 🏪'}\n"
        f"💰 Jami summa: {format_currency(total_val)}\n"
        f"🎁 Ballar berildi: {points_earned} ball\n\n"
        "Sotib olingan tovarlar:\n"
    )
    
    for item in data['items']:
        admin_text += f"• {item['name']} x {item['quantity']} ({format_currency(item['price'])})\n"
        
    markup = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="✅ Tasdiqlash", callback_data=f"ord_ok:{user_id}:{data['type']}:{order_id}"),
            InlineKeyboardButton(text="❌ Bekor qilish", callback_data=f"ord_no:{user_id}:{order_id}")
        ]
    ])
    
    for admin_id in ADMIN_IDS:
        await bot.send_message(admin_id, admin_text, reply_markup=markup)
        
    await message.answer(
        f"Rahmat, {message.from_user.first_name}!\n\n"
        f"Sizning #{order_id} buyurtmangiz qabul qilindi.\n"
        f"Ushbu xariddan siz {points_earned} ball to'pladingiz.\n\n"
        "Adminlarimiz tez orada siz bilan bog'lanishadi."
    )

@dp.callback_query(F.data.startswith("ord_"))
async def order_action_handler(callback: CallbackQuery):
    parts = callback.data.split(":")
    action = parts[0]
    user_id = int(parts[1])
    order_id = parts[3]
    
    if action == "ord_ok":
        order_type = parts[2]
        await bot.send_message(user_id, f"✅ Tabriklaymiz! #{order_id} buyurtmangiz tasdiqlandi.")
        if order_type == 'pickup':
            await bot.send_message(user_id, f"📍 Do'kon manzili: {store_data['location']['address']}")
            await bot.send_location(user_id, store_data['location']['lat'], store_data['location']['lon'])
        await callback.message.edit_text(callback.message.text + f"\n\n✅ STATUS: TASDIQLANDI")
    else:
        await bot.send_message(user_id, f"❌ Uzr, #{order_id} buyurtmangiz bekor qilindi. Batafsil ma'lumot uchun admin bilan bog'laning.")
        await callback.message.edit_text(callback.message.text + f"\n\n❌ STATUS: BEKOR QILINDI")
    await callback.answer()

@dp.callback_query(F.data == "admin_inventory")
async def admin_inventory_handler(callback: CallbackQuery):
    inv_text = (
        "👗 INVENTARIZATSIYA VA ZAXIRA\n\n"
        "Jami tovarlar: 120 ta\n"
        "Sotuvda: 85 ta\n"
        "Prokatda: 35 ta\n\n"
        "Sklad holati:\n"
        "• Kelin ko'ylaklar: 12 ta\n"
        "• Kechki ko'ylaklar: 45 ta\n"
        "• Aksessuarlar: 63 ta"
    )
    buttons = [
        [InlineKeyboardButton(text="➕ Tovar qo'shish", web_app=WebAppInfo(url=f"{WEB_APP_URL}?admin=true"))],
        [InlineKeyboardButton(text="🔄 Zaxirani yangilash", callback_data="admin_stock_refresh")],
        [InlineKeyboardButton(text="🔙 Orqaga", callback_data="admin_main")]
    ]
    await callback.message.edit_text(inv_text, reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))

@dp.callback_query(F.data == "admin_main")
async def back_to_admin_main(callback: CallbackQuery):
    await callback.message.edit_text("👔 ADMIN BOSHQARUV PANELI\n\nBarcha tizimlar normal ishlamoqda.", reply_markup=get_admin_main_markup())

@dp.callback_query(F.data == "user_main")
async def back_to_user_main(callback: CallbackQuery):
    await callback.message.edit_text("🌟 MaviBoutique xush kelibsiz! Marhamat, bo'limni tanlang:", reply_markup=get_user_main_markup())

@dp.message(Command("help"))
async def help_command(message: types.Message):
    await message.answer("ℹ️ Savollar bo'yicha @maviboutique_admin ga murojaat qiling yoki menyudagi 'Yordam' bo'limidan foydalaning.")

@dp.message(F.text == "Salom")
async def simple_reply(message: types.Message):
    await message.reply("Assalomu alaykum! MaviBoutique xush kelibsiz. Botni boshlash uchun /start bosing.")

@dp.callback_query(F.data == "user_stores")
async def stores_location_handler(callback: CallbackQuery):
    await callback.message.answer(f"📍 Bizning asosiy butigimiz: {store_data['location']['address']}")
    await bot.send_location(callback.from_user.id, store_data['location']['lat'], store_data['location']['lon'])
    await callback.answer()

@dp.callback_query(F.data == "user_ai_chat")
async def ai_chat_instruction(callback: CallbackQuery):
    await callback.answer("✨ AI Stilist Mini App ichida mavjud!", show_alert=True)

@dp.errors()
async def error_handler(update: types.Update, exception: Exception):
    logging.error(f"Xatolik: {exception}")
    return True

async def main():
    logging.basicConfig(level=logging.INFO)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except:
        logging.info("Bot to'xtatildi")
