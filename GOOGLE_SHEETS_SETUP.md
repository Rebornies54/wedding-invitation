# Hướng Dẫn Setup Google Sheets API để Lưu RSVP

## Bước 1: Tạo Google Sheet
1. Tạo một Google Sheet mới tại: https://sheets.google.com
2. Đặt tên sheet (ví dụ: "Wedding RSVPs")
3. Thêm header row vào dòng 1:
   - A1: ID
   - B1: Timestamp
   - C1: Date
   - D1: Name
   - E1: Guests
   - F1: Attending
   - G1: Message

## Bước 2: Tạo Google Cloud Project và Enable API
1. Truy cập: https://console.cloud.google.com
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google Sheets API:
   - Vào "APIs & Services" > "Library"
   - Tìm "Google Sheets API" và click "Enable"

## Bước 3: Tạo Service Account
1. Vào "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Đặt tên (ví dụ: "wedding-rsvp-service")
4. Click "Create and Continue"
5. Skip các bước tiếp theo, click "Done"

## Bước 4: Tạo Key cho Service Account
1. Click vào service account vừa tạo
2. Vào tab "Keys"
3. Click "Add Key" > "Create new key"
4. Chọn "JSON" và download file
5. **QUAN TRỌNG**: Lưu file này an toàn, không commit lên GitHub!

## Bước 5: Chia sẻ Google Sheet với Service Account
1. Mở Google Sheet của bạn
2. Click nút "Share" (Chia sẻ)
3. Copy email của service account (có dạng: xxx@xxx.iam.gserviceaccount.com)
4. Paste email vào và cấp quyền "Editor"
5. Click "Send"

## Bước 6: Lấy Sheet ID
1. Mở Google Sheet
2. Nhìn vào URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
3. Copy phần [SHEET_ID] (giữa /d/ và /edit)

## Bước 7: Cấu hình trong Code
Cần cung cấp:
- Sheet ID
- Service Account credentials (JSON)

**LƯU Ý BẢO MẬT**: 
- Không commit file credentials.json lên GitHub
- Sử dụng Vercel Environment Variables để lưu credentials
- Hoặc sử dụng Vercel Serverless Functions để giữ credentials an toàn

