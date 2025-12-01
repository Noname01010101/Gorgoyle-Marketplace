const fields = [
  { id: 1, name: "Text" },
  { id: 2, name: "Image" },
  { id: 3, name: "Video" },
  { id: 4, name: "Audio" },
  { id: 5, name: "Code" },
  { id: 6, name: "Multimodal" },
];

const providers = [
  { id: 1, name: "OpenAI", country: "US" },
  { id: 2, name: "Anthropic", country: "US" },
];

const aiModels = [
  {
    id: 1,
    name: "ChatGPT",
    version: "5.0",
    providerName: "OpenAI",
    releaseDate: new Date("2024-05-01"),
    fields: {
      connect: [{ name: "Text" }],
    },
  },
  {
    id: 2,
    name: "Claude",
    version: "Sonnet 4.1",
    providerName: "Anthropic",
    releaseDate: new Date("2025-02-23"),
    fields: {
      connect: [{ name: "Text" }, { name: "Code" }],
    },
  },
];

export { aiModels, fields, providers };
