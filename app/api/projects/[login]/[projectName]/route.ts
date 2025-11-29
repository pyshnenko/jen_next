import { NextRequest, NextResponse } from "next/server";

const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:4001";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ login: string; projectName: string }> }
) {
  try {
    const { login, projectName } = await params;

    if (!login || typeof login !== "string" || !projectName || typeof projectName !== "string") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Forward DELETE to backend /project with JSON { login, projectName }
    console.log(LOCAL_API_URL)
    const forwardRes = await fetch(`${LOCAL_API_URL}/project`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, projectName }),
    });

    if (forwardRes.status === 200) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (forwardRes.status === 403) {
      return NextResponse.json({ error: "Deletion forbidden" }, { status: 403 });
    }

    const text = await forwardRes.text();
    return NextResponse.json({ error: "Upstream error", details: text }, { status: forwardRes.status });
  } catch (err: any) {
    console.error("Delete proxy error:", err);
    return NextResponse.json({ error: "Internal server error", message: String(err) }, { status: 500 });
  }
}