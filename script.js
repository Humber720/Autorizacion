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

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calcular escala para que la imagen quepa en la página
    const pdfWidth = pageWidth - 20; // margen 10 mm a cada lado
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

    let scaleFactor = 1;
    if (pdfHeight > pageHeight - 20) {
      scaleFactor = (pageHeight - 20) / pdfHeight;
    }

    const finalWidth = pdfWidth * scaleFactor;
    const finalHeight = pdfHeight * scaleFactor;

    pdf.addImage(imgData, 'PNG', 10, 10, finalWidth, finalHeight);
    pdf.save('autorizacion_desfile.pdf');

    btnEnviar.style.display = 'inline-block';
    btnDescargar.style.display = 'none';
    modal.style.display = 'none';
    contenedorFirma.remove();
    document.getElementById('formulario').reset();
  });
});
