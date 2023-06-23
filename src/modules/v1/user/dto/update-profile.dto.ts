import { Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Types } from "mongoose";

class VerifiedInformation {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  cac: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phone: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  address;

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  dob: Date;

  @IsArray()
  @IsOptional()
  languages: string[];

  @IsString()
  @IsOptional()
  bio: string;

  @IsArray()
  @IsOptional()
  skills: string[];

  @IsArray()
  @IsOptional()
  categories: Types.ObjectId[];

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => VerifiedInformation)
  verifiedInformation: VerifiedInformation;
}
