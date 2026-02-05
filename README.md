# 🌼 Daisy Firmware Loader

Una aplicación moderna, elegante y nativa para macOS diseñada para cargar firmwares en placas **Daisy (Electrosmith)** de forma sencilla y fiable.

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Características Premium

- 🔌 **Plug & Play**: Detección automática de placas Daisy en modo DFU mediante polling de sistema ultra-ligero.
- 📊 **Progreso Real**: Barra de progreso animada que muestra el estado de la carga en tiempo real.
- 📦 **Binarios Integrados**: Incluye `dfu-util` y `libusb` pre-compilados (Intel y Apple Silicon) para que funcione "fuera de la caja".
- 🎨 **Interfaz Moderna**: Diseño oscuro (Glassmorphism) con animaciones suaves y feedback visual claro.
- 📂 **Selector Inteligente**: Soporta archivos `.bin` y `.hex`. Los archivos `.hex` se convierten automáticamente a binario en milisegundos.
- 🛠️ **Consola Avanzada**: Logs técnicos detallados ocultos tras un panel colapsable para usuarios avanzados.
- 🔐 **Firma de Seguridad**: Script incluido para firma ad-hoc y evitar avisos de Gatekeeper.

## 🚀 Instalación Rápida

### Descargar la App
[![Descargar v1.2.0](https://img.shields.io/badge/Descargar-v1.2.0--macOS-blue?style=for-the-badge&logo=apple)](https://github.com/Pepebotika1980/daisy-firmware-loader/releases/latest)

1. Ve a la sección de [Releases](https://github.com/Pepebotika1980/daisy-firmware-loader/releases/latest).
2. Descarga el archivo `.dmg` correspondiente a tu procesador (Intel o Apple Silicon).
3. Arrastra la app a tu carpeta de Aplicaciones.

### Requisitos Técnicos
Aunque los binarios están integrados, se recomienda tener `dfu-util` instalado en el sistema para máxima compatibilidad:
```bash
brew install dfu-util
```

## 🛠️ Desarrollo y Compilación

Si quieres contribuir o compilar tu propia versión:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Pepebotika1980/daisy-firmware-loader.git
   cd daisy-firmware-loader
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm start
   ```

4. **Compilar para macOS (.dmg):**
   ```bash
   npm run build
   # Luego garantiza que la app pueda abrirse:
   ./sign-app.sh
   ```

## 📖 Cómo Usar

1. **Modo DFU**: En tu placa Daisy, mantén pulsado **BOOT**, pulsa y suelta **RESET**, y finalmente suelta **BOOT**. El LED debe dejar de parpadear.
2. **Conexión**: Conecta el USB. El indicador en la app pasará a verde: `Daisy Conectada`.
3. **Selección**: Elige tu archivo `.bin` o `.hex`.
4. **Carga**: Haz clic en **Iniciar Carga**. Si seleccionaste un `.hex`, la aplicación lo convertirá automáticamente antes de iniciar la transferencia.
5. **Finalización**: Cuando veas el banner de éxito, tu Daisy se reiniciará automáticamente con el nuevo firmware.

## 📁 Estructura del Proyecto

- `main.js`: Lógica del proceso principal y manejo de binarios.
- `renderer.js`: Manejo de la interfaz y barra de progreso.
- `bin/`: Binarios nativos de `dfu-util` y `libusb`.
- `styles.css`: Diseño moderno basado en variables CSS.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---
Hecho con ❤️ para la comunidad de **Daisy Electrosmith** por Pepebotika1980 & Antigravity.
