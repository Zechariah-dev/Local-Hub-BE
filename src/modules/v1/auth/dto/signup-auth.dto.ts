import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { UserRole } from "../../user/user.interface";

export class SignUpAuthDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsBoolean()
  @ApiProperty()
  termsAndCondition: boolean;

  @IsString()
  @ApiProperty({ enum: Object.values(UserRole) })
  role: string;

  @IsString()
  @IsPhoneNumber()
  @ApiProperty()
  phone: string;

  @IsString()
  @ApiProperty()
  country: string;
}
