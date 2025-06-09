import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const customers = await prisma.invoice.findMany({
    select: {
      paid: true,
    },
    distinct: ['paid'], // Fetch distinct values for the 'paid' column
  });

  return NextResponse.json(customers.map((customer) => customer.paid));
}