import { ObjectId } from "mongodb";
import { Injectable } from "@nestjs/common";
import CategoryRepository from "./category.repository";
import { CategoryCreatePayload } from "./category.interface";
import { FilterQuery, Types } from "mongoose";
import { Category } from "./schemas/category.schema";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(payload: CategoryCreatePayload) {
    return this.categoryRepository.create(payload);
  }

  async findAll() {
    return this.categoryRepository.findAll({});
  }

  async findById(id: Types.ObjectId) {
    return this.categoryRepository.findById(id);
  }

  async findByName(name: string) {
    return this.categoryRepository.findOne({ name });
  }

  async softDelete(_id: Types.ObjectId) {
    return this.categoryRepository.findOneAndUpdate(
      { _id },
      { deletedAt: new Date() }
    );
  }

  async update(_id: Types.ObjectId, payload: Partial<Category>) {
    return this.categoryRepository.findOneAndUpdate({ _id }, payload);
  }

  async find(
    query: FilterQuery<Category>,
    projection: any | null,
    page: number,
    limit: number
  ) {
    return this.categoryRepository.find(
      { ...query, deletedAt: null },
      projection,
      {
        page,
        skip: (page - 1) * limit,
      }
    );
  }
}
