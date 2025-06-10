import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const id = req?.nextUrl?.searchParams.get('id')
    const invoiceId = req?.nextUrl?.searchParams.get('invoiceId')
    if (invoiceId) {
        const sales = await prisma.sale.findMany({
            where: { invoiceId: parseInt(invoiceId) },
            include: { drink: true },
        });
        return NextResponse.json(sales);
    } else if (id) {
        const sales = await prisma.sale.findMany({
            where: { id: parseInt(id) },
            include: { drink: true },
        });
        return NextResponse.json(sales);
    }
    else {
        const sales = await prisma.sale.findMany({
            include: { drink: true },
        });
        return NextResponse.json(sales);
    }
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

export async function DELETE(req: Request) {
    const body = await req.json();
    const sale = await prisma.sale.delete({
        where: {
            id: body.id ? body.id : undefined,
            invoiceId: body.invoiceId ? body.invoiceId : undefined,
        },
    });
    return NextResponse.json(sale, { status: 200 });
}
