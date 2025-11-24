import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const LOCAL_API = process.env.LOCAL_API_URL || 'http://localhost:4001';

// GET /api/users
export async function GET() {
  try {
    const res = await fetch(`${LOCAL_API}/users`);
    const data = await res.json();    
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Proxy GET /api/users error:', err);
    return new NextResponse(JSON.stringify({ message: 'Proxy error' }), { status: 502 });
  }
}

// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.pass, salt);
    const saveData = {
        login: body.login,
        hash,
        name: body.name,
        lastname: body.lastname,
        access: 1,
        project: '',
        folder: '',
    }
    try {
        const res = await fetch(`${LOCAL_API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
        });
        console.log(res)
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    }
    catch (err: any) {console.log(err)}
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Proxy POST /api/users error:', err);
    return new NextResponse(JSON.stringify({ message: 'Proxy error' }), { status: 502 });
  }
}