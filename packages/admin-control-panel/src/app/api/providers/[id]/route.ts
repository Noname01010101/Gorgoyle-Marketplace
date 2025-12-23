import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/utils';
import { z } from 'zod';

const providerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  country: z.string().min(1, 'Country is required'),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single provider
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const provider = await prisma.aIProvider.findUnique({
      where: { id: parseInt(id) },
      include: {
        models: {
          select: {
            id: true,
            name: true,
            version: true,
            status: true,
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}

// PUT update provider
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = providerSchema.parse(body);

    const provider = await prisma.aIProvider.update({
      where: { id: parseInt(id) },
      data: validated,
    });

    return NextResponse.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}

// DELETE provider
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.aIProvider.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Provider deleted successfully' },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}
