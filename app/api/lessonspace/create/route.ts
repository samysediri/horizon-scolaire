import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "POST détecté dans /api/lessonspace/create"
  });
}
