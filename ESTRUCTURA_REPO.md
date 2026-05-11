# ESTRUCTURA DEL REPOSITORIO GITHUB

```
alumnos/
│
├── README.md                    ← Documentación principal
├── netlify.toml                 ← Configuración de Netlify
├── .gitignore                   ← Archivos a ignorar
├── index.json                   ← Índice de archivos (generado automáticamente)
├── index.html                   ← Landing page con lista de recursos
├── admin.html                   ← Panel de administración
│
└── html/                        ← CARPETA PRINCIPAL DE HTMLS
    ├── impulso.html             ← Tus archivos HTML subidos
    ├── encuestapersonal.html    ├── Se sincronizan automáticamente
    ├── test.html                ├── desde Google Drive
    ├── test2.html               ├── 
    ├── catalogo.html            └── Pueden estar en subcarpetas
    └── ... más archivos
```

## 📋 Descripción de Archivos

### Raíz del repositorio:

- **README.md**
  - Documentación completa del proyecto
  - Instrucciones de setup
  - Flujo de trabajo

- **netlify.toml**
  - Configuración de redirecciones
  - Headers de seguridad
  - Reglas de cache

- **index.json**
  - Índice dinámico de todos los archivos
  - Metadata (fecha de modificación, URL)
  - Se actualiza automáticamente con cada sync

- **index.html**
  - Landing page principal
  - Lista todos los HTMLs disponibles con UI bonita
  - Carga dinámicamente desde index.json

- **admin.html**
  - Panel de control
  - Monitoreo de sincronización
  - Enlaces útiles a Drive, Sheets, GitHub

- **.gitignore**
  - Evita que se suban archivos temporales

### Carpeta `/html/`:

- Contiene TODOS los archivos HTML subidos desde Drive
- Se crean automáticamente con la sincronización
- Estructura plana (sin subcarpetas anidadas)

## 🔄 Flujo de Sincronización

```
1. Sube archivo a Google Drive
   └── archivo.html

2. Ejecuta sync() en Apps Script
   └── Lee cambios desde Drive
   └── Pushea a GitHub/main

3. GitHub webhook notifica a Netlify
   └── Netlify detecta cambios

4. Netlify redeploy
   └── Sirve los archivos en el dominio

5. Usuario accede a:
   └── https://alumnos.escencialconsultora.com/archivo
   └── https://alumnos.escencialconsultora.com/archivo.html
   (ambas URLs funcionan por las redirecciones en netlify.toml)
```

## 🌐 Sistema de URLs

Gracias a `netlify.toml`, cada HTML es accesible de múltiples formas:

```
/impulso                    → /html/impulso.html
/impulso.html              → /html/impulso.html
/html/impulso.html         → /html/impulso.html
```

Las redirecciones se hacen con status 200 (rewrite), no 301 (redirect),
para que sea transparente al usuario.

## 📦 Tamaño de Archivos Recomendados

- HTMLs individuales: < 5MB
- Total del repositorio: < 50MB
- Netlify acepta hasta 100MB

## ✅ Checklist de Setup

- [ ] Repositorio creado en GitHub
- [ ] Netlify conectado al repositorio
- [ ] Google Apps Script configurado con token de GitHub
- [ ] Carpeta de Drive sincronizada
- [ ] Dominio personalizado apuntando a Netlify
- [ ] Primer sync() ejecutado correctamente
- [ ] archivo/index.html accesible en el dominio
