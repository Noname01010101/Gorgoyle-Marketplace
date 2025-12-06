import PriceRangeFilter from "./priceRange";
import { Prisma, PrismaClient } from "@prisma/client";

const client = new PrismaClient();

class SimilarPricesFinder {
  static async findSimilarPrices(modelName: string) {
    const pricing = await this.getPricing(modelName);
    const inputMin = pricing.input.times(0.9);
    const inputMax = pricing.input.times(1.1);
    const outputMin = pricing.output.times(0.9);
    const outputMax = pricing.output.times(1.1);
    const models = await PriceRangeFilter.filterByRangeInputOutput(
      inputMax,
      inputMin,
      outputMax,
      outputMin
    );

    return models;
  }

  private static async getPricing(modelName: string): Promise<{
    input: Prisma.Decimal;
    output: Prisma.Decimal;
  }> {
    const model = await client.modelPricing.findFirst({
      where: {
        name: modelName,
      },
    });

    if (model != null) {
      return {
        input: model.inputPricePerMillion,
        output: model.outputPricePerMillion,
      };
    } else {
      throw new Error("Could not find the inputed model");
    }
  }
}

export default SimilarPricesFinder;
