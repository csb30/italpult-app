import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const drinks = await prisma.drink.findMany();
  return NextResponse.json(drinks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const drink = await prisma.drink.create({
    data: {
      name: body.name,
      price: body.price,
      description: body.description,
    },
  });
  return NextResponse.json(drink, { status: 201 });
}