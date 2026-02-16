import type { Producer, Transport } from "mediasoup/types";

export async function CreateProducer(transport: Transport, options: any) {
  return await transport.produce(options);
}

export async function PauseProducer(producer: Producer) {
  return await producer.pause();
}

export async function ResumeProducer(producer: Producer) {
  return await producer.resume();
}

export async function CloseProducer(producer: Producer) {
  return await producer.close();
}
