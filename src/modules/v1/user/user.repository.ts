import { BaseRepository } from "src/common/repositories/base.repository";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private usersModel: Model<UserDocument>) {
    super(usersModel);
  }
}
