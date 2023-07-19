import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductRepository } from "./product.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./schemas/product.schema";
import { FilterQuery, Model, Types } from "mongoose";
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

  async fetchByUser(
    query: FilterQuery<Product>,
    projection: any | null,
    page: number = 1,
    limit: number = 10
  ) {
    return this.productsRepository.find(
      { ...query, deletedAt: null },
      projection,
      {
        page,
        skip: (page - 1) * limit,
      }
    );
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

  async delete(_id: Types.ObjectId, owner: string) {
    return this.productsRepository.deleteOne({ _id, owner });
  }

  async findUnique(title: string, owner: Types.ObjectId) {
    return this.productsRepository.findUniqueProduct(title, owner);
  }

  async findById(_id: Types.ObjectId): Promise<Product | null> {
    return this.productsRepository.findOne({ _id, deletedAt: null });
  }
}
