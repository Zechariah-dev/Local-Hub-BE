import { Request } from "express";
import { User } from "./modules/v1/user/schemas/user.schema";

declare global {
  interface AuthRequest extends Request {
    user: User;
  }
}
