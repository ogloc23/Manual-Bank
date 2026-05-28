import { AuthRequest } from "../middlewares/authMiddleware";

interface ContextParams {
  req: AuthRequest;
}

export const createContext = async ({
  req,
}: ContextParams) => {
  return {
    user: req.user || null,
  };
};