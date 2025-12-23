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

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single pricing
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const pricing = await prisma.modelPricing.findUnique({
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

    if (!pricing) {
      return NextResponse.json({ success: false, error: 'Pricing not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}

// PUT update pricing
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = pricingSchema.parse(body);

    const pricing = await prisma.modelPricing.update({
      where: { id: parseInt(id) },
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

// DELETE pricing
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.modelPricing.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Pricing deleted successfully' },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}
