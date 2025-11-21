import * as dotenv from 'dotenv';
dotenv.config();
import { Telegraf } from 'telegraf';
import express from 'express';
const app = express();
const PORT = Number(process.env.PORT) || 55000;

// === МИДЛВЕРЫ ===
// Парсинг данных формы и JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/newStudent', (req, res) => {
  console.log('Получены данные:', req.body);

  const { phone, city } = req.body;
  if (!phone || !city) {
    return res.status(400).json({
      error: 'нет телефона или города',
    });
  }

  // Уведомление админам
  const message = `К вам обратился пользователь\nТелефон: ${phone}\nГород: ${city}`;
  bot.telegram.sendMessage(Number(process.env.TELEGRAM_CHAT_ID), message).catch(console.error);

  res.status(201).json({
    message: 'Студент успешно добавлен',
    student: { phone, city },
  });
});
const BOT_TOKEN = String(process.env.TGTOK);
// Создаём бота
if (!BOT_TOKEN) {
  console.error('❌ Не задан TGTOK в .env — бот не может запуститься.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Приветствие
bot.start((ctx) => {
  ctx.reply('🤖 Привет! Я бот для уведомлений. Жду события из API...');
  console.log('💬 Пользователь запустил бота:', ctx.from?.id);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Запуск бота
bot
  .launch(console.log('🤖 Telegram-бот успешно запущен и слушает команды'))
  .catch((err) => {
    console.error('❌ Ошибка запуска бота:', err);
  });

// Корректное завершение
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
