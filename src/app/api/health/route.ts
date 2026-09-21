import { NextResponse } from "next/server";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

/** Health check da aplicação e da conexão com o banco. */
export async function GET() {
  let database: "ok" | "error" = "ok";
  let detail: string | undefined;

  try {
    await db.$queryRaw`SELECT 1`;
  } catch (error) {
    database = "error";
    detail = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(
    { status: database === "ok" ? "ok" : "degraded", database, detail, timestamp: new Date().toISOString() },
    { status: database === "ok" ? 200 : 503 },
  );
}
