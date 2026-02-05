# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [1.1.0] - 2026-02-05

### 🎉 Añadido
- Script `sign-app.sh` para firmar la aplicación y evitar avisos de seguridad de macOS
- Configuración de firma ad-hoc en electron-builder
- Documentación mejorada sobre firma de código
- Sistema de polling para detección USB más confiable

### 🔧 Cambiado
- Reemplazado `usb-detection` por polling con `system_profiler`
- Mejorado el sistema de detección de conexión USB
- Actualizada la documentación con instrucciones de firma

### 🐛 Corregido
- Eliminado error "Cannot find module 'usb-detection'" al iniciar la aplicación
- Solucionados los avisos de seguridad de macOS con firma ad-hoc
- Mejorada la estabilidad de la detección de dispositivos USB

### 🗑️ Eliminado
- Dependencia `usb-detection` (causaba problemas con módulos nativos)
- Dependencia `@electron/rebuild` (ya no necesaria)

## [1.0.0] - 2026-02-05

### 🎉 Lanzamiento Inicial
- Aplicación Electron para cargar firmwares a placas Daisy
- Detección automática de dispositivos en modo DFU
- Interfaz gráfica intuitiva
- Logs en tiempo real del proceso de carga
- Binarios de dfu-util incluidos (sin dependencias externas)
- Compatible con macOS (Intel y Apple Silicon)
