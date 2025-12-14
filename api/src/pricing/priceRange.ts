import { Prisma, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const client = new PrismaClient();

class PriceRangeFilter {
  static async filterByRangeInput(min: number, max: number) {
    const models = await client.aIModel.findMany({
      include: {
        provider: true,
        fields: true,
        modelPricings: true,
      },
    });

    let filtered = models.filter((model) => {
      if (!model.modelPricings) return false;

      const maxDecimal = new Decimal(max);
      const minDecimal = new Decimal(min);

      const isLessThanMax =
        model.modelPricings.inputPricePerMillion.lessThanOrEqualTo(maxDecimal);
      const isGreaterThanMin =
        model.modelPricings.inputPricePerMillion.greaterThanOrEqualTo(
          minDecimal
        );

      return isLessThanMax && isGreaterThanMin;
    });
    return filtered;
  }

  static async filterByRangeOutput(min: number, max: number) {
    const pricesTable = await client.modelPricing.findMany({});
    let filtered = pricesTable.filter((e) => {
      // 1. Ensure formattedMax and formattedMin are converted to Decimal objects
      const maxDecimal = new Decimal(max);
      const minDecimal = new Decimal(min);

      // 2. Use the Decimal object's comparison methods
      const isLessThanMax =
        e.outputPricePerMillion.lessThanOrEqualTo(maxDecimal);
      const isGreaterThanMin =
        e.outputPricePerMillion.greaterThanOrEqualTo(minDecimal);

      return isLessThanMax && isGreaterThanMin;
    });
    return filtered;
  }

  static async filterByRangeInputOutput(
    inMax: Decimal | number,
    inMin: Decimal | number,
    outMax: Decimal | number,
    outMin: Decimal | number
  ) {
    const pricesTable = await client.modelPricing.findMany({});
    let filtered = pricesTable.filter((e) => {
      const maxDecimalIn = new Decimal(inMax);
      const minDecimalIn = new Decimal(inMin);
      const maxDecimalOut = new Decimal(outMax);
      const minDecimalOut = new Decimal(outMin);

      const isLessThanMaxIn =
        e.inputPricePerMillion.lessThanOrEqualTo(maxDecimalIn);
      const isGreaterThanMinIn =
        e.inputPricePerMillion.greaterThanOrEqualTo(minDecimalIn);
      const isLessThanMaxOut =
        e.outputPricePerMillion.lessThanOrEqualTo(maxDecimalOut);
      const isGreaterThanMinOut =
        e.outputPricePerMillion.greaterThanOrEqualTo(minDecimalOut);

      return (
        isLessThanMaxIn &&
        isGreaterThanMinIn &&
        isLessThanMaxOut &&
        isGreaterThanMinOut
      );
    });
    return filtered;
  }
}

export default PriceRangeFilter;
