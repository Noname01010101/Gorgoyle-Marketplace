import { PrismaClient } from '@ai-store/prisma-db';

const client = new PrismaClient();

class ProviderQuery {
  static async getAllProviders() {
    const res = await client.aIProvider.findMany({});
    return res;
  }

  static async getProviderByName(name: string) {
    const res = await client.aIProvider.findUnique({
      where: { name: name },
    });
    return res;
  }
}

export default ProviderQuery;
