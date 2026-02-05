#!/bin/bash

# Script para firmar la aplicación localmente y evitar avisos de seguridad de macOS

echo "🔐 Firmando aplicación Daisy Firmware Loader..."

# Buscar la aplicación compilada
APP_PATH="./dist/mac/Daisy Firmware Loader.app"
APP_PATH_ARM="./dist/mac-arm64/Daisy Firmware Loader.app"
APP_PATH_UNIVERSAL="./dist/mac-universal/Daisy Firmware Loader.app"

# Determinar qué versión existe
if [ -d "$APP_PATH" ]; then
    TARGET="$APP_PATH"
elif [ -d "$APP_PATH_ARM" ]; then
    TARGET="$APP_PATH_ARM"
elif [ -d "$APP_PATH_UNIVERSAL" ]; then
    TARGET="$APP_PATH_UNIVERSAL"
else
    echo "❌ No se encontró la aplicación compilada en dist/"
    echo "   Ejecuta primero: npm run build"
    exit 1
fi

echo "📦 Aplicación encontrada: $TARGET"

# Firmar con firma ad-hoc (-)
echo "✍️  Firmando con identidad ad-hoc..."
codesign --force --deep --sign - "$TARGET"

if [ $? -eq 0 ]; then
    echo "✅ Aplicación firmada correctamente"
    echo "🎉 Ahora puedes abrir la aplicación sin avisos de seguridad"
    echo ""
    echo "Para abrir la aplicación:"
    echo "   open \"$TARGET\""
else
    echo "❌ Error al firmar la aplicación"
    exit 1
fi
