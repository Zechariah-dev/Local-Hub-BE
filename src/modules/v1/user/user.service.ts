import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { FilterQuery, Model } from "mongoose";
import { UserDocument } from "./schemas/user.schema";
import { UsersRepository } from "./user.repository";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async updateProfile(id: string, payload: Partial<User>): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ _id: id }, payload);
  }

  async create(payload: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    const user = await this.usersRepository.create({
      ...payload,
      password: hashedPassword,
    });
    if (user) return user;
    throw new Error("Unable to create user");
  }

  findAll() {
    return `This action returns all user`;
  }

  public async findOne(query: FilterQuery<User>): Promise<User> {
    return this.usersRepository.findOne(query);
  }

  public async findByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
