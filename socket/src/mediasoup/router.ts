import { getWorker } from "./worker.js";
import mediaCodecs from "../config/mediaCodecs.js";

export async function createRouter(roomId: string) {
  try {
    const worker = await getWorker();
    const router = await worker.createRouter({ mediaCodecs });
    return router;
  } catch (error) {
    console.log("failed to create router for ", roomId);
    throw new Error("Router creation failed");
  }
}
