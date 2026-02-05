# 🚀 Guía de Instalación - Daisy Firmware Loader v1.1.0

## ✨ ¡IMPORTANTE! Esta versión incluye dfu-util integrado

**Ya NO necesitas instalar dfu-util por separado.** Todo está incluido en la aplicación.

---

## 📦 Instalación de la Aplicación

1. **Descarga el archivo DMG** correspondiente a tu Mac:
   - **Mac Intel (x64)**: `Daisy Firmware Loader-1.1.0.dmg`
   - **Mac Apple Silicon (M1/M2/M3)**: `Daisy Firmware Loader-1.1.0-arm64.dmg`

2. **Abre el archivo DMG** haciendo doble clic

3. **Arrastra la aplicación** a tu carpeta de Aplicaciones

4. **Abre la aplicación** desde Aplicaciones

   ⚠️ **Nota**: La primera vez que abras la app, macOS puede mostrar una advertencia de seguridad (porque la app no está firmada digitalmente). Para abrirla:
   - Haz **clic derecho** en la aplicación
   - Selecciona **"Abrir"**
   - Confirma que quieres abrirla

## 📱 Cómo Usar la Aplicación

### Paso 1: Poner Daisy en Modo DFU

1. Mantén presionado el botón **BOOT** en tu placa Daisy
2. Mientras mantienes BOOT, presiona y suelta el botón **RESET**
3. Suelta el botón **BOOT**
4. El LED de la placa debería dejar de parpadear

### Paso 2: Conectar y Cargar

1. **Conecta** tu placa Daisy al Mac mediante USB
2. La aplicación detectará automáticamente la conexión
3. **Haz clic en "Buscar"** para seleccionar tu archivo de firmware (.bin)
4. **Haz clic en "Cargar Firmware"**
5. **Espera** a que se complete el proceso (normalmente 10-30 segundos)
6. Verás un mensaje de éxito cuando termine

### Paso 3: Listo

Una vez completado:
- Puedes desconectar tu Daisy
- El nuevo firmware ya está cargado
- ¡Disfruta de tu Daisy con el nuevo firmware!

## ❓ Solución de Problemas

### La aplicación no detecta mi Daisy

**Solución**:
- Verifica que la placa esté en modo DFU (LED apagado o sin parpadear)
- Intenta desconectar y reconectar el cable USB
- Usa el botón de refrescar (🔄) en la aplicación
- Prueba con otro cable USB
- Verifica que el cable USB sea de datos (no solo de carga)

### Error durante la carga del firmware

**Posibles causas**:
- El archivo .bin no es compatible con tu modelo de Daisy
- La placa se desconectó durante el proceso
- El cable USB tiene problemas

**Solución**:
- Verifica que el archivo .bin sea el correcto para tu placa
- Mantén la placa conectada durante todo el proceso
- Prueba con otro cable USB
- Revisa los logs en la aplicación para más detalles

### La aplicación no se abre en macOS

**Solución**:
- Haz clic derecho → Abrir (en lugar de doble clic)
- Ve a Preferencias del Sistema → Seguridad y Privacidad
- Permite abrir la aplicación desde "App Store y desarrolladores identificados"

### Error de permisos al cargar firmware

**Solución**:
- La primera vez que uses la app, macOS puede pedir permisos de acceso USB
- Acepta los permisos cuando te lo solicite
- Si no aparece el diálogo, ve a Preferencias del Sistema → Seguridad y Privacidad → Privacidad

## 🔍 Información Técnica

### Compatibilidad

- **Sistema Operativo**: macOS 10.13 (High Sierra) o superior
- **Arquitecturas**: Intel (x64) y Apple Silicon (ARM64)
- **Placas compatibles**: Todas las placas Daisy Electrosmith (Seed, Patch, Field, Pod, etc.)

### Detalles de la Carga

- **Dirección de memoria**: 0x08000000 (flash del STM32)
- **Protocolo**: DFU (Device Firmware Upgrade)
- **Vendor ID**: 0x0483 (STMicroelectronics)
- **Product ID**: 0xDF11 (DFU Mode)
- **Herramienta**: dfu-util 0.11 (incluido)

## 📝 Notas Adicionales

- La aplicación NO requiere conexión a internet para funcionar
- Todos los procesos se ejecutan localmente en tu Mac
- dfu-util está incluido, no necesitas instalarlo
- La aplicación es completamente gratuita y de código abierto
- No se recopila ningún dato ni telemetría

## 🎉 Novedades en v1.1.0

### ✅ dfu-util Integrado
- Ya no necesitas instalar Homebrew
- Ya no necesitas instalar dfu-util por separado
- Todo funciona "out of the box"

### ✅ Más Fácil de Usar
- Instalación en un solo paso
- Sin dependencias externas
- Plug & Play

## 🆘 Soporte

Si tienes problemas:
1. Revisa esta guía completa
2. Verifica los logs en la aplicación
3. Asegúrate de que tu placa esté en modo DFU
4. Verifica que el cable USB funcione correctamente

## 📄 Licencia

MIT License - Uso libre para cualquier propósito

---

**Versión**: 1.1.0  
**Autor**: Xavioxi  
**Año**: 2026  
**Changelog**: dfu-util ahora incluido - No requiere instalación externa
