import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không có trong DTO
      forbidNonWhitelisted: true, // Trả về lỗi nếu có thuộc tính không hợp lệ
      transform: true, // Tự động chuyển đổi dữ liệu đầu vào thành kiểu DTO
    }),
  );
  await app.listen(3000);
}
bootstrap();
