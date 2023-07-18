import {
  Controller,
  Body,
  Patch,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Post,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@Controller("user")
@UseGuards(JwtAuthGuard)
@ApiTags("User")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Patch("profile")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  public async updateProfile(@Body() body: UpdateProfileDto, @Req() req) {
    const user = await this.userService.updateProfile(req.user._id, body);

    return { success: true, data: user };
  }

  @Post("/profile/image")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("file"))
  @ApiOkResponse({})
  public async updateProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    const output = await this.cloudinaryService.uploadFile(file);

    const user = await this.userService.updateProfile(req.user._id, {
      image: output.secure_url,
    });

    return {
      success: true,
      data: user,
    };
  }

  @Post("/profile/business-image")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: "image",
        maxCount: 1,
      },
      {
        name: "cover",
        maxCount: 1,
      },
    ])
  )
  @ApiOkResponse({})
  public async updateBusinessImages(
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    @Req() req
  ) {
    let payload: {
      [key: string]: string;
    };

    console.log(files);

    // if (image) {
    //   const output = await this.cloudinaryService.uploadFile(image);
    //   payload.businessImage = output.secure_url;
    // }

    // if (cover) {
    //   const output = await this.cloudinaryService.uploadFile(cover);
    //   payload.businessCoverImage = output.secure_url;
    // }

    // const user = await this.userService.updateProfile(req.user._id, payload);

    // return {
    //   success: true,
    //   data: user,
    // };
  }
}
