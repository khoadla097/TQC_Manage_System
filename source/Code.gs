// =====================================================
//  GOOGLE APPS SCRIPT - HỆ THỐNG QUẢN LÝ TQC
//  Dán toàn bộ file này vào Apps Script Editor
//  Sau đó Deploy → New Deployment → Web App
//  Execute as: Me | Who has access: Anyone
// =====================================================

const SHEET_HEADERS = {
  'CauHinh':   ['key', 'value'],
  'KhachHang': ['id','tenCongTy','daiDien','chucVu','diaChi','maSoThue','soHopDong','congTrinh','soBBGT','soBBKL','hdNguyenTacSo','ngayKyHD','hoaDonSo','kyHieuHoaDon','ngayKyHoaDon'],
  'SanPham':   ['id','ten','donVi','donGia','donGiaVC'],
  'VanChuyen': ['id','ngay','bienSoXe','soChuyenCho','khoiLuong','khachHangId','sanPhamId','ghiChu']
};

// ─── Entry points ────────────────────────────────────
function doGet(e) {
  // Nếu truy cập trực tiếp từ trình duyệt (không có tham số hành động)
  if (!e.parameter.action) {
    var template = HtmlService.createTemplateFromFile('Index');
    // Truyền URL Web App vào template
    template.webAppUrl = ScriptApp.getService().getUrl();
    return template.evaluate()
      .setTitle('TQC Management System')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  return respond(route(e.parameter));
}
function doPost(e) {
  let params = {};
  try { params = JSON.parse(e.postData.contents); } catch(_) {}
  return respond(route(params));
}

// Hàm xử lý trực tiếp dành cho client-side google.script.run
function apiHandler(params) {
  return route(params);
}


// ─── Router ──────────────────────────────────────────
function route(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  switch (p.action) {
    case 'init':   return initDatabase(ss);
    case 'read':   return readAll(ss, p.sheet);
    case 'create': return createRecord(ss, p.sheet, p.data);
    case 'update': return updateRecord(ss, p.sheet, p.id, p.data);
    case 'delete': return deleteRecord(ss, p.sheet, p.id);
    default:       return { success: false, error: 'Unknown action: ' + p.action };
  }
}

function respond(result) {
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Init ─────────────────────────────────────────────
function initDatabase(ss) {
  for (const [name, headers] of Object.entries(SHEET_HEADERS)) {
    let sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      sh.appendRow(headers);
      sh.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#1e3a5f')
        .setFontColor('#ffffff');
    }
  }

  const cfg = ss.getSheetByName('CauHinh');
  if (cfg.getLastRow() <= 1) {
    [
      ['tenCongTy',  'CÔNG TY TNHH TƯ VẤN VÀ XÂY DỰNG TQC'],
      ['daiDien',    'Đặng Ngọc Phi Long'],
      ['chucVu',     'Giám đốc'],
      ['diaChi',     'Thôn Phú Trung, Xã Đại Lộc, TP Đà Nẵng'],
      ['maSoThue',   '0402052223'],
      ['soTaiKhoan', '5507776868'],
      ['nganHang',   'MB chi nhánh Đà Nẵng'],
      ['keToan',     'Bùi Thị Kiều Trang'],
      ['chucVuKT',   'Kế toán'],
      ['thanhPho',   'Đà Nẵng'],
    ].forEach(r => cfg.appendRow(r));
  }

  const sp = ss.getSheetByName('SanPham');
  if (sp.getLastRow() <= 1) {
    sp.appendRow(['sp001', 'Đá cấp phối 375', 'M3', 355000, 115000]);
  }

  return { success: true, message: 'Khởi tạo thành công' };
}

// ─── CRUD ─────────────────────────────────────────────
function readAll(ss, sheetName) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return { success: false, error: 'Sheet not found: ' + sheetName };
  if (sh.getLastRow() <= 1) return { success: true, data: [] };

  const values = sh.getDataRange().getValues();
  const headers = values[0];
  const rows = values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (row[i] instanceof Date)
        ? Utilities.formatDate(row[i], 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')
        : row[i];
    });
    return obj;
  });
  return { success: true, data: rows };
}

function createRecord(ss, sheetName, data) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return { success: false, error: 'Sheet not found: ' + sheetName };
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  sh.appendRow(headers.map(h => data[h] !== undefined ? data[h] : ''));
  return { success: true, data: { id: data.id } };
}

function updateRecord(ss, sheetName, id, data) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return { success: false, error: 'Sheet not found' };
  const all = sh.getDataRange().getValues();
  const headers = all[0];
  let idIdx = headers.indexOf('id');
  if (idIdx < 0) idIdx = 0; // fallback: dùng cột đầu tiên làm ID (cho sheet CauHinh)
  for (let i = 1; i < all.length; i++) {
    if (String(all[i][idIdx]) === String(id)) {
      sh.getRange(i + 1, 1, 1, headers.length)
        .setValues([headers.map((h, j) => data[h] !== undefined ? data[h] : all[i][j])]);
      return { success: true };
    }
  }
  return { success: false, error: 'Không tìm thấy bản ghi: ' + id };
}

function deleteRecord(ss, sheetName, id) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return { success: false, error: 'Sheet not found' };
  const all = sh.getDataRange().getValues();
  let idIdx = all[0].indexOf('id');
  if (idIdx < 0) idIdx = 0; // fallback: dùng cột đầu tiên làm ID
  for (let i = 1; i < all.length; i++) {
    if (String(all[i][idIdx]) === String(id)) {
      sh.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'Không tìm thấy bản ghi: ' + id };
}
