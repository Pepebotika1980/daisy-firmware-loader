# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [1.3.1] - 2026-02-06

### 🐛 Corregido
- Solucionado error "Cannot find module 'intel-hex'" en la versión compilada. Se ha corregido la configuración de empaquetado para incluir correctamente las dependencias de producción.

## [1.3.0] - 2026-02-06

### 🔧 Cambiado
- Mejorada la detección de `dfu-util` para soportar arquitecturas Apple Silicon (ARM64) e Intel (x64).
- Añadido sistema de "salvavidas" que usa el `dfu-util` del sistema (ej. Homebrew) si los binarios locales no son compatibles o están corruptos.
- Mejorada la gestión de errores y logs durante el proceso de búsqueda de binarios.

### 🐛 Corregido
- Solucionado bloqueo de la aplicación al intentar ejecutar archivos HTML corruptos en la carpeta `bin`.
- Corregida la incompatibilidad de arquitectura en Macs con procesadores M1/M2/M3.

## [1.2.0] - 2026-02-06
- Mejoras menores en la interfaz y estabilidad.

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
