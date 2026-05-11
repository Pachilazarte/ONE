/**
 * FUNCIÓN ADICIONAL PARA APPS SCRIPT
 * 
 * Agrega esta función a tu proyecto de Google Apps Script para que 
 * actualice automáticamente el index.json en GitHub después de cada sincronización.
 * 
 * Cópiala y pégala en tu proyecto de Apps Script (code.gs)
 */

/**
 * Actualiza el archivo index.json en GitHub con la lista de archivos sincronizados
 * Se ejecuta automáticamente después de sync()
 */
function updateGitHubIndex() {
  const cfg = job_().cfg;
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Parsear datos desde la hoja
  const files = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[2]) { // FileName
      files.push({
        name: row[2], // FileName
        path: `/html/${row[2]}`,
        url: `${cfg.baseUrl}/${row[2].replace('.html', '')}`,
        modified: row[4] || new Date().toISOString(), // LastModified
        size: 'kb'
      });
    }
  }

  // Crear objeto index.json
  const indexContent = {
    lastSync: new Date().toISOString(),
    baseUrl: cfg.baseUrl,
    files: files,
    total: files.length
  };

  // Enviar a GitHub
  const url = `https://api.github.com/repos/${cfg.githubUser}/${cfg.githubRepo}/contents/index.json`;
  const token = PropertiesService.getScriptProperties().getProperty(cfg.githubTokenProp);

  try {
    // Obtener el SHA actual del archivo (si existe)
    let sha = null;
    try {
      const getResponse = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      sha = JSON.parse(getResponse.getContentText()).sha;
    } catch (e) {
      // Archivo no existe aún, se creará
    }

    // Preparar payload
    const payload = {
      message: `Actualizar índice de archivos - ${new Date().toLocaleString('es-ES')}`,
      content: Utilities.base64Encode(JSON.stringify(indexContent, null, 2)),
      branch: cfg.githubBranch
    };

    if (sha) {
      payload.sha = sha; // Actualizar archivo existente
    }

    // Hacer request a GitHub
    UrlFetchApp.fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    console.log('✅ index.json actualizado en GitHub');
    showNotification('✅ Índice actualizado correctamente');

  } catch (error) {
    console.error('❌ Error actualizando index.json:', error);
    showNotification('❌ Error al actualizar índice: ' + error.message);
  }
}

/**
 * Modifica la función sync() para incluir la actualización del índice
 * Reemplaza tu sync() actual con esta:
 */
function sync_mejorado() {
  try {
    // Sincronización normal
    job_().syncChanges();
    
    // Actualizar índice
    Utilities.sleep(1000); // Esperar a que se complete la sincronización
    updateGitHubIndex();
    
    console.log('✅ Sincronización completada con índice actualizado');
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
  }
}

/**
 * Función auxiliar para mostrar notificaciones
 */
function showNotification(message) {
  SpreadsheetApp.getUi().showModelessDialog(
    HtmlService.createHtmlOutput(message),
    'Notificación'
  );
}

/**
 * INSTRUCCIONES DE INSTALACIÓN:
 * 
 * 1. Abre tu Google Sheet
 * 2. Ve a Extensions → Apps Script
 * 3. Copia el contenido de esta función updateGitHubIndex()
 * 4. Pégala en tu código (code.gs)
 * 5. Modifica tu función sync() para llamar a updateGitHubIndex() después
 * 
 * Ejemplo:
 * 
 * function sync() {
 *   job_().syncChanges();
 *   Utilities.sleep(1000);
 *   updateGitHubIndex();  // Agregar esta línea
 * }
 * 
 * O simplemente usa sync_mejorado() en lugar de sync()
 */
