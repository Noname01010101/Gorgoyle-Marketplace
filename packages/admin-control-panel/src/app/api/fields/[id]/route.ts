import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/utils';
import { z } from 'zod';

const fieldSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single field
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const field = await prisma.fields.findUnique({
      where: { id: parseInt(id) },
      include: {
        aiModels: {
          select: {
            id: true,
            name: true,
            version: true,
          },
        },
      },
    });

    if (!field) {
      return NextResponse.json({ success: false, error: 'Field not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: field,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}

// PUT update field
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = fieldSchema.parse(body);

    const field = await prisma.fields.update({
      where: { id: parseInt(id) },
      data: validated,
    });

    return NextResponse.json({
      success: true,
      data: field,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}

// DELETE field
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.fields.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Field deleted successfully' },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: handleError(error) }, { status: 500 });
  }
}
