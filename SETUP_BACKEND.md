# Hướng Dẫn Setup Backend để Lưu RSVP Tập Trung

## Vấn Đề Hiện Tại
- localStorage chỉ lưu trên trình duyệt của từng người
- Mỗi tab/thiết bị có dữ liệu riêng
- Không thể tập trung dữ liệu từ nhiều người

## Giải Pháp: Sử dụng JSONBin.io (Miễn Phí, Đơn Giản)

### Bước 1: Tạo tài khoản JSONBin.io
1. Truy cập: https://jsonbin.io
2. Đăng ký tài khoản miễn phí (có thể dùng Google/GitHub)
3. Vào Dashboard

### Bước 2: Tạo Bin mới
1. Click "Create Bin"
2. Paste JSON mẫu:
```json
[]
```
3. Đặt tên: "wedding-rsvps"
4. Click "Create"
5. **QUAN TRỌNG**: Copy "Bin ID" (ví dụ: `65a1b2c3d4e5f6g7h8i9j0k`)

### Bước 3: Lấy API Key
1. Vào "My Account" > "API Keys"
2. Copy "X-Master-Key" (ví dụ: `$2a$10$abc123...`)

### Bước 4: Cấu hình Vercel Environment Variables
1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project "wedding-invitation"
3. Vào "Settings" > "Environment Variables"
4. Thêm 2 biến:
   - `JSONBIN_API_KEY` = (paste X-Master-Key của bạn)
   - `JSONBIN_BIN_ID` = (paste Bin ID của bạn)
5. Click "Save"
6. **QUAN TRỌNG**: Redeploy project để áp dụng biến môi trường

### Bước 5: Test
1. Submit một RSVP mới trên website
2. Vào JSONBin.io Dashboard
3. Xem bin "wedding-rsvps" - bạn sẽ thấy RSVP mới được thêm vào

## Cách Xem Dữ Liệu
1. **Trên JSONBin.io**: Vào Dashboard > Click vào bin để xem
2. **Trong Admin Panel**: Dữ liệu sẽ tự động load từ server
3. **Export**: Có thể export JSON từ JSONBin.io

## Lưu Ý
- JSONBin.io miễn phí có giới hạn: 1000 requests/tháng
- Nếu vượt quá, có thể nâng cấp hoặc chuyển sang Supabase/MongoDB
- Dữ liệu được lưu tập trung, tất cả người dùng đều thấy cùng dữ liệu

## Giải Pháp Thay Thế (Nếu Cần)

### Option 2: Supabase (Miễn Phí, Có Database)
1. Tạo tài khoản tại: https://supabase.com
2. Tạo project mới
3. Tạo table `rsvps` với các cột: id, timestamp, date, name, guests, attending, message
4. Lấy API URL và API Key
5. Cập nhật code để sử dụng Supabase API

### Option 3: MongoDB Atlas (Miễn Phí, Có Database)
1. Tạo tài khoản tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Lấy connection string
4. Cập nhật code để sử dụng MongoDB

