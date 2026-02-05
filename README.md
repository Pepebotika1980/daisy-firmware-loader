# Daisy Firmware Loader

Aplicación nativa para macOS que permite cargar firmwares a placas Daisy Electrosmith sin necesidad de usar la web de Electrosmith.

## Características

- ✅ Detección automática de placas Daisy en modo DFU
- ✅ Interfaz simple e intuitiva
- ✅ Selector de archivos .bin
- ✅ Logs en tiempo real del proceso de carga
- ✅ Instrucciones integradas para poner Daisy en modo DFU

## Requisitos Previos

Antes de usar la aplicación, necesitas instalar `dfu-util`:

```bash
brew install dfu-util
```

Si no tienes Homebrew instalado, puedes instalarlo desde [brew.sh](https://brew.sh)

## Instalación para Desarrollo

1. Clona o descarga este repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:

```bash
npm start
```

## Compilar la Aplicación

Para crear una aplicación .dmg para macOS:

```bash
npm run build
```

Esto generará un archivo .dmg en la carpeta `dist/` que puedes distribuir e instalar en cualquier Mac.

### Evitar Avisos de Seguridad de macOS

Después de compilar, firma la aplicación para evitar los avisos de seguridad:

```bash
./sign-app.sh
```

O manualmente:

```bash
codesign --force --deep --sign - "dist/mac/Daisy Firmware Loader.app"
```

**Nota**: La firma ad-hoc (con `-`) solo funciona en el Mac donde compilaste la app. Para distribuir a otros usuarios, necesitarías una cuenta de desarrollador de Apple y firmar con un certificado válido.

## Cómo Usar

1. **Pon tu Daisy en modo DFU:**
   - Mantén presionado el botón **BOOT**
   - Presiona y suelta el botón **RESET**
   - Suelta el botón **BOOT**
   - El LED debería dejar de parpadear

2. **Conecta la placa** a tu Mac mediante USB

3. **Selecciona el archivo** de firmware (.bin)

4. **Haz clic en "Cargar Firmware"**

5. **Espera** a que se complete el proceso (unos segundos)

6. **¡Listo!** Tu Daisy ahora tiene el nuevo firmware

## Estructura del Proyecto

```
.
├── main.js          # Proceso principal de Electron
├── preload.js       # Script de preload (seguridad)
├── renderer.js      # Lógica de la interfaz
├── index.html       # Estructura HTML
├── styles.css       # Estilos
├── package.json     # Configuración del proyecto
└── README.md        # Este archivo
```

## Tecnologías Utilizadas

- **Electron** - Framework para aplicaciones de escritorio
- **Node.js** - Runtime de JavaScript
- **dfu-util** - Herramienta para cargar firmware DFU
- **usb-detection** - Detección de dispositivos USB

## Solución de Problemas

### La aplicación no detecta mi Daisy

- Asegúrate de que la placa esté en modo DFU (el LED debe dejar de parpadear)
- Intenta desconectar y reconectar la placa
- Haz clic en el botón de refrescar (icono de flechas circulares)

### Error: "dfu-util no está instalado"

- Instala dfu-util usando Homebrew: `brew install dfu-util`
- Reinicia la aplicación después de instalar

### El firmware no se carga

- Verifica que el archivo .bin sea compatible con tu placa Daisy
- Asegúrate de que el cable USB funcione correctamente
- Revisa los logs en la aplicación para más detalles del error

## Licencia

MIT

## Autor

Xavioxi - 2026
