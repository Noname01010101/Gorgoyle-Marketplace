-- CreateEnum
CREATE TYPE "BenchmarkType" AS ENUM ('MMLU', 'ACCURACY', 'EFFICIENCY');

-- CreateTable
CREATE TABLE "AIModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "capabilities" JSONB NOT NULL,
    "modalities" JSONB NOT NULL,
    "supportedFormats" JSONB NOT NULL,
    "languages" JSONB NOT NULL,
    "metadata" JSONB,
    "modelPricingId" INTEGER NOT NULL,

    CONSTRAINT "AIModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fields" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "AIProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelPricing" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "outputPricePerMillion" DECIMAL(10,2) NOT NULL,
    "inputPricePerMillion" DECIMAL(10,2) NOT NULL,
    "cachedPricePerMillion" DECIMAL(10,2),
    "trainingPricePerMillion" DECIMAL(10,2),
    "currency" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "normalizedPerMillion" DECIMAL(10,2),

    CONSTRAINT "ModelPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" SERIAL NOT NULL,
    "modelId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AIModelToFields" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AIModelToFields_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIModel_name_version_key" ON "AIModel"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Fields_name_key" ON "Fields"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AIProvider_name_key" ON "AIProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ModelPricing_name_key" ON "ModelPricing"("name");

-- CreateIndex
CREATE INDEX "_AIModelToFields_B_index" ON "_AIModelToFields"("B");

-- AddForeignKey
ALTER TABLE "AIModel" ADD CONSTRAINT "AIModel_providerName_fkey" FOREIGN KEY ("providerName") REFERENCES "AIProvider"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIModel" ADD CONSTRAINT "AIModel_modelPricingId_fkey" FOREIGN KEY ("modelPricingId") REFERENCES "ModelPricing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benchmark" ADD CONSTRAINT "Benchmark_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "AIModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AIModelToFields" ADD CONSTRAINT "_AIModelToFields_A_fkey" FOREIGN KEY ("A") REFERENCES "AIModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AIModelToFields" ADD CONSTRAINT "_AIModelToFields_B_fkey" FOREIGN KEY ("B") REFERENCES "Fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
