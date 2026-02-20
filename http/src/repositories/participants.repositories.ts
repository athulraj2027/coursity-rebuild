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

  getParticipantsByLectureId: async (lectureId: string) => {
    return prisma.participant.findMany({
      where: { lectureId },
      select: {
        userId: true,
        role: true,
        joinTime: true,
        leaveTime: true,
      },
    });
  },

  closeAllActiveParticipants: async (lectureId: string, endTime: Date) => {
    return prisma.participant.updateMany({
      where: {
        lectureId,
        leaveTime: null,
      },
      data: {
        leaveTime: endTime,
      },
    });
  },
};

export default ParticipantRepository;
