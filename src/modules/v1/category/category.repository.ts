import { BaseRepository } from "src/common/repositories/base.repository";
import { FilterQuery, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Category, CategoryDocument } from "./schemas/category.schema";

@Injectable()
export default class CategoryRepository extends BaseRepository<CategoryDocument> {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {
    super(categoryModel);
  }

  public async findAll(query: FilterQuery<Category>) {
    return this.categoryModel.find(query);
  }
}
