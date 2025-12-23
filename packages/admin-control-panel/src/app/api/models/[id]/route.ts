import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/utils';
import { z } from 'zod';

const modelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  version: z.string().min(1, 'Version is required'),
  providerName: z.string().min(1, 'Provider is required'),
  releaseDate: z.string().or(z.date()),
  status: z.string().min(1, 'Status is required'),
  deprecated: z.boolean().default(false),
  capabilities: z.any(),
  modalities: z.any(),
  supportedFormats: z.any(),
  languages: z.any(),
  metadata: z.any().optional().nullable(),
  modelPricingId: z.number().int().positive('Pricing ID is required'),
  fieldIds: z.array(z.number().int()).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single model
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const model = await prisma.aIModel.findUnique({
      where: { id: parseInt(id) },
      include: {
        provider: true,
        modelPricings: true,
        fields: true,
        benchmarks: {
          orderBy: { runAt: 'desc' },
        },
      },
    });

    if (!model) {
      return NextResponse.json({ success: false, error: 'Model not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: model,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}

// PUT update model
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = modelSchema.parse(body);

    const { fieldIds, ...modelData } = validated;

    // First disconnect all existing fields, then connect new ones
    const model = await prisma.aIModel.update({
      where: { id: parseInt(id) },
      data: {
        ...modelData,
        releaseDate: new Date(validated.releaseDate),
        fields: {
          set: [], // Disconnect all
          connect: fieldIds ? fieldIds.map((id) => ({ id })) : [],
        },
      },
      include: {
        provider: true,
        modelPricings: true,
        fields: true,
        benchmarks: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: model,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}

// DELETE model
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.aIModel.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Model deleted successfully' },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}
