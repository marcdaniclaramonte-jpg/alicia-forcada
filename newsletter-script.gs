// ─────────────────────────────────────────────────────────────
//  Google Apps Script — Newsletter Alicia Forcada
//  Guarda emails en la hoja de Google Sheets
//
//  PASOS PARA ACTIVARLO:
//  1. Ve a https://script.google.com y crea un nuevo proyecto
//  2. Borra el código que hay y pega TODO este archivo
//  3. Haz clic en "Implementar" → "Nueva implementación"
//  4. Tipo: "Aplicación web"
//     · Ejecutar como: Yo (tu cuenta de Google)
//     · Quién tiene acceso: Cualquier usuario (Anyone)
//  5. Haz clic en "Implementar" y copia la URL que aparece
//  6. Pega esa URL en index.html donde pone: TU_URL_APPS_SCRIPT_AQUI
// ─────────────────────────────────────────────────────────────

const SHEET_ID = '1xaCzSZqL4ovV5UeN2WZksOaEz8_UQenhYIzskRV-Do8';
const SHEET_NAME = 'Suscriptores'; // Nombre de la pestaña (la crea si no existe)

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const email = data.email || '';
    const date  = data.date  || new Date().toLocaleString('es-ES');

    if (!email) return response({ ok: false, error: 'Email vacío' });

    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Crea la hoja y cabeceras si no existe
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Email', 'Fecha de suscripción']);
      sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
    }

    // Evita duplicados
    const emails = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
    if (emails.includes(email)) {
      return response({ ok: true, msg: 'Ya estaba suscrito' });
    }

    sheet.appendRow([email, date]);
    return response({ ok: true });

  } catch (err) {
    return response({ ok: false, error: err.message });
  }
}

function response(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Acepta peticiones GET (útil para probar que el script funciona)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, msg: 'Newsletter script activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}
