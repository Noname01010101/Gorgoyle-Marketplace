import { PrismaClient } from '@ai-store/prisma-db';

const client = new PrismaClient();

class ModelQuery {
  static async getAllModels() {
    const res = await client.aIModel.findMany({
      include: {
        provider: true,
        fields: true,
        modelPricings: true,
      },
    });
    return res;
  }

  static async getModelsByName(name: string) {
    const res = await client.aIModel.findMany({
      where: { name: name },
      include: {
        provider: true,
        fields: true,
        modelPricings: true,
      },
    });
    return res;
  }

  static async getModelByNameAndVersion(name: string, version: string) {
    const res = await client.aIModel.findFirst({
      where: {
        name,
        version,
      },
      include: {
        provider: true,
        fields: true,
        modelPricings: true,
      },
    });
    return res;
  }
}

export default ModelQuery;
