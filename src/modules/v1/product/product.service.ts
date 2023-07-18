import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductRepository } from "./product.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./schemas/product.schema";
import { Model, Types } from "mongoose";
import { CreateProductPayload } from "./product.interface";

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    @InjectModel(Product.name) private readonly productsModel: Model<Product>
  ) {}

  async create(payload: CreateProductPayload) {
    const product = await this.productsRepository.create(payload);

    return product;
  }

  async fetchByUser(owner: string, page = 1, limit = 10) {
    return this.productsModel
      .find({ owner })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async update(
    _id: Types.ObjectId,
    owner: Types.ObjectId,
    payload: Partial<Product>
  ) {
    return this.productsRepository.findOneAndUpdate(
      { _id, owner },
      { ...payload }
    );
  }

  async delete(_id: string, owner: string) {
    return this.productsRepository.deleteOne({ _id, owner });
  }

  async findUnique(title: string, owner: Types.ObjectId) {
    return this.productsRepository.findUniqueProduct(title, owner);
  }

  async findById(id: Types.ObjectId): Promise<Product | null> {
    return this.productsRepository.findById(id);
  }
}
