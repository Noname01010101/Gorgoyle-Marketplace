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

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single benchmark
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const benchmark = await prisma.benchmark.findUnique({
      where: { id: parseInt(id) },
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

    if (!benchmark) {
      return NextResponse.json({ success: false, error: 'Benchmark not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: benchmark,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}

// PUT update benchmark
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = benchmarkSchema.parse(body);

    const benchmark = await prisma.benchmark.update({
      where: { id: parseInt(id) },
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

// DELETE benchmark
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.benchmark.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Benchmark deleted successfully' },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}
