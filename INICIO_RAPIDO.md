# 🚀 Guía de Inicio Rápido - Daisy Firmware Loader

## Para Usuarios

### 1️⃣ Descarga la Aplicación
- Descarga el archivo `.dmg` de la última versión
- Abre el `.dmg` y arrastra la aplicación a tu carpeta de Aplicaciones

### 2️⃣ Primera Ejecución
Al abrir la aplicación por primera vez:
1. Haz clic derecho en la aplicación
2. Selecciona "Abrir"
3. Confirma que quieres abrir la aplicación

**Nota**: Solo necesitas hacer esto la primera vez. Después se abrirá normalmente.

### 3️⃣ Usar la Aplicación
1. Pon tu Daisy en modo DFU (ver instrucciones en la app)
2. Conecta la placa por USB
3. Selecciona el archivo `.bin` del firmware
4. Haz clic en "Cargar Firmware"
5. ¡Listo! Espera unos segundos

---

## Para Desarrolladores

### Instalación
```bash
git clone https://github.com/TU-USUARIO/daisy-firmware-loader.git
cd daisy-firmware-loader
npm install
```

### Ejecutar en Desarrollo
```bash
npm start
```

### Compilar la Aplicación
```bash
npm run build
```

### Firmar la Aplicación (Evitar Avisos de Seguridad)
Después de compilar:
```bash
./sign-app.sh
```

O manualmente:
```bash
codesign --force --deep --sign - "dist/mac/Daisy Firmware Loader.app"
```

---

## Solución de Problemas

### ❌ "La aplicación no se puede abrir"
- Haz clic derecho → Abrir (primera vez)
- O ve a Preferencias del Sistema → Seguridad y Privacidad → Abrir igualmente

### ❌ "No detecta mi Daisy"
- Asegúrate de que esté en modo DFU (LED apagado)
- Desconecta y reconecta la placa
- Haz clic en el botón de refrescar

### ❌ Error al cargar firmware
- Verifica que el archivo `.bin` sea compatible
- Revisa los logs en la aplicación
- Asegúrate de que el cable USB funcione

---

## Características

✅ Detección automática de Daisy en modo DFU  
✅ Sin dependencias externas (dfu-util incluido)  
✅ Interfaz simple e intuitiva  
✅ Logs en tiempo real  
✅ Instrucciones integradas  
✅ Compatible con macOS (Intel y Apple Silicon)  

---

## Licencia

MIT © 2026 Xavioxi
