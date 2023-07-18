import * as bcrypt from "bcrypt";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { UserService } from "../user/user.service";
import { SignUpAuthDto } from "./dto/signup-auth.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
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
      secret: this.configService.get("JWT_SECRET"),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "30days",
      secret: this.configService.get("JWT_REFRESH_SECRET"),
    });

    return { tokens: { accessToken, refreshToken }, user };
  }

  private async generatePasswordResetLink(email: string) {
    const hash = crypto.createHash("sha256").update(email).digest("hex");
    const encoded = this.jwtService.sign(
      { hash },
      {
        secret: this.configService.get("JWT_SECRET"),
        expiresIn: "10min",
      }
    );
    return `${this.configService.get("APP_URL")}/reset-password/${encoded}`;
  }

  async forwardPasswordResetLink(email: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new NotFoundException("email is not registered");
      }

      const link = await this.generatePasswordResetLink(email);

      const result = await this.mailerService.sendMail({
        to: user.email,
        from: "omoladesunday2017@gmail.com",
        subject: "Password Reset",
        // template: "forgot-password",
        context: {
          link,
        },
        html: `{{link}}`,
      });

      console.log(result);
    } catch (err) {
      console.log(err);
      throw new UnprocessableEntityException(
        "unable to send resent password mail"
      );
    }
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
