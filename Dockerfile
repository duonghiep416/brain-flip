# Sử dụng image Node.js phiên bản nhẹ
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /src

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt phụ thuộc
RUN npm install

# Sao chép mã nguồn
COPY . .

COPY .env .env

# Xây dựng ứng dụng
RUN npm run build

# Expose cổng 3012
EXPOSE 3012

# Lệnh chạy ứng dụng
CMD ["node", "dist/main"]
