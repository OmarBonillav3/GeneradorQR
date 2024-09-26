const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process'); // Para abrir la carpeta en el explorador

// Configura la interfaz de lectura desde la terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Crea la carpeta 'Resultados' si no existe
const outputDir = path.join(__dirname, 'Resultados');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Función para generar el código QR
function generarCodigoQR(url, nombreArchivo) {
  const rutaArchivo = path.join(outputDir, `${nombreArchivo}.png`);

  QRCode.toFile(rutaArchivo, url, (err) => {
    if (err) throw err;
    console.log(`\n${'-'.repeat(40)}`);
    console.log(`| Código QR guardado en: ${rutaArchivo}`);
    console.log(`${'-'.repeat(40)}\n`);

    // Ofrece opciones al usuario
    mostrarOpciones();
  });
}

// Función para mostrar opciones después de crear un código QR
function mostrarOpciones() {
  console.log('Elige una opción:');
  console.log('\n'); // LINEA VACIA
  console.log('1. Ver la carpeta');
  console.log('2. Crear otro código QR');
  console.log('3. Salir');
  console.log('\n'); // LINEA VACIA

  rl.question('Introduce el número de opción: ', (opcion) => {
    switch (opcion) {
      case '1':
        abrirCarpetaResultados();
        break;
      case '2':
        crearOtroCodigoQR();
        break;
      case '3':
        console.log('Saliendo del script...');
        rl.close();
        break;
      default:
        console.log('Opción no válida. Inténtalo de nuevo.');
        mostrarOpciones();
    }
  });
}

// Función para abrir la carpeta "Resultados"
function abrirCarpetaResultados() {
  const comando = process.platform === 'win32' ? 
    `start "" "${outputDir}"` : 
    process.platform === 'darwin' ? 
    `open "${outputDir}"` : 
    `xdg-open "${outputDir}"`;

  exec(comando, (err) => {
    if (err) throw err;
    
    console.log('\n'); // Primera línea de espacio
    console.log('\n'); // Segunda línea de espacio
    rl.question('Presiona Enter para continuar...', () => {
      mostrarOpciones(); // Regresa al menú de opciones
    });
  });
}

// Función para crear otro código QR
function crearOtroCodigoQR() {
  rl.question('Introduce la URL: ', (url) => {
    // Validar URL
    if (!url) {
      console.log('Error: La URL no puede estar vacía.');
      crearOtroCodigoQR(); // Pide la URL nuevamente
      return;
    }

    console.log('\n'); // Primera línea de espacio
    
    rl.question('Introduce el nombre del archivo: ', (nombreArchivo) => {
      // Validar nombre del archivo
      if (!nombreArchivo) {
        console.log('Error: El nombre del archivo no puede estar vacío.');
        crearOtroCodigoQR(); // Pide el nombre nuevamente
        return;
      }
      generarCodigoQR(url, nombreArchivo);
    });
  });
}

// Mostrar un encabezado atractivo
console.log(`
${'='.repeat(40)}
          GENERADOR DE CÓDIGOS QR
${'='.repeat(40)}
`);

// Pregunta por el URL inicialmente
crearOtroCodigoQR();
