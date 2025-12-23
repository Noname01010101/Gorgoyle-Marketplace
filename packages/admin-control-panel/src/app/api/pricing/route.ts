import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/utils';
import { z } from 'zod';

const pricingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  outputPricePerMillion: z.string().or(z.number()),
  inputPricePerMillion: z.string().or(z.number()),
  cachedPricePerMillion: z.string().or(z.number()).optional().nullable(),
  trainingPricePerMillion: z.string().or(z.number()).optional().nullable(),
  currency: z.string().min(1, 'Currency is required'),
  unit: z.string().min(1, 'Unit is required'),
  effectiveAt: z.string().or(z.date()),
  normalizedPerMillion: z.string().or(z.number()).optional().nullable(),
});

// GET all pricing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { currency: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.modelPricing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { model: true },
          },
        },
      }),
      prisma.modelPricing.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}

// POST create pricing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = pricingSchema.parse(body);

    const pricing = await prisma.modelPricing.create({
      data: {
        ...validated,
        effectiveAt: new Date(validated.effectiveAt),
      },
    });

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}
