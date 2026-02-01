
import asyncio
import json
import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

TOKEN = "8567309560:AAHoV_p4mFfQ4aZmp4QZ898Fxf5sZ3xIGJw"
WEB_APP_URL = "https://maviboutiqueuz.vercel.app"
ADMIN_IDS = [6365371142]  # Admin ID-ingizni kiriting

# Global o'zgaruvchi sifatida lokatsiyani saqlaymiz (Default: Xiva Gipermarket)
current_location = {
    "lat": 41.3782,
    "lon": 60.3642
}

class AdminStates(StatesGroup):
    waiting_for_location = State()

bot = Bot(token=TOKEN)
dp = Dispatcher()

def get_admin_markup():
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="👗 Katalog & Admin WebApp", web_app=WebAppInfo(url=WEB_APP_URL))],
        [InlineKeyboardButton(text="📍 Do'kon lokatsiyasini yangilash", callback_data="update_store_location")]
    ])

@dp.message(Command("start"))
async def start_handler(message: types.Message):
    is_admin = message.from_user.id in ADMIN_IDS
    
    welcome_text = (
        f"Assalomu alaykum, {message.from_user.full_name}!\n\n"
        "MaviBoutique - nafislik va go'zallik maskani.\n"
    )
    
    if is_admin:
        welcome_text += "Siz adminsiz! Quyidagi tugma orqali do'konni boshqarishingiz va lokatsiyani yangilashingiz mumkin."
        markup = get_admin_markup()
    else:
        markup = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🛍 Katalogni ko'rish", web_app=WebAppInfo(url=WEB_APP_URL))]
        ])
    
    await message.answer(welcome_text, reply_markup=markup)

@dp.callback_query(F.data == "update_store_location")
async def ask_location(callback: CallbackQuery, state: FSMContext):
    if callback.from_user.id not in ADMIN_IDS:
        await callback.answer("Siz admin emassiz!", show_alert=True)
        return
    
    await state.set_state(AdminStates.waiting_for_location)
    await callback.message.answer("Iltimos, do'konning yangi lokatsiyasini (Location pin) yuboring:")
    await callback.answer()

@dp.message(AdminStates.waiting_for_location, F.location)
async def set_location(message: types.Message, state: FSMContext):
    global current_location
    current_location["lat"] = message.location.latitude
    current_location["lon"] = message.location.longitude
    
    await state.clear()
    await message.answer(
        f"✅ Lokatsiya muvaffaqiyatli yangilandi!\n"
        f"Endi 'Olib ketish' buyurtmalari uchun ushbu lokatsiya yuboriladi.",
        reply_markup=get_admin_markup()
    )

@dp.message(F.web_app_data)
async def web_app_data_handler(message: types.Message):
    data = json.loads(message.web_app_data.data)
    user_id = message.from_user.id
    
    admin_text = f"🛍 YANGI BUYURTMA!\n\n"
    admin_text += f"👤 Mijoz: {message.from_user.full_name} (@{message.from_user.username})\n"
    admin_text += f"🏢 Tur: {'Dostavka 🚚' if data['type'] == 'delivery' else 'Olib ketish 🏪'}\n\n"
    
    for item in data['items']:
        admin_text += f"• {item['name']} x {item['quantity']}\n"
    
    admin_text += f"\n💰 Jami: {data['total']:,} so'm"
    
    markup = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="✅ Tasdiqlash", callback_data=f"order_confirm:{user_id}:{data['type']}"),
            InlineKeyboardButton(text="❌ Bekor qilish", callback_data=f"order_cancel:{user_id}")
        ]
    ])
    
    for admin_id in ADMIN_IDS:
        await bot.send_message(admin_id, admin_text, reply_markup=markup)
    
    await message.answer("Rahmat! Buyurtmangiz adminga yuborildi. Tez orada tasdiq olasiz.")

@dp.callback_query(F.data.startswith("order_"))
async def order_callback_handler(callback: CallbackQuery):
    parts = callback.data.split(":")
    action = parts[0]
    user_id = int(parts[1])
    
    if action == "order_confirm":
        order_type = parts[2]
        await bot.send_message(user_id, "✅ Buyurtmangiz TASDIQLANDI!\n\nMaviBoutique-ni tanlaganingiz uchun rahmat.")
        
        if order_type == 'pickup':
            await bot.send_message(user_id, "📍 Do'konimiz manzili: Xiva shahri, Gipermarket 2-qavat.")
            # Admin tomonidan o'rnatilgan oxirgi lokatsiyani yuboramiz
            await bot.send_location(user_id, latitude=current_location["lat"], longitude=current_location["lon"])
            
        await callback.message.edit_text(callback.message.text + "\n\n✅ TASDIQLANDI")
    else:
        await bot.send_message(user_id, "❌ Uzr, sizning buyurtmangiz bekor qilindi.")
        await callback.message.edit_text(callback.message.text + "\n\n❌ BEKOR QILINDI")
    
    await callback.answer()

async def main():
    logging.basicConfig(level=logging.INFO)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
