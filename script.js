document.getElementById('descargarPDF').addEventListener('click', function () {
  const formularioPDF = document.getElementById('formularioPDF');
  const btnEnviar = document.getElementById('btnEnviar');
  const btnDescargar = document.getElementById('descargarPDF');
  const modal = document.getElementById('modal');

  // Asegurar visibilidad completa y ajustar altura mínima
  window.scrollTo(0, 0);
  formularioPDF.style.minHeight = '100vh';

  // Ocultar botones y modal para la captura
  btnEnviar.style.display = 'none';
  btnDescargar.style.display = 'none';
  modal.style.display = 'none';

  // Eliminar firmas anteriores si existen
  const firmaAntigua = document.getElementById('firma-autorizacion');
  if (firmaAntigua) firmaAntigua.remove();

  // Agregar firma con fecha y hora
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-ES');
  const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const contenedorFirma = document.createElement('div');
  contenedorFirma.style.display = 'flex';
  contenedorFirma.style.justifyContent = 'space-between';
  contenedorFirma.style.marginTop = '30px';
  contenedorFirma.style.fontWeight = 'bold';
  contenedorFirma.id = 'firma-autorizacion';

  const firma = document.createElement('p');
  firma.textContent = 'Firma del padre/madre o tutor: ____________________________';
  firma.style.margin = '0';

  const fechaHora = document.createElement('p');
  fechaHora.textContent = `${fecha} ${hora}`;
  fechaHora.style.margin = '0';
  fechaHora.style.textAlign = 'right';

  contenedorFirma.appendChild(firma);
  contenedorFirma.appendChild(fechaHora);

  formularioPDF.appendChild(contenedorFirma);

  // Generar PDF con escala y ajuste para que quepa en 1 página A4
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
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10; // margen en mm

    let imgWidth = pageWidth - margin * 2;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight - margin * 2) {
      const scale = (pageHeight - margin * 2) / imgHeight;
      imgHeight = imgHeight * scale;
      imgWidth = imgWidth * scale;
    }

    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    pdf.save('autorizacion_desfile.pdf');

    // Restaurar visibilidad y limpiar
    btnEnviar.style.display = 'inline-block';
    btnDescargar.style.display = 'none';
    modal.style.display = 'none';
    contenedorFirma.remove();
    document.getElementById('formulario').reset();
  });
});
