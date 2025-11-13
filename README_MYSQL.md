# 🎉 Hướng Dẫn Setup MySQL để Lưu RSVP Tập Trung

## ✅ Đã Hoàn Thành

Code đã được cập nhật để hỗ trợ MySQL! Bây giờ tất cả RSVPs từ mọi người sẽ được lưu vào database MySQL.

## 🚀 Cách Setup (10 phút)

### Option 1: PlanetScale (Khuyến Nghị - Miễn Phí, Dễ Dùng)

#### Bước 1: Tạo tài khoản PlanetScale
1. Truy cập: https://planetscale.com
2. Click "Sign Up" (có thể dùng GitHub)
3. Đăng nhập

#### Bước 2: Tạo Database
1. Click "Create database"
2. Đặt tên: `wedding-rsvp` (hoặc tên bạn muốn)
3. Chọn region gần nhất (ví dụ: `ap-southeast-1` cho Việt Nam)
4. Click "Create database"
5. Đợi database được tạo (1-2 phút)

#### Bước 3: Tạo Table
1. Vào database vừa tạo
2. Click tab "Console"
3. Chạy SQL sau để tạo table:

```sql
CREATE TABLE rsvps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  attending VARCHAR(10) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Click "Run" để tạo table

#### Bước 4: Tạo Branch và Password
1. Vào tab "Settings"
2. Click "Passwords" > "Create password"
3. Đặt tên: `wedding-app` (hoặc tên bạn muốn)
4. Click "Create password"
5. **QUAN TRỌNG**: Copy các thông tin:
   - Host
   - Username
   - Password
   - Database name

#### Bước 5: Lấy Connection String
1. Vào tab "Overview"
2. Click "Connect" > "Connect with"
3. Chọn "Node.js"
4. Copy connection string (sẽ có dạng: `mysql://...`)

#### Bước 6: Cấu hình Vercel
1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project "wedding-invitation"
3. Vào **Settings** > **Environment Variables**
4. Thêm các biến sau:

   **DB_HOST**: (từ connection string, ví dụ: `xxx.psdb.cloud`)
   **DB_USER**: (từ connection string, ví dụ: `xxx`)
   **DB_PASSWORD**: (password bạn đã tạo)
   **DB_NAME**: (tên database, ví dụ: `wedding-rsvp`)
   **DB_SSL**: `true` (PlanetScale yêu cầu SSL)

5. Chọn cả 3 environments: Production, Preview, Development
6. Click **Save** cho mỗi biến

#### Bước 7: Cài đặt Dependencies
1. Vercel sẽ tự động cài `mysql2` từ `package.json`
2. Hoặc bạn có thể chạy `npm install` local nếu muốn test

#### Bước 8: Redeploy
1. Vào tab **Deployments**
2. Click "..." ở deployment mới nhất
3. Click **Redeploy**
4. Đợi deploy xong (2-3 phút)

## ✅ Test

1. Mở website sau khi deploy xong
2. Submit một RSVP mới
3. Vào PlanetScale Dashboard
4. Click vào database > tab "Table" > table `rsvps`
5. Bạn sẽ thấy RSVP mới được thêm vào!

## 📊 Xem Dữ Liệu

### Cách 1: Trên PlanetScale
- Vào Dashboard > Database > Table `rsvps`
- Có thể xem, edit, query trực tiếp

### Cách 2: Trong Admin Panel
- Mở admin panel trên website (click 3 lần vào footer)
- Dữ liệu sẽ tự động load từ database

### Cách 3: Export
- Dùng nút "📥 Xuất JSON" hoặc "📊 Xuất CSV" trong admin panel
- Hoặc query trực tiếp trên PlanetScale

## 🔒 Bảo Mật

- **KHÔNG** commit database credentials lên GitHub
- Credentials chỉ lưu trong Vercel Environment Variables
- PlanetScale có SSL encryption tự động

## 💡 Lưu Ý

- **PlanetScale miễn phí** có giới hạn: 1 database, 1GB storage
- Nếu vượt quá, có thể:
  - Nâng cấp PlanetScale (có trả phí)
  - Hoặc dùng MySQL server khác (xem Option 2)

## 🆘 Troubleshooting

### Không thấy RSVP mới?
1. Kiểm tra Console (F12) xem có lỗi không
2. Kiểm tra Vercel Environment Variables đã đúng chưa
3. Kiểm tra table `rsvps` đã được tạo chưa
4. Thử click nút "🔄 Làm mới" trong admin panel

### Lỗi "Connection refused"?
- Kiểm tra DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- Đảm bảo DB_SSL = `true` cho PlanetScale
- Kiểm tra password trên PlanetScale còn valid không

### Muốn xóa tất cả dữ liệu?
- Vào PlanetScale > Table `rsvps` > Delete all rows
- Hoặc dùng SQL: `DELETE FROM rsvps;`

---

## Option 2: MySQL Server Khác

Nếu bạn có MySQL server riêng (ví dụ: AWS RDS, DigitalOcean, v.v.):

1. Tạo database và table như trên
2. Thêm Environment Variables vào Vercel:
   - `DB_HOST`: IP hoặc domain của MySQL server
   - `DB_USER`: Username
   - `DB_PASSWORD`: Password
   - `DB_NAME`: Tên database
   - `DB_SSL`: `false` (hoặc `true` nếu có SSL)

3. Redeploy

## 🎊 Hoàn Thành!

Sau khi setup xong, tất cả RSVPs từ mọi người sẽ được lưu tập trung vào MySQL database. Bạn có thể xem tổng số khách tham dự từ bất kỳ đâu!

