# Alumnos - ESCENCIAL CONSULTORA

Sistema de sincronización automática: Google Drive → GitHub → Netlify

## 🔄 Flujo de Funcionamiento

```
Google Drive (Carpeta de HTMLs)
    ↓
Google Apps Script + DriveGitSync (sincroniza cambios)
    ↓
GitHub Repository (alumnos)
    ↓
Netlify (despliega automáticamente)
    ↓
https://alumnos.escencialconsultora.com
```

## 📂 Estructura de Carpetas

```
alumnos/
├── html/                    # Todos los HTMLs subidos van aquí
│   ├── impulso.html
│   ├── encuestapersonal.html
│   ├── test.html
│   └── ...
├── index.html              # Landing page con listado dinámico
├── router.js               # Lógica de rutas
├── style.css               # Estilos
├── admin.html              # Panel de control (opcional)
├── netlify.toml            # Configuración de Netlify
├── .gitignore
└── README.md
```

## 🚀 Configuración en Netlify

1. **Conectar GitHub**: Ve a Netlify → New site from Git
2. **Seleccionar repositorio**: `NelsonVsqz/alumnos`
3. **Build settings**:
   - Build command: (dejar vacío)
   - Publish directory: `.` (raíz del repo)
4. **Redirects** (se configura en `netlify.toml`):
   - `/ejemplo.html` → `/html/ejemplo.html`
   - `/ejemplo` → `/html/ejemplo.html` (sin extensión)

## 🔑 Variables de Entorno

En Netlify:
- No se necesita token de GitHub en Netlify (se usa en Apps Script)
- El token de GitHub se gestiona en Google Apps Script

## 📝 Cómo Usar

### Subir un nuevo HTML:

1. **Opción 1 - Desde Drive (automático)**:
   - Sube el archivo `.html` a la carpeta de Drive
   - Ejecuta `sync()` en Google Apps Script
   - Commit automático a GitHub
   - Netlify despliega automáticamente

2. **Opción 2 - Desde Admin Panel**:
   - Ve a `https://alumnos.escencialconsultora.com/admin.html`
   - Sube el archivo
   - Se sincroniza todo automáticamente

## 🔗 URLs de Acceso

Cada HTML se accede de dos formas:

```
https://alumnos.escencialconsultora.com/impulso.html
https://alumnos.escencialconsultora.com/impulso
```

Ambas sirven el mismo contenido.

## ⚙️ Configuración de Apps Script

El script en Google Sheets:
- Sincroniza cambios en Drive cada vez que ejecutas `sync()`
- Pushea a GitHub automáticamente
- Actualiza el índice en `index.json` para referencia

## 📊 Índice de Archivos

Se genera automáticamente en `index.json`:

```json
{
  "files": [
    {
      "name": "impulso.html",
      "title": "Impulso",
      "path": "/html/impulso.html",
      "modified": "2026-03-07T12:06:26.765Z"
    }
  ]
}
```

## 🛠️ Mantenimiento

- **Limpiar archivos**: Elimina de Drive → sincroniza → GitHub se actualiza
- **Modificar HTML**: Edita en Drive → sincroniza → se actualiza automáticamente
- **Ver logs**: Abre "Ejecuciones" en Google Apps Script

## 🔐 Seguridad

- Token de GitHub guardado como property de script
- No expongas el token en el código
- Usa `github_pat_*` tokens con permisos limitados

---

**Última sincronización automática**: Se ejecuta cada vez que usas `sync()` en Apps Script
