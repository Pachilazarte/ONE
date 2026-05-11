## 🚀 GUÍA COMPLETA DE IMPLEMENTACIÓN

### Plataforma de Alumnos - ESCENCIAL CONSULTORA
Sistema automático: Drive → GitHub → Netlify

---

## 📋 ÍNDICE

1. [Requisitos Previos](#requisitos-previos)
2. [Paso 1: Preparar GitHub](#paso-1-preparar-github)
3. [Paso 2: Configurar Netlify](#paso-2-configurar-netlify)
4. [Paso 3: Apps Script - Google Sheets](#paso-3-apps-script---google-sheets)
5. [Paso 4: Primera Sincronización](#paso-4-primera-sincronización)
6. [Paso 5: Verificar y Usar](#paso-5-verificar-y-usar)
7. [Troubleshooting](#troubleshooting)

---

## ✅ REQUISITOS PREVIOS

Debes tener:
- [ ] Cuenta de GitHub
- [ ] Cuenta de Netlify (conectada a GitHub)
- [ ] Acceso a Google Sheets / Google Apps Script
- [ ] Google Drive (carpeta con HTMLs)
- [ ] Token de GitHub generado

### Generar Token de GitHub

1. Ve a https://github.com/settings/tokens
2. Haz clic en "Generate new token"
3. Selecciona permisos:
   - `repo` (acceso completo a repositorios)
   - `admin:repo_hook` (webhooks)
4. Copia el token (aparece una sola vez)
5. **Guarda en lugar seguro** - lo necesitarás después

---

## PASO 1: PREPARAR GITHUB

### Crear el Repositorio

1. Ve a https://github.com/new
2. **Repository name**: `alumnos`
3. **Description**: "Plataforma de sincronización de alumnos"
4. **Visibility**: Public (Netlify necesita acceso)
5. **Initialize**: Selecciona "Add a README file"
6. Crea el repositorio

### Añadir Estructura al Repositorio

Una vez creado, clona y agrega estos archivos:

```bash
git clone https://github.com/TU_USUARIO/alumnos.git
cd alumnos

# Copiar todos los archivos que creamos
# (index.html, admin.html, netlify.toml, README.md, etc)

git add .
git commit -m "Initial setup - Plataforma de Alumnos"
git push origin main
```

Archivos necesarios en la raíz:
- ✅ `README.md`
- ✅ `netlify.toml`
- ✅ `.gitignore`
- ✅ `index.json`
- ✅ `index.html`
- ✅ `admin.html`

Carpeta `html/`:
- ✅ `ejemplo.html`
- ✅ `encuesta-ejemplo.html`
- (Los demás se sincronizan desde Drive)

---

## PASO 2: CONFIGURAR NETLIFY

### Conectar a GitHub

1. Ve a https://app.netlify.com
2. Haz clic en "New site from Git"
3. **Connect to Git provider**: Selecciona GitHub
4. Autoriza Netlify (si es primera vez)
5. **Select a repository**: Busca y selecciona `alumnos`

### Configurar Build Settings

1. **Base directory**: (dejar vacío)
2. **Build command**: (dejar vacío - no se necesita)
3. **Publish directory**: `.` (punto = raíz)
4. **Environment variables**: (no se necesitan)

### Agregar Dominio Personalizado

1. Ve a **Site settings** → **Domain settings**
2. Haz clic en "Add custom domain"
3. Ingresa: `alumnos.escencialconsultora.com`
4. Sigue las instrucciones para DNS
5. Espera a que se active (puede tardar 24-48 horas)

### Verificar Configuración

1. Netlify debería desplegar automáticamente
2. Verifica en **Deploys** que haya un build exitoso
3. Abre el sitio desde el link que proporciona Netlify

---

## PASO 3: APPS SCRIPT - GOOGLE SHEETS

### Abrir Google Apps Script

1. Abre tu Google Sheet: 
   https://docs.google.com/spreadsheets/d/1gD_OO8Ot9zz6i5hgGUJNU9zUNr51V-NYeBQsjLi5b2g

2. Ve a **Extensions** → **Apps Script**

3. Se abrirá el editor de código

### Instalar Librería DriveGitSync

1. En el editor, ve a **Libraries** (ícono de librerías)
2. Agrega esta ID: `1qmb4zKNLZc1fDqGvj-_r5bPYh6Lfvvf4cWvpOBZkBU7`
3. Version: Latest
4. Identifier: `Librery_github_drive`

### Configurar Apps Script

1. Abre el archivo `code.gs` del proyecto
2. Reemplaza el contenido con tu código mejorado:

```javascript
function job_() {
  return Librery_github_drive.DriveGitSync.init({
    sheetId: '1gD_OO8Ot9zz6i5hgGUJNU9zUNr51V-NYeBQsjLi5b2g',
    driveFolderId: '1zotHNR7eKBedpvIya4j8716AJIJU2pMC',
    baseUrl: 'https://alumnos.escencialconsultora.com',

    githubUser: 'TU_USUARIO_GITHUB', // ← Cambia aquí
    githubRepo: 'alumnos',
    githubBranch: 'main',

    githubTokenProp: 'GITHUB_TOKEN' 
  });
}

function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Drive Sync')
    .addItem('Sync incremental (Changes)', 'sync')
    .addSeparator()
    .addItem('Abrir carpeta Drive', 'openDriveFolder')    
    .addSeparator()
    .addItem('Video como autorizar?', 'openMega')        
    .addToUi();
}

function sync() { 
  job_().syncChanges();
  Utilities.sleep(1000);
  updateGitHubIndex(); // Actualiza index.json
}

function init() { job_().runInitialFullSync(); }

function openDriveFolder() {
  const cfg = job_().cfg;   
  const url = "https://drive.google.com/drive/folders/" + cfg.driveFolderId;
  const html = HtmlService.createHtmlOutput(`
    <script>
      window.open('${url}', '_blank');
      google.script.host.close();
    </script>
  `).setWidth(20).setHeight(20);
  SpreadsheetApp.getUi().showModalDialog(html, 'Abrir Drive');
}

function openMega() {
  const url = "https://mega.nz/file/ErwjEZxA#XNn5_WouE6zt-oWoBXjaP7SYfpLsG-UmzJjUnbjtCc8";
  const html = HtmlService.createHtmlOutput(`
    <script>
      window.open('${url}', '_blank');
      google.script.host.close();
    </script>
  `).setWidth(20).setHeight(20);
  SpreadsheetApp.getUi().showModalDialog(html, 'Ver Video');
}

function setup() {
  // ← Ejecuta esto UNA SOLA VEZ para guardar el token
  Librery_github_drive.DriveGitSync.setupToken({ 
    tokenProp: 'GITHUB_TOKEN', 
    tokenValue: 'AQUI_TU_TOKEN_GITHUB' // ← Pega tu token aquí
  });
}

// Función para actualizar index.json automáticamente
function updateGitHubIndex() {
  const cfg = job_().cfg;
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const files = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[2]) {
      files.push({
        name: row[2],
        path: `/html/${row[2]}`,
        url: `${cfg.baseUrl}/${row[2].replace('.html', '')}`,
        modified: row[4] || new Date().toISOString(),
        size: 'kb'
      });
    }
  }

  const indexContent = {
    lastSync: new Date().toISOString(),
    baseUrl: cfg.baseUrl,
    files: files,
    total: files.length
  };

  const url = `https://api.github.com/repos/${cfg.githubUser}/${cfg.githubRepo}/contents/index.json`;
  const token = PropertiesService.getScriptProperties().getProperty(cfg.githubTokenProp);

  try {
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
    } catch (e) {}

    const payload = {
      message: `Actualizar índice - ${new Date().toLocaleString('es-ES')}`,
      content: Utilities.base64Encode(JSON.stringify(indexContent, null, 2)),
      branch: cfg.githubBranch
    };

    if (sha) payload.sha = sha;

    UrlFetchApp.fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    console.log('✅ index.json actualizado');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}
```

### Guardar el Token (IMPORTANTE)

1. En el editor, haz clic en **Execute** junto a la función `setup()`
2. Autoriza cuando se pida
3. El token se guarda automáticamente como property seguro

---

## PASO 4: PRIMERA SINCRONIZACIÓN

### Preparar los Archivos

1. Sube tus archivos HTML a la carpeta de Google Drive:
   - `impulso.html`
   - `encuestapersonal.html`
   - `test.html`
   - etc.

2. Asegúrate de que están en la carpeta correcta de Drive

### Ejecutar Sincronización

1. Vuelve a tu Google Sheet
2. Verás un menú "Drive Sync" (arriba a la derecha)
3. Haz clic en **"Sync incremental (Changes)"**
4. Espera a que se complete (puede tardar 30-60 segundos)
5. Deberías ver en la consola ✅ "Sincronización completada"

### Verificar en GitHub

1. Ve a https://github.com/TU_USUARIO/alumnos
2. Deberías ver cambios nuevos en la rama `main`
3. Los archivos HTML deberían estar en la carpeta `/html/`

### Verificar en Netlify

1. Ve a https://app.netlify.com
2. En **Deploys** deberías ver un nuevo deployment
3. Espera a que termine (status: **Published**)
4. Abre el sitio con el botón "Open production deploy"

---

## PASO 5: VERIFICAR Y USAR

### Probar URLs

Abre tu navegador e intenta acceder a:

```
https://alumnos.escencialconsultora.com/
https://alumnos.escencialconsultora.com/impulso
https://alumnos.escencialconsultora.com/impulso.html
https://alumnos.escencialconsultora.com/admin
```

Todas deberían funcionar (gracias a netlify.toml).

### Ver el Listado de Archivos

1. Abre https://alumnos.escencialconsultora.com/
2. Deberías ver un listado con todos tus HTMLs
3. Haz clic en cualquiera para verlo

### Acceder al Panel de Admin

1. Abre https://alumnos.escencialconsultora.com/admin.html
2. Verás información de sincronización
3. Enlaces a Drive, Sheets, GitHub

---

## 🔄 FLUJO DE USO DIARIO

**Para agregar o modificar un HTML:**

1. ✏️ Sube/edita el archivo en Google Drive
2. 🔄 Ve a Sheets → Menu "Drive Sync" → "Sync incremental"
3. ⏳ Espera confirmación
4. 🚀 Netlify despliega automáticamente
5. ✅ El sitio se actualiza automáticamente

---

## 🐛 TROUBLESHOOTING

### Error: "No hay cambios para sincronizar"
- Verifica que los archivos estén en la carpeta correcta de Drive
- Asegúrate de guardar cambios en Drive antes de sincronizar

### Error: "Token inválido"
- El token expiró. Ve a GitHub y genera uno nuevo
- Ejecuta `setup()` nuevamente con el nuevo token

### Los archivos no aparecen en el sitio
- Verifica que Netlify haya completado el deployment
- Abre DevTools (F12) y busca errores en la consola
- Intenta hard-refresh (Ctrl+Shift+R)

### index.json no se actualiza
- Verifica que el token de GitHub sea válido
- Revisa los logs en Google Apps Script (Extensions → Execution Log)

### Dominio personalizado no funciona
- Los cambios DNS pueden tardar 24-48 horas
- Verifica la configuración en Netlify → Domain Management

### HTML no se ve correctamente
- Asegúrate que uses UTF-8 en tu archivo
- No uses caracteres especiales en nombres de archivo

---

## 📞 SOPORTE

Si necesitas ayuda:

1. **Google Apps Script**: Ver logs en Extensions → Execution log
2. **GitHub**: Ver commits en el repositorio
3. **Netlify**: Ver deploy logs en Site settings → Deploys
4. **Drive**: Verificar permisos de la carpeta

---

## ✨ PRÓXIMOS PASOS

Una vez funcional, puedes:

- [ ] Personalizar colores en `index.html` y `admin.html`
- [ ] Agregar tu propio CSS y JavaScript
- [ ] Crear plantillas de HTML reutilizables
- [ ] Integrar bases de datos (Firebase, Supabase)
- [ ] Agregar autenticación
- [ ] Configurar analytics
- [ ] Crear formularios con backend

---

**¡Listo para empezar!** 🎉
