import asyncio
import json
import logging
import random
import datetime
import os
import asyncpg
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery

# Ma'lumotlar bazasi sozlamalari (Railway yoki o'zingizning DB URL)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:BDAaILJKOITNLlMOjJNfWiRPbICwEcpZ@centerbeam.proxy.rlwy.net:35489/railway")
TOKEN = "8567309560:AAHoV_p4mFfQ4aZmp4QZ898Fxf5sZ3xIGJw"
WEB_APP_URL = "https://maviboutiqueuz.vercel.app"
ADMIN_IDS = [6365371142]

bot = Bot(token=TOKEN)
dp = Dispatcher()

async def init_db():
    conn = await asyncpg.connect(DATABASE_URL)
    # Mahsulotlar jadvali
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            price NUMERIC,
            category TEXT,
            images TEXT[],
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Buyurtmalar jadvali
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            order_number TEXT,
            user_id BIGINT,
            total_amount NUMERIC,
            items JSONB,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    await conn.close()

def get_admin_main_markup():
    buttons = [
        [InlineKeyboardButton(text="💎 Admin Panel (Web)", web_app=WebAppInfo(url=f"{WEB_APP_URL}?admin=true"))],
        [InlineKeyboardButton(text="📈 Savdo Hisoboti", callback_data="admin_reports")],
        [InlineKeyboardButton(text="📢 Reklama yuborish", callback_data="admin_broadcast")],
        [InlineKeyboardButton(text="⚙️ Sozlamalar", callback_data="admin_settings")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_user_main_markup():
    buttons = [
        [InlineKeyboardButton(text="🛍 Katalog (Web App)", web_app=WebAppInfo(url=WEB_APP_URL))],
        [InlineKeyboardButton(text="📦 Buyurtmalarim", callback_data="user_orders")],
        [InlineKeyboardButton(text="📍 Bizning manzil", callback_data="user_location")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

@dp.message(Command("start"))
async def start_handler(message: types.Message):
    is_admin = message.from_user.id in ADMIN_IDS
    welcome_msg = "Xush kelibsiz! MaviBoutique butigining rasmiy botidasiz."
    markup = get_admin_main_markup() if is_admin else get_user_main_markup()
    await message.answer(welcome_msg, reply_markup=markup)

@dp.message(F.web_app_data)
async def handle_web_app_data(message: types.Message):
    data = json.loads(message.web_app_data.data)
    # Buyurtmani bazaga saqlash
    conn = await asyncpg.connect(DATABASE_URL)
    order_num = f"MAVI-{random.randint(1000,9999)}"
    await conn.execute(
        "INSERT INTO orders (order_number, user_id, total_amount, items) VALUES ($1, $2, $3, $4)",
        order_num, message.from_user.id, data.get('total'), json.dumps(data.get('items'))
    )
    await conn.close()
    
    await message.answer(f"Rahmat! Buyurtmangiz qabul qilindi: #{order_num}")
    # Adminlarga xabar yuborish
    for admin_id in ADMIN_IDS:
        await bot.send_message(admin_id, f"Yangi buyurtma! #{order_num}\nSumma: {data.get('total')} so'm")

async def main():
    logging.basicConfig(level=logging.INFO)
    await init_db()
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
