import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'logs', 'notifications.json');

// Убедись, что папка logs существует
if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📩 Получены данные:', body);

    // Сохраняем уведомление в файл
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: body,
      sent: false,
    };

    const logs: any[] = fs.existsSync(LOG_FILE)
      ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'))
      : [];

    logs.push(logEntry);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');

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
