import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

class ModelQuery {
  static async getAllModels() {
    const res = await client.aIModel.findMany({
      include: {
        provider: true,
        fields: true,
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
    });
    return res;
  }
}

export default ModelQuery;
