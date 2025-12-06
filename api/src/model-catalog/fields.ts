import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

class FieldsQuery {
  static async getAllFields() {
    const res = await client.fields.findMany({});
    return res;
  }

  static async getFieldByName(name: string) {
    const res = await client.fields.findUnique({ where: { name } });
    return res;
  }
}

export default FieldsQuery;
