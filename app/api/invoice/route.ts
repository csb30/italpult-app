import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const invoices = await prisma.invoice.findMany({
      include: {
        sales: {
          include: {
            drink: true,
          },
        },
      },
    });
    return NextResponse.json(invoices);
  }

export async function POST(req: Request) {
  const body = await req.json();
  const invoice = await prisma.invoice.create({
    data: {
        type: body.type,
        paid: body.paid,
        status: body.status,
    },
  });
  return NextResponse.json(invoice, { status: 201 });
}