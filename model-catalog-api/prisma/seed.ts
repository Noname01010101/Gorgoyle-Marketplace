import { PrismaClient } from "@prisma/client";
import { aiModels, fields, providers } from "../dbDevData";

const client = new PrismaClient();

async function seed() {
  await cleanAll();
  console.log("cleaned all tables");

  await populateFields();
  await populateProviders();
  await populateModels();
  console.log("populated all tables");
}
seed();

async function cleanAll() {
  await client.aIModel.deleteMany();
  await client.fields.deleteMany();
  await client.aIProvider.deleteMany();
}

async function populateFields() {
  await client.fields.createMany({
    data: fields,
  });
}

async function populateProviders() {
  await client.aIProvider.createMany({
    data: providers,
  });
}

async function populateModels() {
  await client.aIModel.create({
    data: aiModels[0],
  });

  await client.aIModel.create({
    data: aiModels[1],
  });
}
