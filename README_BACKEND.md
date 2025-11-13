# 🎉 Hướng Dẫn Setup Backend để Lưu RSVP Tập Trung

## ✅ Đã Hoàn Thành

Code đã được cập nhật để hỗ trợ lưu trữ tập trung! Bây giờ tất cả RSVPs từ mọi người sẽ được lưu vào một nơi chung.

## 🚀 Cách Setup (5 phút)

### Bước 1: Tạo tài khoản JSONBin.io
1. Truy cập: https://jsonbin.io
2. Click "Sign Up" (có thể dùng Google/GitHub)
3. Đăng nhập

### Bước 2: Tạo Bin mới
1. Click "Create Bin" (hoặc "+ New Bin")
2. Paste JSON mẫu:
```json
[]
```
3. Đặt tên: `wedding-rsvps` (hoặc tên bạn muốn)
4. Click "Create"
5. **QUAN TRỌNG**: Copy "Bin ID" 
   - Ví dụ: `65a1b2c3d4e5f6g7h8i9j0k`
   - Bin ID nằm trong URL: `https://jsonbin.io/app/bins/[BIN_ID]`

### Bước 3: Lấy API Key
1. Vào "My Account" (góc trên bên phải)
2. Click "API Keys"
3. Copy "X-Master-Key" 
   - Ví dụ: `$2a$10$abc123def456...`
   - **LƯU Ý**: Giữ bí mật key này!

### Bước 4: Cấu hình Vercel
1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project "wedding-invitation" (hoặc tên project của bạn)
3. Vào **Settings** > **Environment Variables**
4. Thêm 2 biến mới:

   **Biến 1:**
   - Name: `JSONBIN_API_KEY`
   - Value: (paste X-Master-Key của bạn)
   - Environment: Production, Preview, Development (chọn cả 3)

   **Biến 2:**
   - Name: `JSONBIN_BIN_ID`
   - Value: (paste Bin ID của bạn)
   - Environment: Production, Preview, Development (chọn cả 3)

5. Click **Save** cho mỗi biến

### Bước 5: Redeploy
1. Vào tab **Deployments**
2. Click "..." (3 chấm) ở deployment mới nhất
3. Click **Redeploy**
4. Đợi deploy xong (1-2 phút)

## ✅ Test

1. Mở website sau khi deploy xong
2. Submit một RSVP mới
3. Vào JSONBin.io Dashboard
4. Click vào bin "wedding-rsvps"
5. Bạn sẽ thấy RSVP mới được thêm vào!

## 📊 Xem Dữ Liệu

### Cách 1: Trên JSONBin.io
- Vào Dashboard > Click vào bin để xem
- Có thể edit trực tiếp trên JSONBin.io

### Cách 2: Trong Admin Panel
- Mở admin panel trên website (click 3 lần vào footer)
- Dữ liệu sẽ tự động load từ server

### Cách 3: Export
- Dùng nút "📥 Xuất JSON" hoặc "📊 Xuất CSV" trong admin panel

## 🔒 Bảo Mật

- **KHÔNG** commit API Key lên GitHub
- API Key chỉ lưu trong Vercel Environment Variables
- Mỗi người chỉ có thể submit RSVP, không thể xem/sửa RSVP của người khác (trừ admin)

## 💡 Lưu Ý

- **JSONBin.io miễn phí** có giới hạn: 1000 requests/tháng
- Nếu vượt quá, có thể:
  - Nâng cấp JSONBin.io (có trả phí)
  - Hoặc chuyển sang Supabase/MongoDB (xem `SETUP_BACKEND.md`)

## 🆘 Troubleshooting

### Không thấy RSVP mới?
1. Kiểm tra Console (F12) xem có lỗi không
2. Kiểm tra Vercel Environment Variables đã đúng chưa
3. Kiểm tra JSONBin.io Bin ID đã đúng chưa
4. Thử click nút "🔄 Làm mới" trong admin panel

### Lỗi "Server unavailable"?
- Có thể JSONBin.io đang bảo trì
- Hoặc API Key/Bin ID sai
- Dữ liệu vẫn được lưu vào localStorage (backup)

### Muốn xóa tất cả dữ liệu?
- Vào JSONBin.io > Click vào bin > Delete bin
- Hoặc dùng nút "🗑️ Xóa tất cả" trong admin panel

## 🎊 Hoàn Thành!

Sau khi setup xong, tất cả RSVPs từ mọi người sẽ được lưu tập trung. Bạn có thể xem tổng số khách tham dự từ bất kỳ đâu!

