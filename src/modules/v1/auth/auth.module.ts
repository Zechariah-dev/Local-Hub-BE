import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../user/schemas/user.schema";
import { UsersRepository } from "../user/user.repository";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secretOrPrivateKey: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    ConfigService,
    UserService,
    UsersRepository,
    JwtStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
