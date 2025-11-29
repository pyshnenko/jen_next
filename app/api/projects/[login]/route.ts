import { NextRequest, NextResponse } from 'next/server';

const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:4001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ login: string }> } // ← params — это Promise
) {
  try {
    // ✅ Распаковываем params
    const { login } = await params;

    // Валидация
    if (!login || typeof login !== 'string') {
      return NextResponse.json({ error: 'Invalid login' }, { status: 400 });
    }

    const safeLogin = encodeURIComponent(login);

    const res = await fetch(`http://localhost:4001/projects/${safeLogin}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // или 'force-cache', если нужно кэшировать
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Upstream error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch projects from backend', details: errorText },
        { status: res.status }
      );
    }

    const projects = await res.json();

    return NextResponse.json(projects, { status: 200 });
  } catch (err: any) {
    console.error('Proxy error:', err);
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ login: string }> }
) {
  try {
    const { login } = await params;

    if (!login || typeof login !== 'string') {
      return NextResponse.json({ error: 'Invalid login' }, { status: 400 });
    }

    // Попытка прочитать projectName из тела запроса
    let projectName: string | undefined;
    try {
      const body = await request.json().catch(() => null);
      projectName = body?.projectName ?? body?.project_name ?? body?.name;
    } catch {
      // ignore JSON parse errors
    }

    // Если не в теле — попробуем взять из URL /api/projects/{login}/{projectName}
    if (!projectName) {
      const url = new URL(request.url);
      const parts = url.pathname.split('/').filter(Boolean); // ["api","projects","{login}","{maybeProject}"]
      const loginIndex = parts.indexOf(login);
      if (loginIndex !== -1 && parts.length > loginIndex + 1) {
        projectName = decodeURIComponent(parts[loginIndex + 1]);
      }
    }

    if (!projectName) {
      return NextResponse.json({ error: 'Missing projectName' }, { status: 400 });
    }

    // Forward DELETE to backend /project with JSON { login, projectName }
    const forwardRes = await fetch(`${LOCAL_API_URL}/project`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, projectName }),
    });

    if (forwardRes.status === 200) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (forwardRes.status === 403) {
      return NextResponse.json({ error: 'Deletion forbidden' }, { status: 403 });
    }

    const text = await forwardRes.text();
    return NextResponse.json({ error: 'Upstream error', details: text }, { status: forwardRes.status });
  } catch (err: any) {
    console.error('Delete proxy error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
