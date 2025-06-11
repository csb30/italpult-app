import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/app/auth/isAuthenticated';

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const customers = await prisma.invoice.findMany({
    select: {
      paid: true,
    },
    distinct: ['paid'], // Fetch distinct values for the 'paid' column
  });

  return NextResponse.json(customers.map((customer) => customer.paid));
}