import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const id = req?.nextUrl?.searchParams.get('id')
  const status = req?.nextUrl?.searchParams.get('status')
  if (id) {
    const invoices = await prisma.invoice.findMany({
      where: { id: parseInt(id) },
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
  else if (status) {
    const invoices = await prisma.invoice.findMany({
      where: { status: parseInt(status) },
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
  else {
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

export async function DELETE(req: Request) {
  const body = await req.json();
  const sales = await prisma.sale.deleteMany({
    where: {
      invoiceId: body.id ? body.id : undefined,
    },
  });
  const invoice = await prisma.invoice.delete({
    where: {
      id: body.id ? body.id : undefined,
    },
  });
  return NextResponse.json(invoice, { status: 200 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const invoice = await prisma.invoice.update({
    where: { id: body.id },
    data: {
      status: body.status,
    },
  });
  return NextResponse.json(invoice, { status: 200 });
}