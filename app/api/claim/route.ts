import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📩 Получены данные:', body);
    sendStudentData(body)

    return NextResponse.json(
      { message: 'Данные сохранены', data: body },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
interface StudentData {
  phone: string;
  city: string;
  [key: string]: any; // Дополнительные поля (опционально)
}

async function sendStudentData(data: StudentData): Promise<void> {
  const url = 'http://localhost:55000/api/newStudent';

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