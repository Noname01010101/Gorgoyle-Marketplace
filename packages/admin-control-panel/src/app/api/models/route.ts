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

// GET all models
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const provider = searchParams.get('provider') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { version: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (provider) {
      where.providerName = provider;
    }

    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.aIModel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              country: true,
            },
          },
          modelPricings: {
            select: {
              id: true,
              name: true,
              inputPricePerMillion: true,
              outputPricePerMillion: true,
              currency: true,
            },
          },
          fields: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { benchmarks: true },
          },
        },
      }),
      prisma.aIModel.count({ where }),
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

// POST create model
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = modelSchema.parse(body);

    const { fieldIds, ...modelData } = validated;

    const model = await prisma.aIModel.create({
      data: {
        name: modelData.name,
        version: modelData.version,
        providerName: modelData.providerName,
        releaseDate: new Date(validated.releaseDate),
        status: modelData.status,
        deprecated: modelData.deprecated,
        capabilities: modelData.capabilities,
        modalities: modelData.modalities,
        supportedFormats: modelData.supportedFormats,
        languages: modelData.languages,
        metadata: modelData.metadata,
        modelPricingId: modelData.modelPricingId,
        fields: fieldIds
          ? {
              connect: fieldIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        provider: true,
        modelPricings: true,
        fields: true,
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
