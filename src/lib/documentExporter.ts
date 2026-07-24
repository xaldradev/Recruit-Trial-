import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

/**
 * Clean markdown symbols for plain text conversion
 */
export function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/###?\s*/g, '')
    .trim();
}

/**
 * 1. Export Content as PDF (.pdf)
 */
export function exportToPDF(filenameTitle: string, documentTitle: string, content: string) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    let cursorY = 20;

    // Header Banner
    doc.setFillColor(30, 16, 70); // Deep Violet
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('AROHI AI • Official Document Export', margin, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 180, 255);
    doc.text(documentTitle, margin, 19);

    doc.setFontSize(8);
    doc.setTextColor(180, 180, 200);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, pageWidth - margin - 35, 19);

    cursorY = 36;

    // Body content lines
    doc.setTextColor(30, 30, 40);
    const lines = content.split('\n');

    lines.forEach((line) => {
      if (cursorY > 275) {
        doc.addPage();
        cursorY = 20;
      }

      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        const headingText = cleanMarkdown(trimmed);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(100, 40, 200);
        doc.text(headingText, margin, cursorY);
        cursorY += 7;
      } else if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
        const bulletText = cleanMarkdown(trimmed);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(40, 40, 50);

        const wrapped = doc.splitTextToSize(`• ${bulletText}`, maxLineWidth);
        wrapped.forEach((wLine: string) => {
          if (cursorY > 275) {
            doc.addPage();
            cursorY = 20;
          }
          doc.text(wLine, margin + 3, cursorY);
          cursorY += 5;
        });
      } else if (trimmed.length > 0) {
        const plainText = cleanMarkdown(trimmed);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(40, 40, 50);

        const wrapped = doc.splitTextToSize(plainText, maxLineWidth);
        wrapped.forEach((wLine: string) => {
          if (cursorY > 275) {
            doc.addPage();
            cursorY = 20;
          }
          doc.text(wLine, margin, cursorY);
          cursorY += 5;
        });
        cursorY += 2;
      } else {
        cursorY += 3;
      }
    });

    // Footer
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(140, 140, 160);
      doc.text(`AROHI AI Document • Page ${i} of ${totalPages}`, margin, 287);
      doc.text(`Verified Document ID: AROHI-${Date.now().toString().slice(-6)}`, pageWidth - margin - 45, 287);
    }

    doc.save(`${filenameTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
  } catch (err) {
    console.error('Failed to export PDF:', err);
    alert('PDF export failed. Please try again.');
  }
}

/**
 * 2. Export Content as Word (.docx)
 */
export async function exportToWord(filenameTitle: string, documentTitle: string, content: string) {
  try {
    const lines = content.split('\n');
    const children: Paragraph[] = [];

    // Title Paragraph
    children.push(
      new Paragraph({
        text: 'AROHI AI • Official Document Export',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: documentTitle,
            bold: true,
            size: 24,
            color: '6B21A8'
          }),
          new TextRun({
            text: `  |  Generated: ${new Date().toLocaleDateString('en-IN')}`,
            size: 18,
            color: '666666'
          })
        ],
        spacing: { after: 240 }
      })
    );

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('#')) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cleanMarkdown(trimmed),
                bold: true,
                size: 22,
                color: '4C1D95'
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          })
        );
      } else if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${cleanMarkdown(trimmed)}`,
                size: 20,
                color: '1E293B'
              })
            ],
            spacing: { after: 80 },
            indent: { left: 360 }
          })
        );
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cleanMarkdown(trimmed),
                size: 20,
                color: '334155'
              })
            ],
            spacing: { after: 120 }
          })
        );
      }
    });

    const docx = new Document({
      sections: [
        {
          properties: {},
          children
        }
      ]
    });

    const blob = await Packer.toBlob(docx);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenameTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export Word document:', err);
    alert('Word document generation failed. Please try again.');
  }
}

/**
 * 3. Export Content as Excel (.xlsx)
 */
export function exportToExcel(filenameTitle: string, documentTitle: string, content: string) {
  try {
    const lines = content.split('\n');
    const tableData: Array<{ Section: string; 'Item Number': string | number; 'Content / Action Plan': string }> = [];

    let currentSection = 'Overview';
    let itemCounter = 1;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('#')) {
        currentSection = cleanMarkdown(trimmed);
        itemCounter = 1;
      } else {
        const cleanText = cleanMarkdown(trimmed);
        tableData.push({
          Section: currentSection,
          'Item Number': itemCounter++,
          'Content / Action Plan': cleanText
        });
      }
    });

    if (tableData.length === 0) {
      tableData.push({
        Section: 'General',
        'Item Number': 1,
        'Content / Action Plan': cleanMarkdown(content)
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(tableData);

    // Auto-width columns
    worksheet['!cols'] = [
      { wch: 30 }, // Section
      { wch: 12 }, // Item Number
      { wch: 70 }  // Content
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AROHI Export');

    XLSX.writeFile(workbook, `${filenameTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.xlsx`);
  } catch (err) {
    console.error('Failed to export Excel spreadsheet:', err);
    alert('Excel generation failed. Please try again.');
  }
}
