// ─────────────────────────────────────────────────────────────
//  Google Apps Script — Newsletter Alicia Forcada
//  Guarda emails en la hoja de Google Sheets
//
//  PASOS PARA ACTIVARLO / ACTUALIZARLO:
//  1. Ve a https://script.google.com y abre el proyecto existente
//  2. Borra el código que hay y pega TODO este archivo
//  3. Haz clic en "Implementar" → "Administrar implementaciones"
//  4. Haz clic en el lápiz (editar) de la implementación existente
//  5. En "Versión" selecciona "Nueva versión"
//  6. Haz clic en "Implementar" — la URL no cambia
// ─────────────────────────────────────────────────────────────

const SHEET_ID   = '1xaCzSZqL4ovV5UeN2WZksOaEz8_UQenhYIzskRV-Do8';
const SHEET_NAME = 'Suscriptores';

function saveEmail(email, date) {
  if (!email) return { ok: false, error: 'Email vacío' };

  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let sheet   = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Email', 'Fecha de suscripción']);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
  }

  const emails = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
  if (emails.includes(email)) {
    return { ok: true, msg: 'Ya estaba suscrito' };
  }

  sheet.appendRow([email, date || new Date().toLocaleString('es-ES')]);
  return { ok: true };
}

// Peticiones GET — usadas por el formulario web (evita problemas CORS con POST)
function doGet(e) {
  try {
    const email = e.parameter && e.parameter.email ? e.parameter.email.trim() : '';

    if (!email) {
      return response({ ok: true, msg: 'Newsletter script activo' });
    }

    const date = e.parameter.date || new Date().toLocaleString('es-ES');
    return response(saveEmail(email, date));

  } catch (err) {
    return response({ ok: false, error: err.message });
  }
}

// Peticiones POST (compatibilidad futura)
function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    return response(saveEmail(data.email, data.date));
  } catch (err) {
    return response({ ok: false, error: err.message });
  }
}

function response(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
