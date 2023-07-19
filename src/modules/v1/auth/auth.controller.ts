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
import { GoogleOAuthGuard } from "../../../guards/google-oauth.guard";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post("/signup")
  @ApiCreatedResponse({ description: "201, User registered sucessfully" })
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: SignUpAuthDto) {
    let userExist = await this.userService.findOne({ email: body.email });

    if (userExist) {
      throw new BadRequestException("Credentials already in use");
    }

    const user = await this.authService.registerAccount(body);

    return { message: "User registered successfully", data: user };
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
    const userExist = await this.userService.findByEmail(body.email);

    if (!userExist) {
      throw new BadRequestException("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(body.password, userExist.password);

    if (!isMatch) {
      throw new BadRequestException("Invalid credentials");
    }

    const tokens = await this.authService.generateTokens({
      userId: userExist._id,
      email: userExist.email,
    });

    return { user: userExist, tokens, message: "User logged in successfully" };
  }

  @Post("/forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const userExist = await this.userService.findByEmail(body.email);

    if (!userExist) {
      throw new NotFoundException("User account not found");
    }

    await this.authService.forwardPasswordResetLink(userExist.email);

    return { message: "Sent Password reset email successfully" };
  }

  @Get("/google")
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get("/google-redirect")
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOAuthGuard)
  async googleOauthRedirect(@Req() req) {
    // eslint-disable-next-line no-console
    console.log(req);
  }
}
