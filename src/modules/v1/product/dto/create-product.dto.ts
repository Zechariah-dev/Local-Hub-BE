import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Types } from "mongoose";
import { ProductType } from "../product.types";

class Collaborator {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  role: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ProductType)
  @ApiProperty()
  type: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsArray()
  @ApiProperty()
  tags: string[];

  @IsNumber()
  @Min(1)
  @ApiProperty()
  price: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  currency: string;

  @IsBoolean()
  @ApiProperty()
  personalization: boolean;

  @IsArray()
  @ApiProperty()
  variation: string[];

  @IsArray()
  @ValidateNested()
  collaborationPartners: Collaborator[];

  @IsArray()
  sections: string[]

  @IsArray()
  @IsNotEmpty()
  category: Types.ObjectId[];
}
