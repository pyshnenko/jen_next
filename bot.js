import * as dotenv from 'dotenv';
dotenv.config();
import { Telegraf } from 'telegraf';
import { SocksProxyAgent } from 'socks-proxy-agent';
const proxyUrl = 'socks5://uw4z2dwd:dvcyhp1i30u2@localhost:35437';
const agent = new SocksProxyAgent(proxyUrl);
import express from 'express';
const app = express();
const PORT = Number(process.env.PORT) || 55000;

// === МИДЛВЕРЫ ===
// Парсинг данных формы и JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/feedback', async (req, res) => {
  const {user, answer, date} = req.body;

  if (!user || !answer || !date) {
    return res.status(400).json({
      error: 'Не все поля заполнены'
    })
  }
  const realDate = new Date(date);

  const message = `Вопрос от ${realDate.toLocaleString('ru')} 
  ${user.lastname} ${user.name} (${user.login} с уровнем ${user.access}) спрашивает:

  ${answer}
  `
  bot.telegram.sendMessage(Number(process.env.TELEGRAM_CHAT_ID), message).catch(console.error);
  res.status(201).json({
    message: 'Ответ успешно отправлен',
  })
});

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

const bot = new Telegraf(BOT_TOKEN,{
  telegram: {
    agent: agent // Все запросы к API Telegram пойдут через этот сокет
  }
});

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
