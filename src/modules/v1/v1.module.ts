import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ServiceModule } from "./service/service.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { UserModule } from "./user/user.module";
import { CategoryModule } from "./category/category.module";

@Module({
  providers: [
    AuthModule,
    CategoryModule,
    ServiceModule,
    CloudinaryModule,
    UserModule,
  ],
})
export class V1Module {}
