import type { Request, Response } from "express";
import LectureServices from "../../services/lecture.services.js";

const getScheduledLectures = async (req: Request, res: Response) => {
  const lectures = await LectureServices.getLectures(req.user);
  return res.status(200).json({ success: true, lectures });
};

export default { getScheduledLectures };
