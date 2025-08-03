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

  window.scrollTo(0, 0);
  formularioPDF.style.minHeight = '100vh';

  btnEnviar.style.display = 'none';
  btnDescargar.style.display = 'none';
  modal.style.display = 'none';

  const firmaAntigua = document.getElementById('firma-autorizacion');
  if (firmaAntigua) firmaAntigua.remove();

  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-ES');
  const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

const contenedorFirma = document.createElement('div');
contenedorFirma.id = 'firma-autorizacion';
contenedorFirma.style.display = 'flex';
contenedorFirma.style.flexDirection = 'column';
contenedorFirma.style.alignItems = 'center';  // Centra horizontalmente

contenedorFirma.style.marginTop = '40px';
contenedorFirma.style.fontWeight = 'bold';

// Línea para firmar (centrada)
const lineaFirma = document.createElement('div');
lineaFirma.style.borderBottom = '2px solid black';
lineaFirma.style.width = '60%';
lineaFirma.style.marginBottom = '5px';

// Texto debajo de la línea (centrado)
const textoFirma = document.createElement('p');
textoFirma.textContent = 'Firma del padre/madre o tutor';
textoFirma.style.margin = '0';
textoFirma.style.textAlign = 'center';
textoFirma.style.fontWeight = 'normal';

// Fecha y hora alineada a la izquierda
const fechaHora = document.createElement('p');
fechaHora.textContent = `${fecha} ${hora}`;
fechaHora.style.margin = '15px 0 0 0'; // margen arriba para separar
fechaHora.style.textAlign = 'left';
fechaHora.style.fontWeight = 'normal';
fechaHora.style.alignSelf = 'flex-start'; // importante para alinear a la izquierda dentro del flex column

// Append
contenedorFirma.appendChild(lineaFirma);
contenedorFirma.appendChild(textoFirma);
contenedorFirma.appendChild(fechaHora);

formularioPDF.appendChild(contenedorFirma);


  // Escalar el formulario a un ancho fijo (A4) para evitar corte en móviles
  const originalWidth = formularioPDF.style.width;
  formularioPDF.style.width = '800px';

  html2canvas(formularioPDF, {
    scale: 2,
    useCORS: true
  }).then(canvas => {
    formularioPDF.style.width = originalWidth;

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 10;
    if (imgHeight > pageHeight - 20) {
      const scale = (pageHeight - 20) / imgHeight;
      pdf.addImage(imgData, 'PNG', 10, y, imgWidth * scale, imgHeight * scale);
    } else {
      pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight);
    }

    pdf.save('autorizacion_desfile.pdf');

    btnEnviar.style.display = 'inline-block';
    btnDescargar.style.display = 'none';
    modal.style.display = 'none';
    contenedorFirma.remove();
    document.getElementById('formulario').reset();
  });
});


