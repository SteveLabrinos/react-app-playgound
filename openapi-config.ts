import type { ConfigFile } from "@rtk-query/codegen-openapi";
import * as dotenv from "dotenv";

dotenv.config();

const config: ConfigFile = {
  schemaFile: process.env.API_PROJECT_PATH,
  apiFile: "./src/store/base-api.ts",
  apiImport: "baseApi",
  exportName: "playgroundApi",
  hooks: true,
  tag: true,
  outputFiles: {
    "./src/store/apis/periods-api.ts": {
      filterEndpoints: [/periods/i, /period$/i],
      exportName: "periodsApi",
    },
    "./src/store/apis/products-api.ts": {
      filterEndpoints: [/products/i, /product$/i],
      exportName: "productsApi",
    },
  },
};

export default config;
