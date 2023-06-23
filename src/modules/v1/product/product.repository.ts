import { BaseRepository } from "src/common/repositories/base.repository";
import { Product, ProductDocument } from "./schemas/product.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name) private productsModel: Model<ProductDocument>
  ) {
    super(productsModel);
  }
}
