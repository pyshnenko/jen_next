import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { VpnUser, VpnFormData } from '@/src/types/vpn';

const execAsync = promisify(exec);

// Конфигурация
const PASSWD_FILE = '/etc/ocserv/ocpasswd.codegap';
const REMOTE_USER = 'root';
const REMOTE_SERVERS = [
  '185.229.66.80',
  '193.124.181.80',
  '103.85.115.152',
  '185.94.167.84',
  '77.110.110.106'
];

const isWindows = process.platform === 'win32';

// Временные данные для разработки на Windows
let mockUsers: VpnUser[] = [
  { username: 'dev_admin', group: 'debug' },
  { username: 'test_user', group: 'default' }
];

// Функция синхронизации
async function syncToNodes() {
  if (isWindows) {
    console.log('--- Dev Mode: Имитация рассылки на сервера ---');
    return;
  }

  const syncPromises = REMOTE_SERVERS.map(async (ip) => {
    try {
      // SCP с таймаутом 5 секунд, чтобы не вешать API
      await execAsync(
        `scp -o ConnectTimeout=5 -o StrictHostKeyChecking=no ${PASSWD_FILE} ${REMOTE_USER}@${ip}:${PASSWD_FILE}`
      );
      console.log(`Sync success: ${ip}`);
    } catch (err) {
      console.error(`Sync failed for ${ip}:`, err);
    }
  });

  await Promise.all(syncPromises);
}

export async function GET() {
  if (isWindows) return NextResponse.json(mockUsers);

  try {
    const data = await fs.readFile(PASSWD_FILE, 'utf-8');
    const users: VpnUser[] = data
      .split('\n')
      .filter(line => line.trim() !== '' && !line.startsWith('#'))
      .map(line => {
        const [username, group] = line.split(':');
        return { username, group: group || 'default' };
      });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка чтения файла паролей' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body: VpnFormData = await req.json();
  const { username, password } = body;

  if (!username || !password || !username.match(/^[a-zA-Z0-9_-]+$/)) {
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }

  if (isWindows) {
    const exists = mockUsers.find(u => u.username === username);
    if (!exists) mockUsers.push({ username, group: 'default' });
    return NextResponse.json({ success: true });
  }

  try {
    // Используем sudo и ocpasswd
    await execAsync(`printf "%s\n%s\n" "${password}" "${password}" | sudo ocpasswd -c ${PASSWD_FILE} ${username}`);
    await syncToNodes();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при сохранении пользователя' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) return NextResponse.json({ error: 'Имя не указано' }, { status: 400 });

  if (isWindows) {
    mockUsers = mockUsers.filter(u => u.username !== username);
    return NextResponse.json({ success: true });
  }

  try {
    await execAsync(`sudo ocpasswd -c ${PASSWD_FILE} -d ${username}`);
    await syncToNodes();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при удалении' }, { status: 500 });
  }
}
