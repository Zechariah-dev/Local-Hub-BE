import { CloudinaryService } from "../cloudinary/cloudinary.service";
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
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { PaginationParams } from "./dto/pagination-params.dto";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { ParseObjectIdPipe } from "src/pipes/parse-object-id.pipe";
import { Types } from "mongoose";

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
  @ApiCreatedResponse({ description: "product created successfully" })
  public async create(@Body() body: CreateProductDto, @Req() req) {
    let product = await this.productService.findUnique(
      body.title,
      req.user._id
    );

    if (product) {
      throw new BadRequestException("Prduct already exists in your catalogI");
    }

    product = await this.productService.create({
      ...body,
      owner: req.user._id,
    });

    return {
      sucess: true,
      data: product,
    };
  }
  @Post("/upload/:id")
  @UseInterceptors(FilesInterceptor("files"))
  @ApiConsumes("multipart/form-data")
  async uploadProductImages(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req
  ) {
    let product = await this.productService.findById(id);

    if (!product) {
      throw new NotFoundException("product not found");
    }

    const images = [];

    for (const file of files) {
      const output = await this.cloudinaryService.uploadFile(file);
      images.push(output.secure_url);
    }

    product = await this.productService.update(id, req.user._id, {
      images,
    });

    return { success: true, message: "uploaded product images", data: product };
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
  @ApiOperation({ description: "Fetch user product" })
  @ApiOkResponse({ description: "product fetched successfully" })
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

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "Update user product" })
  @ApiOkResponse({ description: "product updated successfully" })
  @ApiUnprocessableEntityResponse({ description: "unable to update product" })
  @ApiParam({ name: "id", type: "string" })
  public async editProduct(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body,
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
  @ApiOperation({ description: "Delete user product" })
  @ApiOkResponse({ description: "product deleted successfully" })
  @ApiUnprocessableEntityResponse({ description: "unable to delete product" })
  @ApiParam({ name: "id", type: "string" })
  public async deleteProduct(@Param("id") id: string, @Req() req) {
    const product = await this.productService.delete(id, req.user._id);

    if (!product) {
      throw new UnprocessableEntityException();
    }

    return { success: true, product };
  }
}
