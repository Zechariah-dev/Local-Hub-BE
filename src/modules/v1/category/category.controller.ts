import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ApiConsumes, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { CloudinaryService } from "@v1/cloudinary/cloudinary.service";
import { ParseObjectIdPipe } from "src/pipes/parse-object-id.pipe";
import { Types } from "mongoose";

@Controller("category")
@ApiTags("Category")
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    description: "201, Category created successfully",
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateCategoryDto
  ) {
    const output = await this.cloudinaryService.uploadFile(file);

    const category = await this.categoryService.create({
      ...body,
      image: output.secure_url,
    });

    return { success: true, data: category };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async fetch() {
    const categories = await this.categoryService.findAll();

    return { success: true, data: categories };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
    const category = await this.categoryService.findById(id);

    return { success: true, data: category };
  }
}
