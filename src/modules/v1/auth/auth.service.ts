import * as bcrypt from "bcrypt";
import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { UserService } from "../user/user.service";
import { SignUpAuthDto } from "./dto/signup-auth.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async registerAccount(body: SignUpAuthDto) {
    return await this.userService.create(body);
  }

  async logInAccount(body: LoginAuthDto) {
    const user = await this.validateUser(body);

    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    const payload = {
      _id: user._id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "3hr",
      secret: "HELLO",
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "30days",
      secret: "HELLO1",
    });

    return { tokens: { accessToken, refreshToken }, user };
  }

  async validateUser(payload: LoginAuthDto) {
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);

    if (!isMatch) {
      return null;
    }

    return user;
  }
}
