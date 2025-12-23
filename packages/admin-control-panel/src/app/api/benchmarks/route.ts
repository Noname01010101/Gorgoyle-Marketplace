import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/utils';
import { z } from 'zod';

const benchmarkSchema = z.object({
  modelId: z.number().int().positive('Model ID is required'),
  type: z.string().min(1, 'Type is required'),
  score: z.number(),
  runAt: z.string().or(z.date()),
  metadata: z.any().optional().nullable(),
});

// GET all benchmarks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const modelId = searchParams.get('modelId');
    const sortBy = searchParams.get('sortBy') || 'runAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (modelId) {
      where.modelId = parseInt(modelId);
    }

    if (search) {
      where.type = { contains: search, mode: 'insensitive' as const };
    }

    const [items, total] = await Promise.all([
      prisma.benchmark.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          model: {
            select: {
              id: true,
              name: true,
              version: true,
            },
          },
        },
      }),
      prisma.benchmark.count({ where }),
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

// POST create benchmark
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = benchmarkSchema.parse(body);

    const benchmark = await prisma.benchmark.create({
      data: {
        ...validated,
        runAt: new Date(validated.runAt),
      },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            version: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: benchmark,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}
