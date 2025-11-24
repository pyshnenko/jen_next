import { NextResponse } from 'next/server';

export async function POST() {
  // Clear cookie
  const cookie = `token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`;
  return NextResponse.json({ success: true }, { status: 200, headers: { 'Set-Cookie': cookie } });
}