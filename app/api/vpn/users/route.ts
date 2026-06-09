import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { VpnUser } from '@/src/types/vpn';

const execAsync = promisify(exec);
const PASSWD_FILE = '/etc/ocserv/ocpasswd.codegap';

// --- MOCK LOGIC FOR WINDOWS ---
const isWindows = process.platform === 'win32';
// Имитация базы данных в памяти для разработки
let mockUsers: VpnUser[] = [
  { username: 'dev_user', group: 'debug' },
  { username: 'test_admin', group: 'debug' }
];
// ------------------------------

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
    return NextResponse.json({ error: 'Read error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { username, password }: { username?: string, password?: string } = await req.json();
  
  if (!username?.match(/^[a-zA-Z0-9_-]+$/)) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  if (isWindows) {
    // Имитируем сохранение/обновление
    const exists = mockUsers.find(u => u.username === username);
    if (!exists) mockUsers.push({ username, group: 'default' });
    return NextResponse.json({ success: true, message: 'Mock: user saved' });
  }

  try {
    await execAsync(`printf "%s\n%s\n" "${password}" "${password}" | ocpasswd -c ${PASSWD_FILE} ${username}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  
  if (!username) return NextResponse.json({ error: 'No username' }, { status: 400 });

  if (isWindows) {
    mockUsers = mockUsers.filter(u => u.username !== username);
    return NextResponse.json({ success: true, message: 'Mock: user deleted' });
  }

  try {
    await execAsync(`ocpasswd -c ${PASSWD_FILE} -d ${username}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
