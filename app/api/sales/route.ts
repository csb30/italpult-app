import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const sales = await prisma.sale.findMany({
        include: { drink: true },
    });
    return NextResponse.json(sales);
}

export async function POST(req: Request) {
    const body = await req.json();
    const sale = await prisma.sale.create({
        data: {
            drinkId: body.drinkId,
            invoiceId: body.invoiceId,
            quantity: body.quantity,
        },
    });
    return NextResponse.json(sale, { status: 201 });
}