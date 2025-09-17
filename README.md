# Stadium Management TVUHub

## Giới thiệu

Đây là đồ án quản lý sân vận động cho Trường Đại học Trà Vinh, giúp quản lý đặt sân, thiết bị, sự kiện, bảo trì, thông báo, thanh toán và báo cáo. Hệ thống gồm hai phần: client (giao diện web) và server (API backend).

## Mục tiêu

-   Quản lý đặt sân, lịch sử đặt sân
-   Quản lý thiết bị, sự cố thiết bị
-   Quản lý sự kiện, thông báo
-   Quản lý bảo trì, báo cáo
-   Quản lý người dùng, phân quyền
-   Thanh toán trực tuyến

## Kiến trúc hệ thống

-   **Client**: Next.js, React, Typescript
-   **Server**: NestJS, Typescript
-   **Cơ sở dữ liệu**: MySQL `tvusm_web`
-   **Upload**: Lưu trữ hình ảnh, thư mục `server/uploads/`

```
client/         # Frontend Next.js
server/         # Backend NestJS
uploads/        # Lưu trữ file
tvusm_web/      # File cấu trúc của DB
```

## Phần mềm cần thiết

-   Node.js >= 18
-   npm >= 9
-   MySQL

## Hướng dẫn triển khai

### 1. Cài đặt cơ sở dữ liệu

-   Tạo database mới
-   Import file SQL trong `tvusm_db/tvusm_web.sql`

### 2. Cài đặt backend

```bash
cd server
npm install
```

-   Cấu hình file `.env` theo mẫu
-   Khởi động server:

```bash
npm run start:dev
```

### 3. Cài đặt frontend

```bash
cd client
npm install
```

-   Cấu hình file `.env.local` theo mẫu
-   Khởi động client:

```bash
npm run dev
```

### 4. Truy cập hệ thống

-   Mở trình duyệt và truy cập địa chỉ: `http://localhost:3001`

## Liên hệ

-   Email: trungnghia414345@gmail.com
-   Sinh viên Trường Đại học Trà Vinh
