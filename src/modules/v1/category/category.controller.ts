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
  Delete,
  NotFoundException,
  ParseIntPipe,
  Query,
  BadRequestException,
  Patch,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CloudinaryService } from "@v1/cloudinary/cloudinary.service";
import { ParseObjectIdPipe } from "../../../pipes/parse-object-id.pipe";
import { Types } from "mongoose";
import { UpdateCategoryDto } from "./dto/update-category.dto";

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

  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("image"))
  @ApiOkResponse({ description: "200, category updated successfully" })
  async updateCategory(
    @UploadedFile() image: Express.Multer.File,
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateCategoryDto
  ) {
    const categoryExists = await this.categoryService.findById(id);

    if (!categoryExists) {
      throw new BadRequestException("Category does not exist");
    }

    const updatedFields = body;

    if (image) {
      const output = await this.cloudinaryService.uploadFile(image);
      updatedFields.image = output.secure_url;
    }

    const category = await this.categoryService.update(id, updatedFields);

    return { category, message: "Category has been updated successfully" };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCategories(
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 6
  ) {
    const categories = await this.categoryService.find({}, null, page, limit);

    return { categories, message: "Categories has been fetched successfully" };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "200, Category fetched successfully" })
  @ApiNotFoundResponse({ description: "404, Category does not exist" })
  async getSingleCategory(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
    const category = await this.categoryService.findById(id);

    if (!category) {
      throw new NotFoundException("Category does not exist");
    }

    return { message: "Category fetched successfully", category };
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "200, category deleted successfully" })
  @ApiNotFoundResponse({ description: "404, category does not exist" })
  async deleteCategory(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
    const category = await this.categoryService.softDelete(id);

    if (!category) {
      throw new NotFoundException("Category does not exist");
    }

    return { category, message: "Category has been deleted successfully" };
  }
}
