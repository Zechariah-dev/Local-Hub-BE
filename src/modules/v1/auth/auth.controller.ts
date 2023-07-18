import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpStatus,
  HttpCode,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { SignUpAuthDto } from "./dto/signup-auth.dto";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { MailerService } from "@nestjs-modules/mailer";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post("/signup")
  @ApiBody({ type: [SignUpAuthDto] })
  @ApiCreatedResponse({})
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: SignUpAuthDto) {
    let user = await this.userService.findOne({ email: body.email });

    if (user) {
      throw new BadRequestException("Credentials already in use");
    }

    user = await this.authService.registerAccount(body);

    return { success: true, data: user };
  }

  @Get()
  @UseGuards(AuthGuard("local"))
  async validateUser(@Req() req) {
    return req.user;
  }

  @Post("/login")
  @ApiOkResponse({})
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginAuthDto) {
    const data = await this.authService.logInAccount(body);

    return { success: true, data };
  }

  @Post("/forgot-password")
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const result = await this.authService.forwardPasswordResetLink(body.email);

    return;
  }
}
