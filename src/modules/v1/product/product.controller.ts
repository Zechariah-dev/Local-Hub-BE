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
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { ParseObjectIdPipe } from "src/pipes/parse-object-id.pipe";
import { Types } from "mongoose";
import { UpdateProductDto } from "./dto/update-product.dto";

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
  @ApiCreatedResponse({
    description: "200, Product has been created successfully",
  })
  @ApiBadRequestResponse({
    description: "400, Product already exists in your catalog",
  })
  async create(@Body() body: CreateProductDto, @Req() req: AuthRequest) {
    let product = await this.productService.findUnique(
      body.title,
      req.user._id
    );

    if (product) {
      throw new BadRequestException("Prduct already exists in your catalog");
    }

    product = await this.productService.create({
      ...body,
      owner: req.user._id,
    });

    return {
      message: "Product has been created successfully",
      data: product,
    };
  }
  @Post("/upload/:id")
  @UseInterceptors(FilesInterceptor("files"))
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({
    description: "200, Product images was uploaded successfully",
  })
  @ApiNotFoundResponse({ description: "404, Product does not exist" })
  async uploadProductImages(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req
  ) {
    const productExists = await this.productService.findById(id);

    if (!productExists) {
      throw new NotFoundException("Product does not exist");
    }

    const images = [];

    for (const file of files) {
      const output = await this.cloudinaryService.uploadFile(file);
      images.push(output.secure_url);
    }

    const product = await this.productService.update(id, req.user._id, {
      images,
    });

    return { message: "Product images was uploaded successfully", product };
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
  @ApiOperation({ description: "Fetching user products" })
  @ApiOkResponse({ description: "product fetched successfully" })
  async getUserProducts(
    @Query() { page, limit }: PaginationParams,
    @Req() req
  ) {
    const products = await this.productService.fetchByUser(
      { owner: req.user._id },
      null,
      page,
      limit
    );

    return { products, message: "User products was fetched successfully" };
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: "string" })
  @ApiOperation({ description: "Fetching a single product" })
  @ApiOkResponse({ description: "Product was fetched successfully" })
  @ApiNotFoundResponse({ description: "Product does not exist" })
  async getSingleProduct(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
    const product = await this.productService.findById(id);

    if (!product) {
      throw new NotFoundException("Product does not exist");
    }

    return { message: "Product was fetched successfully", product };
  }

  @Patch("/user/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "Update user product" })
  @ApiOkResponse({ description: "product updated successfully" })
  @ApiUnprocessableEntityResponse({ description: "unable to update product" })
  @ApiParam({ name: "id", type: "string" })
  async updateProduct(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateProductDto,
    @Req() req: AuthRequest
  ) {
    const product = await this.productService.update(id, req.user._id, body);

    if (!product) {
      throw new UnprocessableEntityException();
    }

    return { message: "Product was updated successfully", product };
  }

  @Delete("/user/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "Delete user product" })
  @ApiOkResponse({ description: "product deleted successfully" })
  @ApiUnprocessableEntityResponse()
  @ApiParam({ name: "id", type: "string" })
  async deleteProduct(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Req() req: AuthRequest
  ) {
    const product = await this.productService.delete(id, req.user._id);

    if (!product) {
      throw new UnprocessableEntityException();
    }

    return { message: "Product was deleted successfully", product };
  }
}
