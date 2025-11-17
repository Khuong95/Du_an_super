import React, { useState } from 'react';

// IMPORTANT: Instructions for Google Apps Script setup
// 1. Open Google Sheets: Go to https://docs.google.com/spreadsheets/d/18gEKdCGTUoeGNZG8HCrj4e6gpMbnwYE_aH3y3njlDL0/edit
// 2. Open Apps Script: Go to Extensions > Apps Script.
// 3. Paste the code below into the script editor and save the project.
/*
// --- MÃ APPS SCRIPT ĐÃ SỬA LỖI MÚI GIỜ ---
// Sao chép và dán toàn bộ mã này vào trình soạn thảo Apps Script của bạn.
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById("18gEKdCGTUoeGNZG8HCrj4e6gpMbnwYE_aH3y3njlDL0").getSheetByName("Data khách hàng");
    if (!sheet) {
      throw new Error("Không tìm thấy trang tính 'Data khách hàng'. Vui lòng kiểm tra lại tên trang tính.");
    }
    var data = JSON.parse(e.postData.contents);
    
    // SỬA LỖI: Định dạng lại ngày giờ theo múi giờ Việt Nam (GMT+7)
    var vietnamTime = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    
    // Nếu sheet trống, tạo hàng tiêu đề đúng thứ tự
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Họ tên", "SĐT", "Ngày dự sinh (EDD)", "Ghi chú", 
        "Ngày khám gần nhất", "Ngày nhắc gần nhất", "Số lần nhắc", 
        "Trạng Thái", "Tuổi thai", "Tam cá nguyệt", "Ngày gửi (timestamp)"
      ]);
    }
    
    // Sắp xếp dữ liệu để ghi đúng vào các cột tương ứng
    sheet.appendRow([
      data.fullName,      // Cột A: Họ tên
      data.phone,         // Cột B: SĐT
      data.dueDate,       // Cột C: Ngày dự sinh (EDD)
      '',                 // Cột D: Ghi chú (bỏ trống)
      '',                 // Cột E (bỏ trống)
      '',                 // Cột F (bỏ trống)
      '',                 // Cột G (bỏ trống)
      '',                 // Cột H (bỏ trống)
      '',                 // Cột I (bỏ trống)
      '',                 // Cột J (bỏ trống)
      vietnamTime         // Cột K: Ngày gửi (timestamp) đã được định dạng đúng
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Data saved" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
*/
// 4. Deploy: Click "Deploy" > "New deployment".
// 5. Select type: "Web app".
// 6. Configure:
//    - Description: "Kiosk Form API"
//    - Execute as: "Me"
//    - Who has access: "Anyone" (This is important for the form to work)
// 7. Click "Deploy". Authorize permissions when prompted.
// 8. Copy the "Web app URL" and paste it below.

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzRVRCnUljTCwlL1efWizy1Rta3ZlQmj8VYv2FOXqoJIedH1Wbc_Oz3XIq0b0Lt4Wi2/exec';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const KioskForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName || !phone || !dueDate) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      setStatus('error');
      return;
    }
    
    setStatus('submitting');
    setError(null);

    try {
      // Since Apps Script web apps can have issues with CORS, we'll use a trick
      // to submit the form data without needing a full CORS-compliant response.
      // We create a temporary form element to submit the data.
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phone', phone);
      formData.append('dueDate', dueDate);

      // We'll use a simple fetch with 'no-cors' as it's easier for this setup
      // Note: we won't be able to read the response, so we optimistically assume success
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for simple client-side to Apps Script POST
        headers: {
            // 'Content-Type': 'application/json', // Not needed for this method
        },
        body: JSON.stringify({ fullName, phone, dueDate }),
      });
      
      setStatus('success');
      setFullName('');
      setPhone('');
      setDueDate('');

    } catch (err) {
      console.error('Submission Error:', err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-600 mb-1">Họ và tên</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="Nguyễn Văn A"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-1">Số điện thoại (Zalo)</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="09xxxxxxxx"
            required
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-600 mb-1">Ngày dự sinh</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-700 disabled:bg-slate-400 transition-all duration-300 flex items-center justify-center"
          >
            {status === 'submitting' ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Gửi thông tin'}
          </button>
        </div>
      </form>

      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-md text-center">
          Cảm ơn bạn! Thông tin đã được gửi thành công.
        </div>
      )}
      {status === 'error' && error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-md text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default KioskForm;