import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const LOCAL_API = process.env.LOCAL_API_URL || "http://localhost:4001";
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function makeCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE};${secure}`;
}

export async function POST(req: Request) {
  try {
    const { login, pass } = await req.json();
    if (!login || !pass) {
      return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
    }

    // получаем список пользователей с локального API и ищем по логину
    const res = await fetch(`${LOCAL_API}/users`);
    if (!res.ok) {
      return NextResponse.json({ message: "Users service unavailable" }, { status: 502 });
    }
    const users = await res.json();
    const user = (users || []).find((u: any) => u.login === login);
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(pass, user.hash);
    if (!ok) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ Id: user.Id, login: user.login }, JWT_SECRET, { expiresIn: `${MAX_AGE}s` });

    // возвращаем минимальную информацию о пользователе
    return NextResponse.json(
      { success: true, user: { Id: user.Id, login: user.login, name: user.name, lastname: user.lastname } },
      { status: 200, headers: { "Set-Cookie": makeCookie(token) } }
    );
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("Auth POST error:", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (!match) return NextResponse.json({ authenticated: false }, { status: 401 });

    const token = match[1];
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Return minimal user info (you can enrich by querying LOCAL_API if needed)
    return NextResponse.json({ authenticated: true, user: { Id: payload.Id, login: payload.login } }, { status: 200 });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("Auth GET error:", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}