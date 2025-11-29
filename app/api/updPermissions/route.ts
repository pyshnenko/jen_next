import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import jwt from "jsonwebtoken";
import { error } from 'console';
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
export async function PUT(req: Request) {
    try {
        const { login, acc } = await req.json();
        if (!login || !acc) {
        return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
        }
        const cookie = req.headers.get("cookie") || "";
        const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
        if (!match?.length) return NextResponse.json({ authenticated: false }, { status: 401 });
    
        const token = match[1];
        console.log(match[1])
        let payload: any;
        try {
            payload = jwt.verify(token, JWT_SECRET);
            if (payload.access < 10) return NextResponse.json({ error: 'no permissions' }, { status: 401 });
            else
                await axios.put('http://localhost:4001/access', {login, acc})
        } catch (e) {
            return NextResponse.json({ error: 'error from DB' }, { status: 500 });
        }
        return NextResponse.json(payload, { status: 200 });

    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('❌ Ошибка:', error.response?.data);
            return NextResponse.json(
                { error: 'Ошибка сервера' },
                { status: 500 }
            );
        } else {}
    }
}