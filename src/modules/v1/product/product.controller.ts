import { CloudinaryService } from "./../../../cloudinary/cloudinary.service";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { PaginationParams } from "./dto/pagination-params.dto";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("product")
@UseGuards(JwtAuthGuard)
@ApiTags("Product")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor("files"))
  public async create(
    @Body() body: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req
  ) {
    let images: string[];

    for (const file of files) {
      const output = await this.cloudinaryService.uploadFile(file);
      images.push(output.secure_url);
    }

    const product = await this.productService.create(
      body,
      req.user._id,
      images
    );

    return {
      success: true,
      data: product,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: "page",
    type: "number",
  })
  @ApiQuery({
    name: "limit",
    type: "number",
  })
  public async getUserProducts(
    @Query() { page, limit }: PaginationParams,
    @Req() req
  ) {
    const products = await this.productService.fetchByUser(
      req.user._id,
      page,
      limit
    );

    return { success: true, data: products };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  public async editProduct(
    @Param("id") id: string,
    @Body() body: UpdateProductDto,
    @Req() req
  ) {
    const product = await this.productService.update(id, req.user._id, body);

    if (!product) {
      throw new UnprocessableEntityException();
    }

    return { success: true, data: product };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  public async deleteProduct(@Param("id") id: string, @Req() req) {
    const product = await this.productService.delete(id, req.user._id);

    if (!product) {
      throw new UnprocessableEntityException();
    }

    return { success: true, product };
  }
}
