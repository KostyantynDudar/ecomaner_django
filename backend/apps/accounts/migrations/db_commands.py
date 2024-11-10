from aiogram import types, Bot
from asyncpg import UniqueViolationError

from utils.db_api.db_gino import db
from utils.db_api.schemas.user import User
from utils.db_api.schemas.photo import Photo


async def add_user(user_id: int, username: str):
    try:
        user = User(user_id=user_id, username=username)
        await user.create()

    except UniqueViolationError:
        pass


async def select_all_users():
    users = await User.query.gino.all()
    return users


async def update_for_registrations_user(user_id, first_name, last_name):
    user = await select_user(user_id=user_id)
    await user.update(first_name=first_name, last_name=last_name).apply()


async def select_user(user_id: int):
    user = await User.query.where(User.user_id == user_id).gino.first()
    return user


async def count_users():
    total = await db.func.count(User.id).gino.scalar()
    return total


async def add_new_user(user_id: int, referral=None):
    user = types.User.get_current()
    old_user = await select_user(user.id)
    if old_user:
        return old_user
    new_user = User()
    new_user.user_id = user.id
    new_user.balance = 0
    if user.username:
        new_user.username = user.username
    if referral:
        new_user.referral = int(referral)
        await update_ballance(user_id=int(referral))
    new_user.balance = 0
    await new_user.create()
    return new_user


async def add_new_photo(user_id: int, lat_id: float, long_id: float, comments: str, photo_id: str):
    try:
        photo = Photo(user_id=user_id, lat_id=lat_id, long_id=long_id, comments=comments, photo_id=photo_id)
        await photo.create()

    except UniqueViolationError:
        pass


async def get_ballance(user_id: int):
    user = await select_user(user_id)
    return user.balance


async def set_language(language):
    user_id = types.User.get_current().id
    user = await select_user(user_id)
    await user.update(language=language).apply()


async def update_ballance(user_id: int):
    user = await select_user(user_id)
    await user.update(balance=user.balance + 1).apply()


async def check_referrals():
    bot = Bot.get_current()
    user_id = types.User.get_current().id
    user = await select_user(user_id)
    referrals = await User.query.where(User.referral == user.user_id).gino.all()
    return " ,".join([
        f"{num + 1}. " + (await bot.get_chat(referral.user_id)).get_mention(as_html=True)
        for num, referral in enumerate(referrals)
    ])

# async def show_items():
# items = await Item.query.gino.all()
# return items
