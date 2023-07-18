import { BaseRepository } from "../../../common/repositories/base.repository";
import { Product, ProductDocument } from "./schemas/product.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name) private productsModel: Model<ProductDocument>
  ) {
    super(productsModel);
  }

  async findUniqueProduct(title: string, owner: Types.ObjectId) {
    return this.findOne({ title, owner });
  }

  async findByTitle(title: string) {
    return this.findOne({ title });
  }
}
