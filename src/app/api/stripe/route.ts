import { userSubscriptions } from '@/lib/db/schema';
import { auth, currentUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return new NextResponse('unauthorized', { status: 401 });
    }

    const _userSubscriptions = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));
  } catch (error) {
    console.log('Error fetching');
  }
}
