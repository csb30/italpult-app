import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/app/auth/isAuthenticated';

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  const drinks = await prisma.drink.findMany();
  return NextResponse.json(drinks);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const drink = await prisma.drink.delete({
    where: {
      id: body.id,
    },
  });
  return NextResponse.json(drink, { status: 200 });
}