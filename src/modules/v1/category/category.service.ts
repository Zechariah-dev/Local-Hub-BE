import { Injectable } from "@nestjs/common";
import CategoryRepository from "./category.repository";
import { CategoryCreatePayload } from "./category.interface";
import { Types } from "mongoose";

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
}
