import * as dotenv from 'dotenv';
dotenv.config();

export const BOT_TOKEN = process.env.TGTOK ?? null;
export const CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? null; // Может быть null
