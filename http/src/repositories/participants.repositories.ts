import type { Role } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const ParticipantRepository = {
  checkExistingParticipant: async (lectureId: string, userId: string) =>
    await prisma.participant.findFirst({
      where: {
        lectureId,
        userId,
        leaveTime: null,
      },
    }),

  createNewParticipant: async (lectureId: string, userId: string, role: Role) =>
    await prisma.participant.create({
      data: {
        lectureId,
        userId,
        role,
        joinTime: new Date(),
      },
    }),

  leaveLecture: async (id: string) =>
    await prisma.participant.updateMany({
      where: {
        id,
      },
      data: {
        leaveTime: new Date(),
      },
    }),

  getParticipant: async (lectureId: string, userId: string) =>
    await prisma.participant.findFirst({
      where: {
        lectureId,
        userId,
        leaveTime: null,
      },
    }),
};

export default ParticipantRepository;
