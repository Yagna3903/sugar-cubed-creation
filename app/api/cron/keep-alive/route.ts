import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Verify Vercel Cron Secret
  // Vercel automatically sends this standard header for cron requests if CRON_SECRET is set in environment variables
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Ping the Supabase database via Prisma to keep it active.
    // A simple SELECT 1 is enough to show activity for the free tier.
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ status: 'ok', message: 'Database pinged successfully to keep active.' });
  } catch (error) {
    console.error('Error pinging database:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to ping database' }, { status: 500 });
  }
}
