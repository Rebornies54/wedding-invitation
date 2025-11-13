# 🎉 Hướng Dẫn Setup Google Sheets để Lưu RSVP

## ✅ Ưu Điểm

- ✅ **Hoàn toàn miễn phí**
- ✅ **Dễ setup** - không cần database server
- ✅ **Xem dữ liệu trực tiếp** trên Google Sheets
- ✅ **Export dễ dàng** - có thể export Excel, CSV
- ✅ **Không giới hạn** số lượng records

---

## 🚀 Các Bước Setup (15 phút)

### Bước 1: Tạo Google Sheet

1. **Tạo Sheet mới:**
   - Truy cập: https://sheets.google.com
   - Click "Blank" để tạo sheet mới
   - Đặt tên: "Wedding RSVPs" (hoặc tên bạn muốn)

2. **Tạo Header Row:**
   - Dòng 1, điền các cột sau:
   ```
    A1: ID
    B1: Timestamp
    C1: Date
    D1: Name
    E1: Guests
    F1: Attending
    G1: Message
   ```

3. **Lấy Sheet ID:**
   - Nhìn vào URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
   - Copy phần `[SHEET_ID]` (giữa `/d/` và `/edit`)
   - **Lưu lại** Sheet ID này!

### Bước 2: Tạo Google Apps Script

1. **Mở Apps Script:**
   - Trong Google Sheet, click **Extensions** > **Apps Script**
   - Hoặc truy cập: https://script.google.com

2. **Xóa code mặc định** và paste code sau:

```javascript
// Google Apps Script để lưu và lấy RSVPs từ Google Sheets

const SHEET_NAME = 'Sheet1'; // Tên sheet (mặc định là Sheet1)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'save') {
      return saveRSVP(data.data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    if (e.parameter.action === 'get') {
      return getAllRSVPs();
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveRSVP(data) {
  try {
    // Validate data
    if (!data || !data.name || !data.attending) {
      throw new Error('Missing required fields: name and attending are required');
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Sheet "' + SHEET_NAME + '" not found. Available sheets: ' + 
        SpreadsheetApp.getActiveSpreadsheet().getSheets().map(s => s.getName()).join(', '));
    }
    
    // Tìm dòng trống tiếp theo
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    // Tạo ID và timestamp
    const id = Date.now();
    const timestamp = new Date().toISOString();
    const date = new Date().toLocaleString('vi-VN');
    
    // Ghi dữ liệu vào sheet
    sheet.getRange(newRow, 1).setValue(id); // ID
    sheet.getRange(newRow, 2).setValue(timestamp); // Timestamp
    sheet.getRange(newRow, 3).setValue(date); // Date
    sheet.getRange(newRow, 4).setValue(String(data.name).trim()); // Name
    sheet.getRange(newRow, 5).setValue(parseInt(data.guests) || 1); // Guests
    sheet.getRange(newRow, 6).setValue(String(data.attending)); // Attending
    sheet.getRange(newRow, 7).setValue(String(data.message || '').trim()); // Message
    
    // Verify data was written
    const writtenData = sheet.getRange(newRow, 1, 1, 7).getValues()[0];
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: {
        id: id,
        timestamp: timestamp,
        date: date,
        name: data.name,
        guests: parseInt(data.guests) || 1,
        attending: data.attending,
        message: data.message || ''
      },
      debug: {
        row: newRow,
        written: writtenData
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in saveRSVP: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      message: 'Failed to save RSVP to Google Sheets'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getAllRSVPs() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Sheet "' + SHEET_NAME + '" not found');
    }
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      // Chỉ có header, không có data
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: [],
        debug: {
          lastRow: lastRow,
          sheetName: SHEET_NAME
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Lấy tất cả data (bỏ qua header row)
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 7);
    const values = dataRange.getValues();
    
    // Format data
    const rsvps = values.map((row, index) => ({
      id: row[0],
      timestamp: row[1],
      date: row[2],
      name: row[3] || '',
      guests: parseInt(row[4]) || 0,
      attending: row[5] || '',
      message: row[6] || ''
    })).filter(row => row.id && row.name); // Filter out empty rows
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: rsvps,
      debug: {
        lastRow: lastRow,
        totalRows: values.length,
        filteredRows: rsvps.length
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in getAllRSVPs: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      data: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Lưu Project:**
   - Click **File** > **Save**
   - Đặt tên project: "Wedding RSVP Handler"
   - Click **Save**

### Bước 3: Deploy Web App

1. **Deploy:**
   - Click **Deploy** > **New deployment**
   - Click icon **⚙️** (Settings) bên cạnh "Select type"
   - Chọn **Web app**

2. **Cấu hình:**
   - **Description**: "Wedding RSVP API" (hoặc tên bạn muốn)
   - **Execute as**: "Me" (tên email của bạn)
   - **Who has access**: **"Anyone"** (QUAN TRỌNG!)
   - Click **Deploy**

 3. **Lấy Web App URL:**
    - Sau khi deploy, bạn sẽ thấy **Web app URL**
    - Copy URL này (có dạng: `https://script.google.com/macros/s/.../exec`)
    - **Lưu lại** URL này!

4. **Authorize:**
   - Click **Authorize access**
   - Chọn Google account của bạn
   - Click **Advanced** > **Go to [Project Name] (unsafe)**
   - Click **Allow**

### Bước 4: Test

1. **Test trong Browser:**
   - Mở URL Web App trong browser
   - Nếu thấy `{"success":false,"error":"Invalid action"}` → **Đúng rồi!** (vì chưa có action)

2. **Test với Postman hoặc curl:**
   ```bash
   curl -X POST "YOUR_WEB_APP_URL" \
     -H "Content-Type: application/json" \
     -d '{"action":"save","data":{"name":"Test","guests":2,"attending":"yes","message":"Test"}}'
   ```

3. **Kiểm tra Google Sheet:**
   - Mở Google Sheet
   - Bạn sẽ thấy dữ liệu mới được thêm vào!

### Bước 5: Cấu Hình Vercel

1. **Vào Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Chọn project "wedding-invitation"

2. **Thêm Environment Variable:**
   - Settings > Environment Variables
   - Thêm biến:
     - **Name**: `GOOGLE_SCRIPT_URL`
     - **Value**: (paste Web App URL từ bước 3)
     - **Environment**: All (Production, Preview, Development)
   - Click **Save**

3. **Redeploy:**
   - Deployments > Click "..." > Redeploy
   - Đợi deploy xong (1-2 phút)

---

## ✅ Hoàn Thành!

Sau khi setup xong:

1. **Submit RSVP trên website** → Dữ liệu sẽ được lưu vào Google Sheets
2. **Mở Google Sheets** → Xem dữ liệu trực tiếp
3. **Export dễ dàng** → File > Download > Excel, CSV, PDF
4. **Admin Panel** → Hiển thị dữ liệu từ Google Sheets

---

## 📊 Xem Dữ Liệu

### Trên Google Sheets:
- Mở sheet "Wedding RSVPs"
- Xem, edit, sort, filter dữ liệu trực tiếp
- Export: File > Download > Excel/CSV/PDF

### Trong Admin Panel:
- Mở admin panel trên website
- Dữ liệu tự động load từ Google Sheets

---

## 🆘 Troubleshooting

### Lỗi "Script function not found"?
- Kiểm tra tên function `doPost` và `doGet` đã đúng chưa
- Đảm bảo đã save project

### Lỗi "Access denied"?
- Kiểm tra "Who has access" đã set "Anyone" chưa
- Redeploy lại Web App

### Không thấy dữ liệu trong Sheet?
- Kiểm tra tên sheet trong code (`SHEET_NAME`) đã đúng chưa
- Kiểm tra header row đã có đầy đủ 7 cột chưa

### Vercel không kết nối được?
- Kiểm tra `GOOGLE_SCRIPT_URL` đã đúng chưa
- Kiểm tra Web App URL có `/exec` ở cuối không
- Xem logs trong Vercel để biết lỗi chi tiết

---

## 💡 Tips

- **Backup dữ liệu**: File > Make a copy (tự động backup)
- **Chia sẻ**: Click "Share" để cho người khác xem
- **Format**: Format cells để dễ đọc hơn
- **Charts**: Tạo charts để visualize dữ liệu

---

## 🎊 Xong!

Bây giờ bạn có thể:
- ✅ Lưu RSVPs vào Google Sheets
- ✅ Xem dữ liệu trực tiếp trên Sheets
- ✅ Export dễ dàng
- ✅ Không cần database server
- ✅ Hoàn toàn miễn phí!

