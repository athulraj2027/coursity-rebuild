import type { Role } from "@prisma/client";
import ParticipantRepository from "../repositories/participants.repositories.js";
import { AppError } from "../utils/AppError.js";

export const ParticipantService = {
  upsertParticipant: async (
    lectureId: string,
    user: { id: string; role: Role },
  ) => {
    const { id, role } = user;
    console.log("user id : ", id);
    console.log("role : ", role);

    // Check if user is already active in this lecture
    const existing = await ParticipantRepository.checkExistingParticipant(
      lectureId,
      id,
    );

    // If already active, just return it
    if (existing) {
      return existing;
    }

    // Otherwise create a new presence session
    const newParticipant = await ParticipantRepository.createNewParticipant(
      lectureId,
      id,
      role,
    );
    return newParticipant;
  },

  leaveLecture: async (
    lectureId: string,
    user: { userId: string; role: Role },
  ) => {
    const { userId } = user;
    const participant = await ParticipantRepository.getParticipant(
      lectureId,
      userId,
    );
    if (!participant) throw new AppError("Participant not found", 403);
    return await ParticipantRepository.leaveLecture(participant.id);
  },
};

export default ParticipantService;
