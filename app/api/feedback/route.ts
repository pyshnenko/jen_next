import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const LOCAL_API = process.env.LOCAL_API_URL || 'http://localhost:4001';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

interface User {
    Id: number;
    login: string;
    access: number;
    name: string;
    lastname: string;
}

interface AnswerData {
    user: User;
    answer: string;
    date: string;
}

// Вспомогательная функция для проверки JWT токена из cookie
function getAuthUser(req: Request): User|null {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  if (!match) return null;

  const token = match[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as User;
    return payload;
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {

    const user = getAuthUser(req);

    if (!user) {
    
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = (await req.json()) as {answer: string};

    async function sendStudentData(data: AnswerData): Promise<void> {
        const url = 'http://localhost:55000/api/feedback';

        try {
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('✅ Успешный ответ:', response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
            if (error.response) {
                // Сервер ответил с кодом ошибки (4xx, 5xx)
                console.error('❌ Ошибка от сервера:', error.response.status, error.response.data);
            } else if (error.request) {
                // Запрос отправлен, но нет ответа (сервер не доступен)
                console.error('❌ Нет ответа от сервера. Убедитесь, что бот-сервер запущен на порту 55000');
            } else {
                // Ошибка при настройке запроса
                console.error('❌ Ошибка настройки запроса:', error.message);
            }
            } else {
            // Неожиданная ошибка
            console.error('❌ Неизвестная ошибка:', error);
            }
        }
    }

    sendStudentData({
        date: new Date().toISOString(),
        answer: body.answer,
        user
    })

    return NextResponse.json({
        message: 'send'
    },{status: 200}
    )
}