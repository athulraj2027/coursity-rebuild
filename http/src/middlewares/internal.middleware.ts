import type { Request, Response, NextFunction } from "express";

export interface InternalRequest extends Request {
  internalUser?: {
    userId: string;
    role: string;
  };
}

export const internalAuth = (
  req: InternalRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const internalKey = req.headers["x-internal-key"];
    const userId = req.headers["x-user-id"] as string;
    const role = req.headers["x-user-role"] as string;

    if (!internalKey || internalKey !== process.env.INTERNAL_SECRET) {
      return res.status(401).json({
        message: "Unauthorized internal request",
      });
    }

    if (!userId || !role) {
      return res.status(400).json({
        message: "Missing internal user context",
      });
    }

    req.user = {
      id: userId,
      role,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal middleware error",
    });
  }
};
