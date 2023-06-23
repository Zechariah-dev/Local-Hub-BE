import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductRepository } from "./product.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./schemas/product.schema";
import { Model } from "mongoose";

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    @InjectModel(Product.name) private readonly productsModel: Model<Product>
  ) {}

  public async create(
    payload: CreateProductDto,
    owner: string,
    images: string[]
  ) {
    const product = await this.productsRepository.create({
      ...payload,
      owner,
      images,
    });

    return product;
  }

  public async fetchByUser(owner: string, page = 1, limit = 10) {
    return this.productsModel
      .find({ owner })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async update(_id: string, owner: string, payload: UpdateProductDto) {
    return this.productsRepository.findOneAndUpdate(
      { _id, owner },
      { ...payload }
    );
  }

  public async delete(_id: string, owner: string) {
    return this.productsRepository.deleteOne({ _id, owner });
  }
}
