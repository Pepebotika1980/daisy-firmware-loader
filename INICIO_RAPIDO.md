# 🚀 Inicio Rápido - Daisy Firmware Loader v1.1.0

## ✨ ¡NOVEDAD! Ya no necesitas instalar dfu-util

La versión 1.1.0 incluye dfu-util integrado. ¡Solo instala y usa!

---

## Para Usuarios (Instalar la App)

### 1️⃣ Instalar la Aplicación
- Abre el archivo `.dmg` de la carpeta `dist/`:
  - **Mac Intel**: `Daisy Firmware Loader-1.1.0.dmg`
  - **Mac Apple Silicon (M1/M2/M3)**: `Daisy Firmware Loader-1.1.0-arm64.dmg`
- Arrastra la app a Aplicaciones
- Abre la app (clic derecho → Abrir la primera vez)

### 2️⃣ Usar la Aplicación
1. Pon tu Daisy en modo DFU (BOOT + RESET)
2. Conecta la placa al Mac
3. Selecciona el archivo .bin
4. Haz clic en "Cargar Firmware"
5. ¡Listo!

📖 **Más detalles**: Lee `INSTALACION.md`

---

## Para Desarrolladores (Modificar el Código)

### Instalar Dependencias
```bash
npm install
```

### Reconstruir Módulos Nativos
```bash
npx electron-rebuild
```

### Ejecutar en Modo Desarrollo
```bash
npm start
```

### Compilar la Aplicación
```bash
npm run build
```

Los archivos .dmg se generarán en la carpeta `dist/`

📖 **Más detalles**: Lee `README.md`

---

## 📁 Archivos Importantes

- **Aplicaciones compiladas**: `dist/*.dmg`
- **Código fuente**: `main.js`, `renderer.js`, `preload.js`, `index.html`, `styles.css`
- **Binarios incluidos**: `bin/dfu-util`, `bin/libusb-1.0.0.dylib`
- **Documentación completa**: `INSTALACION.md`
- **Resumen del proyecto**: `RESUMEN.md`

## ⚡ Solución Rápida de Problemas

**No detecta la placa**: Verifica modo DFU (LED apagado)  
**App no abre**: Clic derecho → Abrir (primera vez)  
**Error al cargar**: Verifica que el archivo .bin sea compatible con tu Daisy

---

## 🎉 Cambios en v1.1.0

- ✅ **dfu-util incluido**: Ya no necesitas instalarlo por separado
- ✅ **Plug & Play**: Instala y usa inmediatamente
- ✅ **Más fácil**: Sin dependencias externas

---

**¿Necesitas ayuda?** Lee la documentación completa en `INSTALACION.md`
