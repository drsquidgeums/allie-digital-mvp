
import { jsPDF } from 'jspdf';

/**
 * Export editor HTML content as a PDF file with formatting preserved
 */
export async function exportAsPdf(html: string, title: string): Promise<void> {
  // Create a temporary container to render the HTML
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '595px'; // A4 width in pixels at 72dpi
  container.style.fontFamily = 'Calibri, Arial, sans-serif';
  container.style.fontSize = '11pt';
  container.style.lineHeight = '1.5';
  container.style.color = '#000000';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const { default: html2canvas } = await import('html2canvas');
    
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Additional pages if content overflows
    while (heightLeft > 0) {
      position = -(pageHeight * (Math.ceil((imgHeight - heightLeft) / pageHeight)));
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    pdf.save(`${cleanTitle}_${timestamp}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
