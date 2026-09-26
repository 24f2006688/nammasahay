import { SarvamAIClient } from "sarvamai";

if (!process.env.SARVAM_API_KEY) {
  throw new Error("SARVAM_API_KEY is not configured");
}

export const sarvam = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY,
});