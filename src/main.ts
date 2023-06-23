import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  // swagger doc setup
  const config = new DocumentBuilder()
    .setTitle("Local Hub")
    .setDescription("The Local Hub API")
    .setVersion("1.0")
    .addTag("Local Hub")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const configService = app.get(ConfigService);

  const port = configService.get<number>("PORT") || 8888;

  await app.listen(port, () => {
    console.log("Server running on port ", port);
  });
}

bootstrap();
