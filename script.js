document.getElementById('formulario').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombreTutor = document.getElementById('nombre_tutor').value.trim();
  const nombreEstudiante = document.getElementById('nombre_estudiante').value.trim();
  const lugarRetiro = document.getElementById('lugar_retiro').value.trim();
  const fechaDevolucion = document.getElementById('fecha_devolucion').value.trim();
  const celularContacto = document.getElementById('celular_contacto').value.trim();

  const datos = {
    "nombre_tutor": nombreTutor,
    "nombre_estudiante": nombreEstudiante,
    "lugar_retiro": lugarRetiro,
    "fecha_devolucion": fechaDevolucion,
    "celular_contacto": celularContacto
  };

  try {
    const respuesta = await fetch("https://api.sheetbest.com/sheets/27c68800-32dd-4b49-851f-e972eee0c9df", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (respuesta.ok) {
      document.getElementById('modal-mensaje').textContent = '✅ ¡Formulario enviado correctamente!';
      document.getElementById('modal').style.display = 'block';
      document.getElementById('descargarPDF').style.display = 'inline-block';
    } else {
      throw new Error("Error en el envío");
    }
  } catch (error) {
    document.getElementById('modal-mensaje').textContent = '❌ Ocurrió un error al enviar los datos.';
    document.getElementById('modal').style.display = 'block';
  }
});

document.getElementById('cerrar-modal').addEventListener('click', function () {
  document.getElementById('modal').style.display = 'none';
});

document.getElementById('descargarPDF').addEventListener('click', function () {
  const formularioPDF = document.getElementById('formularioPDF');
  const btnEnviar = document.getElementById('btnEnviar');
  const btnDescargar = document.getElementById('descargarPDF');
  const modal = document.getElementById('modal');

  // Asegurar visibilidad completa
  window.scrollTo(0, 0);
  formularioPDF.style.minHeight = '100vh';

  // Ocultar elementos innecesarios
  btnEnviar.style.display = 'none';
  btnDescargar.style.display = 'none';
  modal.style.display = 'none';

  // Eliminar firmas anteriores si existen
  const firmaAntigua = document.getElementById('firma-autorizacion');
  if (firmaAntigua) firmaAntigua.remove();

// Agregar firma
const ahora = new Date();
const fecha = ahora.toLocaleDateString('es-ES');
const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

const contenedorFirma = document.createElement('div');
contenedorFirma.style.display = 'flex';
contenedorFirma.style.justifyContent = 'space-between';
contenedorFirma.style.marginTop = '30px';
contenedorFirma.style.fontWeight = 'bold';

const firma = document.createElement('p');
firma.textContent = 'Firma del padre/madre o tutor: ____________________________';
firma.style.margin = '0'; // quitar margen para que quede alineado bien

const fechaHora = document.createElement('p');
fechaHora.textContent = `${fecha} ${hora}`;
fechaHora.style.margin = '0';
fechaHora.style.textAlign = 'right';

contenedorFirma.appendChild(firma);
contenedorFirma.appendChild(fechaHora);

formularioPDF.appendChild(contenedorFirma);


  // Generar PDF
  html2canvas(formularioPDF, {
    scale: 2,
    useCORS: true,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('autorizacion_desfile.pdf');

    // Restaurar visibilidad
    btnEnviar.style.display = 'inline-block';
    btnDescargar.style.display = 'none';
    modal.style.display = 'none';
    firma.remove();
    document.getElementById('formulario').reset();
  });
});
