import { getWorker } from "./worker.js";
import mediaCodecs from "../config/mediaCodecs.js";

export async function createRouter() {
  try {
    const worker = await getWorker();
    const router = await worker.createRouter({ mediaCodecs });
    return router;
  } catch (error) {
    console.log("failed to create router");
    throw new Error("Router creation failed");
  }
}
