import { config } from "dotenv";

config();

export const environment = {
  production: true,
  baseUrl: process.env["BASE_URL"],
};
