import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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

class Personalization {
  @IsString()
  @ApiProperty()
  instruction: string;

  @IsBoolean()
  @ApiProperty()
  isOptional: boolean;
}

class Variant {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  color: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  size: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @IsBoolean()
  @ApiProperty()
  isVisible: boolean;
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

  @IsOptional()
  @ValidateNested()
  @ApiPropertyOptional()
  personalization: Personalization;

  @IsArray()
  @ValidateNested()
  @IsOptional()
  @ApiPropertyOptional()
  variation: Variant[];

  @IsArray()
  @ValidateNested()
  collaborationPartners: Collaborator[];

  @IsArray()
  sections: string[];

  @IsArray()
  @IsNotEmpty()
  categories: Types.ObjectId[];
}
