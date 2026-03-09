import React, { useState } from 'react';
import { MandateData, Beneficiary } from '../types';
import { formatDate } from '../utils/dateUtils';
import { MANDATE_TEMPLATE, SURVIVORSHIP_MANDATE_TEMPLATE, POWER_LABELS, BACKGROUND_LABELS, SURVIVORSHIP_BACKGROUND_LABELS, SURVIVORSHIP_POWER_LABELS } from '../constants';
import { FileText, Download, FileCode, FileSignature, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, Header, Footer, PageNumber, NumberFormat, BorderStyle, WidthType, VerticalAlign, ShadingType } from 'docx';
import { saveAs } from 'file-saver';
import { generateContract } from '../services/contractService';
import { exportToDocx as exportContractToDocx } from '../utils/docxExport';

interface Props {
  data: MandateData;
}

export default function MandatePreview({ data }: Props) {
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);

  const getPensionTitle = () => {
    const titles: Record<string, string> = {
      'VEJEZ': 'VEJEZ',
      'INVALIDEZ': 'INVALIDEZ',
      'SOBREVIVENCIA': 'SOBREVIVENCIA'
    };
    return titles[data.pensionType];
  };

  const getVejezDetail = () => {
    if (data.pensionType !== 'VEJEZ') return '';
    return data.vejezType === 'EDAD' ? ' por Edad' : ' Anticipada';
  };

  const isAdult = (birthDate?: string): boolean => {
    if (!birthDate) return true;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return true;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const getBeneficiaryObservations = (b: Beneficiary) => {
    const obs = [];
    if (b.relationship === 'Cónyuge') {
      if (b.marriageDate) obs.push(`Fecha matrimonio: ${formatDate(b.marriageDate)}`);
      if (b.circumscription) obs.push(`Circunscripción: ${b.circumscription}`);
    } else if (b.relationship === 'Conviviente Civil') {
      if (b.agreementDate) obs.push(`Fecha Acuerdo: ${formatDate(b.agreementDate)}`);
      if (b.circumscription) obs.push(`Circunscripción: ${b.circumscription}`);
    }
    return obs.join(', ');
  };

  const generatePreviewText = () => {
    const advisorName = data.mandatory.fullName || "";
    const isKarin = advisorName.toLowerCase().includes('karin') && advisorName.toLowerCase().includes('orostica');
    const fixedRegNumber = isKarin ? "1159" : "1360";
    const mandatoryRegSection = `, Registro de Asesores Previsionales N° **${fixedRegNumber}** de la Superintendencia de Pensiones`;

    if (data.pensionType === 'SOBREVIVENCIA') {
      return SURVIVORSHIP_MANDATE_TEMPLATE
        .replace('{date}', `**${formatDate(data.date) || '[Fecha]'}**`)
        .replace(/{causanteName}/g, `**${data.affiliate?.fullName || '[Nombre Causante]'}**`)
        .replace(/{causanteRut}/g, `**${data.affiliate?.rut || '[RUT Causante]'}**`)
        .replace('{mandatoryName}', `**${data.mandatory.fullName || '[Nombre Mandatario]'}**`)
        .replace('{mandatoryRut}', `**${data.mandatory.rut || '[RUT Mandatario]'}**`)
        .replace('{mandatoryAddress}', `**${data.mandatory.address || '[Dirección]'}**`)
        .replace('{mandatoryCommune}', `**${data.mandatory.commune || '[Comuna]'}**`)
        .replace('{mandatoryCity}', `**${data.mandatory.city || '[Ciudad]'}**`)
        .replace('{mandatoryPhone}', `**${data.mandatory.phone || '[Teléfono]'}**`)
        .replace('{mandatoryEmail}', `**${data.mandatory.email || '[Email]'}**`)
        .replace('{mandatoryRegSection}', mandatoryRegSection)
        .replace('{causanteAfp}', `**${data.affiliate?.afp || '[AFP]'}**`)
        .replace('{beneficiariesTable}', '[Ver tabla de beneficiarios en PDF]')
        .replace('{beneficiariesExtraTable}', '[Ver tabla de antecedentes adicionales en PDF]')
        .replace('{backgroundList}', '[Ver tabla de antecedentes en PDF]')
        .replace('{powersList}', '[Ver tabla de autorizaciones en PDF]');
    }

    const employerSection = `Asimismo, expongo que a la fecha, los datos de mi empleador son los siguientes:\nNombre : **${data.employer.name || '[Nombre Empleador]'}**\nRUT : **${data.employer.rut || '[RUT Empleador]'}**\nDirección : **${data.employer.address || '[Dirección Empleador]'}**\nTeléfono : **${data.employer.phone || '[Teléfono Empleador]'}**`;

    return `MANDATO PARA TRÁMITES DE PENSIÓN DE ${getPensionTitle()}\n\n` + MANDATE_TEMPLATE
      .replace(/{pensionTitle}/g, `**${getPensionTitle()}**`)
      .replace('{date}', `**${formatDate(data.date) || '[Fecha]'}**`)
      .replace('{mandatorName}', `**${data.mandator.fullName || '[Nombre Mandante]'}**`)
      .replace(/{mandatorRut}/g, `**${data.mandator.rut || '[RUT Mandante]'}**`)
      .replace('{mandatorNationality}', `**${data.mandator.nationality || '[Nacionalidad]'}**`)
      .replace('{mandatorSex}', `**${data.mandator.sex || '[Sexo]'}**`)
      .replace('{mandatorBirthDate}', `**${formatDate(data.mandator.birthDate) || '[Fecha Nacimiento]'}**`)
      .replace('{mandatorCivilStatus}', `**${data.mandator.civilStatus || '[Estado Civil]'}**`)
      .replace('{mandatorProfession}', `**${data.mandator.profession || '[Profesión]'}**`)
      .replace('{mandatorAddress}', `**${data.mandator.address || '[Dirección]'}**`)
      .replace('{mandatorCommune}', `**${data.mandator.commune || '[Comuna]'}**`)
      .replace('{mandatorCity}', `**${data.mandator.city || '[Ciudad]'}**`)
      .replace('{mandatorPhone}', `**${data.mandator.phone || '[Teléfono]'}**`)
      .replace('{mandatorEmail}', `**${data.mandator.email || '[Email]'}**`)
      .replace('{mandatorHealth}', `**${data.mandator.healthInstitution || '[Institución Salud]'}**`)
      .replace('{mandatoryName}', `**${data.mandatory.fullName || '[Nombre Mandatario]'}**`)
      .replace('{mandatoryRut}', `**${data.mandatory.rut || '[RUT Mandatario]'}**`)
      .replace('{mandatoryNationality}', `**${data.mandatory.nationality || '[Nacionalidad]'}**`)
      .replace('{mandatoryAddress}', `**${data.mandatory.address || '[Dirección]'}**`)
      .replace('{mandatoryCommune}', `**${data.mandatory.commune || '[Comuna]'}**`)
      .replace('{mandatoryCity}', `**${data.mandatory.city || '[Ciudad]'}**`)
      .replace('{mandatoryPhone}', `**${data.mandatory.phone || '[Teléfono]'}**`)
      .replace('{mandatoryEmail}', `**${data.mandatory.email || '[Email]'}**`)
      .replace('{mandatoryRegSection}', mandatoryRegSection)
      .replace('{mandatorAfp}', `**${data.mandator.afp || '[AFP]'}**`)
      .replace('Asimismo, expongo que a la fecha, los datos de mi empleador son los siguientes:', employerSection)
      .replace('\tNombre : {employerName}', '')
      .replace('\tRUT : {employerRut}', '')
      .replace('\tDirección : {employerAddress}', '')
      .replace('\tTeléfono : {employerPhone}', '')
      .replace('{vejezDetail}', getVejezDetail())
      .replace('{beneficiariesSection}', (data.beneficiaries.length > 0 ? `Para efectos de la suscripción de la pensión antes mencionada, declaro conocer que tienen la calidad de beneficiarios de pensión de sobrevivencia: el cónyuge, los hijos, la madre o padre de hijos de filiación no matrimonial y, a falta de todos los anteriores, los padres. En consecuencia, efectúo la siguiente declaración de beneficiarios:\n[Ver tabla en PDF]\n\n` : '') + `Por otra parte, señalo los siguientes antecedentes que el mandatario deberá considerar para suscribir en mi nombre solicitud de pensión de ${getPensionTitle()}${getVejezDetail()}.`)
      .replace('{invaliditySection}', data.pensionType === 'INVALIDEZ' ? 'Además el presente mandato se extiende para la COMISIÓN MÉDICA DE INVALIDEZ, (Regional y Central)., está facultado para solicitar información respecto del trámite de calificación de invalidez, consultar el acta del trámite, aportar información respecto del trámite, retirar Resolución y Dictamen de invalidez.' : '')
      .replace('{backgroundList}', 'ANTECEDENTES:\n[Ver tabla en PDF]')
      .replace('{powersList}', 'AUTORIZACIONES:\n[Ver tabla en PDF]')
      .replace('confiero poder a', `confiero poder a`);
  };

  const downloadPDF = () => {
    const addPageNumbers = (pdf: jsPDF) => {
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(`Pag. ${i} de ${pageCount}`, pdf.internal.pageSize.getWidth() - 20, 10, { align: 'right' });
      }
    };

    const drawWrappedText = (pdf: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const lines = pdf.splitTextToSize(text.replace(/\*\*/g, ''), maxWidth);
      const originalLines = text.split('\n');
      let currentY = y;
      
      // Since splitTextToSize doesn't preserve our ** markers correctly for multi-line, 
      // we'll use a simpler approach for these specific templates which are mostly paragraphs.
      const paragraphs = text.split('\n');
      paragraphs.forEach(para => {
        const words = para.split(' ');
        let currentLine = '';
        words.forEach(word => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const testLineWidth = pdf.getTextWidth(testLine.replace(/\*\*/g, ''));
          if (testLineWidth > maxWidth) {
            drawInlineBold(pdf, currentLine, x, currentY);
            currentLine = word;
            currentY += lineHeight;
          } else {
            currentLine = testLine;
          }
        });
        drawInlineBold(pdf, currentLine, x, currentY);
        currentY += lineHeight;
      });
      return currentY;
    };

    const drawInlineBold = (pdf: jsPDF, line: string, x: number, y: number) => {
      const parts = line.split('**');
      let currentX = x;
      parts.forEach((part, index) => {
        pdf.setFont('helvetica', index % 2 === 1 ? 'bold' : 'normal');
        pdf.text(part, currentX, y);
        currentX += pdf.getTextWidth(part);
      });
    };

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });
    const margin = 20;
    let currentY = 20;

    // Center Bold Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const title = `MANDATO PARA TRÁMITES DE PENSIÓN DE ${getPensionTitle()}`;
    doc.text(title, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 10;

    if (data.pensionType === 'VEJEZ') {
      doc.text(`PENSIÓN DE VEJEZ ${getVejezDetail().toUpperCase()}`, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
      currentY += 10;
    }

    // Main Body
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const advisorName = data.mandatory.fullName || "";
    const isKarin = advisorName.toLowerCase().includes('karin') && advisorName.toLowerCase().includes('orostica');
    const mandatoryLabel = isKarin ? 'ASESOR PREVISIONAL' : 'MANDATARIO';
    const fixedRegNumber = isKarin ? "1159" : "1360";
    const mandatoryRegSection = `, Registro de Asesores Previsionales N° **${fixedRegNumber}** de la Superintendencia de Pensiones`;

    if (data.pensionType === 'SOBREVIVENCIA') {
      // Survivorship specific PDF generation
      const introText = SURVIVORSHIP_MANDATE_TEMPLATE.split('{beneficiariesTable}')[0]
        .replace('{date}', `**${formatDate(data.date) || '[Fecha]'}**`)
        .replace(/{causanteName}/g, `**${data.affiliate?.fullName || '[Nombre Causante]'}**`)
        .replace(/{causanteRut}/g, `**${data.affiliate?.rut || '[RUT Causante]'}**`)
        .replace('{mandatoryName}', `**${data.mandatory.fullName || '[Nombre Mandatario]'}**`)
        .replace('{mandatoryRut}', `**${data.mandatory.rut || '[RUT Mandatario]'}**`)
        .replace('{mandatoryAddress}', `**${data.mandatory.address || '[Dirección]'}**`)
        .replace('{mandatoryCommune}', `**${data.mandatory.commune || '[Comuna]'}**`)
        .replace('{mandatoryCity}', `**${data.mandatory.city || '[Ciudad]'}**`)
        .replace('{mandatoryPhone}', `**${data.mandatory.phone || '[Teléfono]'}**`)
        .replace('{mandatoryEmail}', `**${data.mandatory.email || '[Email]'}**`)
        .replace('{mandatoryRegSection}', mandatoryRegSection)
        .replace('{causanteAfp}', `**${data.affiliate?.afp || '[AFP]'}**`);

      currentY = drawWrappedText(doc, introText.trim(), margin, currentY, 170, 5);
      currentY += 3;

      // Table 1: Beneficiaries Basic Info
      autoTable(doc, {
        startY: currentY,
        head: [['Nombre', 'Rut', 'F. Nac.', 'Parentesco', 'Sexo', 'Inv', 'Observaciones']],
        body: data.beneficiaries.map(b => [b.fullName, b.rut, formatDate(b.birthDate) || '', b.relationship, b.sex || '', b.isInvalid ? 'SI' : 'NO', getBeneficiaryObservations(b)]),
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 0 },
        bodyStyles: { fontStyle: 'bold' },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
        margin: { left: margin, right: margin }
      });
      currentY = (doc as any).lastAutoTable.finalY + 5;

      doc.setFont('helvetica', 'bold');
      doc.text('Otros antecedentes de los beneficiarios de pensión:', margin, currentY);
      currentY += 4;

      // Table 2: Beneficiaries Extra Info
      autoTable(doc, {
        startY: currentY,
        head: [['Apellido paterno, materno, nombres', 'Relacion de Parentesco', 'Direccion', 'Telefono', 'Correo electronico', 'Observaciones']],
        body: data.beneficiaries.map(b => [b.fullName, b.relationship, `${b.address}, ${b.commune}`, b.phone, b.email, getBeneficiaryObservations(b)]),
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 0 },
        bodyStyles: { fontStyle: 'bold' },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
        margin: { left: margin, right: margin }
      });
      currentY = (doc as any).lastAutoTable.finalY + 5;

      doc.setFont('helvetica', 'normal');
      const midText = "Por otra parte, señalamos los siguientes antecedentes que el mandatario deberá considerar para suscribir en nuestro nombre la solicitud de pensión de Sobrevivencia.";
      const splitMidText = doc.splitTextToSize(midText, 170);
      doc.text(splitMidText, margin, currentY, { align: 'justify', maxWidth: 170 });
      currentY += (splitMidText.length * 5) + 3;

      // Background Table
      const backgroundLabels = SURVIVORSHIP_BACKGROUND_LABELS;
      const backgroundBody: any[] = [];
      Object.entries(backgroundLabels).forEach(([key, label]) => {
        if (key.endsWith('_header')) {
          backgroundBody.push([{ content: label, colSpan: 3, styles: { fillColor: [245, 247, 250], fontStyle: 'bold', fontSize: 8 } }]);
        } else {
          let displayLabel = label;
          if ((data.background as any)[key]) {
            if (['apvFinancing', 'apvcFinancing', 'agreedDeposits'].includes(key)) {
              const inst = (data.background as any)[`${key}Institution`];
              if (inst) displayLabel += ` (${inst})`;
            } else if (['foreignContributions', 'foreignResidence'].includes(key)) {
              const country = (data.background as any)[`${key}Country`];
              if (country) displayLabel += ` (${country})`;
            }
          }
          backgroundBody.push([displayLabel, (data.background as any)[key] ? 'X' : '', !(data.background as any)[key] ? 'X' : '']);
        }
      });

      autoTable(doc, {
        startY: currentY,
        head: [['ANTECEDENTES:', 'Si', 'No']],
        body: backgroundBody,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 0 },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
        columnStyles: { 
          0: { cellWidth: 140 }, 
          1: { halign: 'center', cellWidth: 15, fontStyle: 'bold' }, 
          2: { halign: 'center', cellWidth: 15, fontStyle: 'bold' } 
        },
        margin: { left: margin, right: margin }
      });
      currentY = (doc as any).lastAutoTable.finalY + 5;

      doc.setFont('helvetica', 'normal');
      doc.text('Asimismo, autorizamos al mandatario para:', margin, currentY);
      currentY += 4;

      // Powers Table
      autoTable(doc, {
        startY: currentY,
        head: [['AUTORIZACIONES:', 'Si', 'No']],
        body: Object.entries(SURVIVORSHIP_POWER_LABELS).map(([key, label]) => [
          label,
          (data.powers as any)[key] ? 'X' : '',
          !(data.powers as any)[key] ? 'X' : ''
        ]),
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 0 },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
        columnStyles: { 
          0: { cellWidth: 140 }, 
          1: { halign: 'center', cellWidth: 15, fontStyle: 'bold' }, 
          2: { halign: 'center', cellWidth: 15, fontStyle: 'bold' } 
        },
        margin: { left: margin, right: margin }
      });
      currentY = (doc as any).lastAutoTable.finalY + 5;

      // Closing Text
      const closingText1 = "El presente mandato faculta para solicitar liquidaciones de pensión y gestionar calificación de calidad de beneficiarios de pensión de sobrevivencia.";
      const closingText2 = "Otorgamos el presente mandato para los únicos fines antes señalados y se entiende revocado por otro de fecha posterior o por término de la gestión encomendada.";
      
      doc.setFont('helvetica', 'bold');
      const splitClosing1 = doc.splitTextToSize(closingText1, 170);
      doc.text(splitClosing1, margin, currentY, { align: 'left', maxWidth: 170 });
      currentY += (splitClosing1.length * 5) + 4;
      
      doc.setFont('helvetica', 'normal');
      const splitClosing2 = doc.splitTextToSize(closingText2, 170);
      doc.text(splitClosing2, margin, currentY, { align: 'justify', maxWidth: 170 });
      currentY += (splitClosing2.length * 5) + 15;

      // Signatures
      if (currentY > 220) { doc.addPage(); currentY = 40; }
      
      const adults = data.beneficiaries.filter(b => isAdult(b.birthDate));
      const minors = data.beneficiaries.filter(b => !isAdult(b.birthDate));

      const signatureRows: any[] = [];
      
      const maxSigRows = Math.max(adults.length, 1);
      for (let i = 0; i < maxSigRows; i++) {
        const adult = adults[i];
        const leftCol = adult ? [
          '__________________________',
          'MANDANTE(S)',
          adult.fullName,
          `RUT: ${adult.rut}`
        ].join('\n') : '';
        
        const rightCol = i === 0 ? [
          '__________________________',
          'MANDATARIO',
          data.mandatory.fullName,
          `RUT: ${data.mandatory.rut}`
        ].join('\n') : '';
        
        signatureRows.push([
          { content: leftCol, styles: { halign: 'center', cellPadding: 0 } },
          { content: rightCol, styles: { halign: 'center', cellPadding: 0 } }
        ]);
      }

      autoTable(doc, {
        startY: currentY,
        body: signatureRows,
        theme: 'plain',
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin },
        columnStyles: { 0: { cellWidth: 85 }, 1: { cellWidth: 85 } }
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;

      // Note for minors
      if (minors.length > 0) {
        if (currentY > 270) { doc.addPage(); currentY = 20; }
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        const minorNames = minors.map(m => `${m.fullName} (RUT: ${m.rut})`).join(', ');
        const minorNote = `Se deja constancia que El consultante firma por poder, en nombre de los beneficiarios menores de edad (${minorNames}), por ser estos menores de edad.`;
        const splitMinorNote = doc.splitTextToSize(minorNote, 170);
        doc.text(splitMinorNote, margin, currentY, { align: 'justify', maxWidth: 170 });
      }

      addPageNumbers(doc);
      doc.save(`Mandato_SOBREVIVENCIA_${data.affiliate?.fullName.replace(/\s+/g, '_') || 'Previsional'}.pdf`);
      return;
    }

    // Standard Mandate PDF Generation (Vejez/Invalidez)
    const introText = MANDATE_TEMPLATE.split('Asimismo, expongo que a la fecha')[0]
      .replace(/{pensionTitle}/g, `**${getPensionTitle()}**`)
      .replace('{date}', `**${formatDate(data.date) || '[Fecha]'}**`)
      .replace('{mandatorName}', `**${data.mandator.fullName || '[Nombre Mandante]'}**`)
      .replace(/{mandatorRut}/g, `**${data.mandator.rut || '[RUT Mandante]'}**`)
      .replace('{mandatorNationality}', `**${data.mandator.nationality || '[Nacionalidad]'}**`)
      .replace('{mandatorSex}', `**${data.mandator.sex || '[Sexo]'}**`)
      .replace('{mandatorBirthDate}', `**${formatDate(data.mandator.birthDate) || '[Fecha Nacimiento]'}**`)
      .replace('{mandatorCivilStatus}', `**${data.mandator.civilStatus || '[Estado Civil]'}**`)
      .replace('{mandatorProfession}', `**${data.mandator.profession || '[Profesión]'}**`)
      .replace('{mandatorAddress}', `**${data.mandator.address || '[Dirección]'}**`)
      .replace('{mandatorCommune}', `**${data.mandator.commune || '[Comuna]'}**`)
      .replace('{mandatorCity}', `**${data.mandator.city || '[Ciudad]'}**`)
      .replace('{mandatorPhone}', `**${data.mandator.phone || '[Teléfono]'}**`)
      .replace('{mandatorEmail}', `**${data.mandator.email || '[Email]'}**`)
      .replace('{mandatorHealth}', `**${data.mandator.healthInstitution || '[Institución Salud]'}**`)
      .replace('{mandatoryName}', `**${data.mandatory.fullName || '[Nombre Mandatario]'}**`)
      .replace('{mandatoryRut}', `**${data.mandatory.rut || '[RUT Mandatario]'}**`)
      .replace('{mandatoryNationality}', `**${data.mandatory.nationality || '[Nacionalidad]'}**`)
      .replace('{mandatoryAddress}', `**${data.mandatory.address || '[Dirección]'}**`)
      .replace('{mandatoryCommune}', `**${data.mandatory.commune || '[Comuna]'}**`)
      .replace('{mandatoryCity}', `**${data.mandatory.city || '[Ciudad]'}**`)
      .replace('{mandatoryPhone}', `**${data.mandatory.phone || '[Teléfono]'}**`)
      .replace('{mandatoryEmail}', `**${data.mandatory.email || '[Email]'}**`)
      .replace('{mandatoryRegSection}', mandatoryRegSection)
      .replace('{mandatorAfp}', `**${data.mandator.afp || '[AFP]'}**`)
      .replace('{vejezDetail}', `**${getVejezDetail()}**`);

    // 1. Draw Intro Text (Justified)
    currentY = drawWrappedText(doc, introText.trim(), margin, currentY, 170, 5);
    currentY += 2;

    // 2. Draw Employer Section (Indented, not justified)
    doc.setFont('helvetica', 'normal');
    doc.text('Asimismo, expongo que a la fecha, los datos de mi empleador son los siguientes:', margin, currentY);
    currentY += 4;
    
    const indent = 15; // Indentation for employer data
    doc.setFont('helvetica', 'normal');
    doc.text('Nombre      : ', margin + indent, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.employer.name || ''}`, margin + indent + doc.getTextWidth('Nombre      : '), currentY);
    currentY += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.text('RUT         : ', margin + indent, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.employer.rut || ''}`, margin + indent + doc.getTextWidth('RUT         : '), currentY);
    currentY += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Dirección   : ', margin + indent, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.employer.address || ''}`, margin + indent + doc.getTextWidth('Dirección   : '), currentY);
    currentY += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Teléfono    : ', margin + indent, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.employer.phone || ''}`, margin + indent + doc.getTextWidth('Teléfono    : '), currentY);
    currentY += 8;

    // Beneficiaries Table
    if (data.beneficiaries.length > 0) {
      doc.setFont('helvetica', 'normal');
      const introBeneficiaries = "Para efectos de la suscripción de la pensión antes mencionada, declaro conocer que tienen la calidad de beneficiarios de pensión de sobrevivencia: el cónyuge, los hijos, la madre o padre de hijos de filiación no matrimonial y, a falta de todos los anteriores, los padres. En consecuencia, efectúo la siguiente declaración de beneficiarios:";
      const splitIntroBen = doc.splitTextToSize(introBeneficiaries, 170);
      doc.text(splitIntroBen, margin, currentY, { align: 'justify', maxWidth: 170 });
      currentY += (splitIntroBen.length * 5) + 3;

      autoTable(doc, {
        startY: currentY,
        head: [['Nombre', 'Rut', 'F. Nac.', 'Parentesco', 'Sexo', 'Inv', 'Observaciones']],
        body: data.beneficiaries.map(b => [b.fullName, b.rut, formatDate(b.birthDate) || '', b.relationship, b.sex || '', b.isInvalid ? 'SI' : 'NO', getBeneficiaryObservations(b)]),
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 0 },
        bodyStyles: { fontStyle: 'bold' },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
        margin: { left: margin, right: margin }
      });
      currentY = (doc as any).lastAutoTable.finalY + 5;
    }

    // Text after beneficiaries (or before antecedentes)
    doc.setFont('helvetica', 'normal');
    const afterBeneficiariesText = `Por otra parte, señalo los siguientes antecedentes que el mandatario deberá considerar para suscribir en mi nombre solicitud de pensión de ${getPensionTitle()}${getVejezDetail()}.`;
    const splitAfterBen = doc.splitTextToSize(afterBeneficiariesText, 170);
    doc.text(splitAfterBen, margin, currentY, { align: 'justify', maxWidth: 170 });
    currentY += (splitAfterBen.length * 5) + 5;

    // Background Table
    const backgroundLabels = BACKGROUND_LABELS;
    const backgroundBody: any[] = [];

    Object.entries(backgroundLabels).forEach(([key, label]) => {
      backgroundBody.push([
        label,
        (data.background as any)[key] ? 'X' : '',
        !(data.background as any)[key] ? 'X' : ''
      ]);
    });

    autoTable(doc, {
      startY: currentY,
      head: [['ANTECEDENTES:', 'Si', 'No']],
      body: backgroundBody,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
      columnStyles: { 
        0: { cellWidth: 140 }, 
        1: { halign: 'center', cellWidth: 15, fontStyle: 'bold' }, 
        2: { halign: 'center', cellWidth: 15, fontStyle: 'bold' } 
      },
      margin: { left: margin, right: margin }
    });
    currentY = (doc as any).lastAutoTable.finalY + 5;

    // Labor Situation Table
    const situationMap: Record<string, string> = {
      'DEPENDENT': 'Trabajador dependiente',
      'UNEMPLOYED': 'Desempleado (< 12 meses)',
      'INDEPENDENT': 'Trabajador independiente',
      'VOLUNTARY': 'Afiliado voluntario'
    };

    autoTable(doc, {
      startY: currentY,
      head: [['Me encuentro en la siguiente situación', 'Si', 'No']],
      body: Object.entries(situationMap).map(([key, label]) => [
        label,
        data.background.laborSituation === key ? 'X' : '',
        data.background.laborSituation !== key ? 'X' : ''
      ]),
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
      columnStyles: { 
        0: { cellWidth: 140 }, 
        1: { halign: 'center', cellWidth: 15, fontStyle: 'bold' }, 
        2: { halign: 'center', cellWidth: 15, fontStyle: 'bold' } 
      },
      margin: { left: margin, right: margin }
    });
    currentY = (doc as any).lastAutoTable.finalY + 5;

    // Powers Table
    const powerLabels = POWER_LABELS;
    autoTable(doc, {
      startY: currentY,
      head: [['AUTORIZACIONES:', 'Si', 'No']],
      body: Object.entries(powerLabels).map(([key, label]) => [
        label,
        (data.powers as any)[key] ? 'X' : '',
        !(data.powers as any)[key] ? 'X' : ''
      ]),
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
      columnStyles: { 
        0: { cellWidth: 140 }, 
        1: { halign: 'center', cellWidth: 15, fontStyle: 'bold' }, 
        2: { halign: 'center', cellWidth: 15, fontStyle: 'bold' } 
      },
      margin: { left: margin, right: margin }
    });
    currentY = (doc as any).lastAutoTable.finalY + 5;

    // Footer Text - Left Aligned (Not justified)
    const invalidityText = data.pensionType === 'INVALIDEZ' 
      ? 'Además el presente mandato se extiende para la COMISIÓN MÉDICA DE INVALIDEZ, (Regional y Central)., está facultado para solicitar información respecto del trámite de calificación de invalidez, consultar el acta del trámite, aportar información respecto del trámite, retirar Resolución y Dictamen de invalidez.' 
      : '';

    const footerTextRaw = MANDATE_TEMPLATE.split('{powersList}')[1];
    // Strip the signature part from the template text
    const footerText = footerTextRaw
      .replace('{invaliditySection}', invalidityText)
      .split('{mandatorName}')[0]
      .trim();

    const footerParagraphs = footerText.split('\n').map(p => p.trim()).filter(p => p !== '');
    doc.setFont('helvetica', 'normal');
    footerParagraphs.forEach(p => {
      const splitP = doc.splitTextToSize(p, 170);
      doc.text(splitP, margin, currentY, { align: 'left', maxWidth: 170 });
      currentY += (splitP.length * 5) + 4;
    });
    currentY += 15; // Extra space for signatures

    // Signatures - Centered and formal using a borderless table
    // Check if we need a new page for signatures
    if (currentY > 240) {
      doc.addPage();
      currentY = 40;
    }

    autoTable(doc, {
      startY: currentY,
      body: [
        ['__________________________', '__________________________'],
        ['MANDANTE', mandatoryLabel],
        [data.mandator.fullName || '[Nombre Mandante]', data.mandatory.fullName || '[Nombre Mandatario]'],
        [`RUT: ${data.mandator.rut || '[RUT]'}`, `RUT: ${data.mandatory.rut || '[RUT]'}`]
      ],
      theme: 'plain',
      styles: { 
        fontSize: 9, 
        fontStyle: 'bold', 
        halign: 'center',
        cellPadding: 0,
        overflow: 'linebreak'
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 85 },
        1: { cellWidth: 85 }
      }
    });

    addPageNumbers(doc);
    doc.save(`Mandato_${getPensionTitle()}_${data.mandator.fullName.replace(/\s+/g, '_') || 'Previsional'}.pdf`);
  };

  const downloadDocx = async () => {
    const PAGE_WIDTH_DXA = 11906; // A4 width
    const MARGIN_DXA = 1134; // 20mm
    const CONTENT_WIDTH_DXA = PAGE_WIDTH_DXA - (MARGIN_DXA * 2);

    const title = `MANDATO PARA TRÁMITES DE PENSIÓN DE ${getPensionTitle()}`;
    const sections: any[] = [];

    // Helper for bolding text in paragraphs
    const createRichParagraph = (text: string, alignment: any = AlignmentType.JUSTIFIED) => {
      const parts = text.split('**');
      return new Paragraph({
        alignment,
        spacing: { after: 200 },
        children: parts.map((part, index) => new TextRun({
          text: part,
          bold: index % 2 === 1,
          size: 20, // 10pt
          font: 'Arial'
        }))
      });
    };

    const createTable = (headers: string[], rows: string[][], colPercentages?: number[], isBeneficiary: boolean = false) => {
      const colCount = headers.length;
      let colWidths: number[] = [];
      
      const isTransparent = isBeneficiary;
      const fontSize = isBeneficiary ? 18 : 16;
      const isBold = true;
      
      if (colPercentages) {
        let currentSum = 0;
        for (let i = 0; i < colCount - 1; i++) {
          const width = Math.floor((colPercentages[i] / 100) * CONTENT_WIDTH_DXA);
          colWidths.push(width);
          currentSum += width;
        }
        colWidths.push(CONTENT_WIDTH_DXA - currentSum);
      } else {
        const equalWidth = Math.floor(CONTENT_WIDTH_DXA / colCount);
        for (let i = 0; i < colCount - 1; i++) {
          colWidths.push(equalWidth);
        }
        colWidths.push(CONTENT_WIDTH_DXA - (equalWidth * (colCount - 1)));
      }

      return new Table({
        width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
        columnWidths: colWidths,
        rows: [
          new TableRow({
            tableHeader: true,
            children: headers.map((h, i) => new TableCell({
              shading: isTransparent ? undefined : { fill: 'F0F0F0', type: ShadingType.CLEAR },
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              width: { size: colWidths[i], type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun({ text: h, bold: isBold, size: fontSize })], alignment: isTransparent ? AlignmentType.LEFT : AlignmentType.CENTER })],
              borders: isTransparent ? {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              } : undefined
            }))
          }),
          ...rows.map(row => new TableRow({
            children: row.map((cell, idx) => new TableCell({
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              width: { size: colWidths[idx], type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun({ text: cell, bold: isBold, size: fontSize })], alignment: (idx > 0 && headers.length === 3 && !isTransparent) ? AlignmentType.CENTER : AlignmentType.LEFT })],
              borders: isTransparent ? {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              } : undefined
            }))
          }))
        ]
      });
    };

    const docChildren: any[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: title, bold: true, size: 28, font: 'Arial' })]
      })
    ];

    if (data.pensionType === 'VEJEZ') {
      docChildren.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: `PENSIÓN DE VEJEZ ${getVejezDetail().toUpperCase()}`, bold: true, size: 24, font: 'Arial' })]
      }));
    }

    const advisorName = data.mandatory.fullName || "";
    const isKarin = advisorName.toLowerCase().includes('karin') && advisorName.toLowerCase().includes('orostica');
    const mandatoryLabel = isKarin ? 'ASESOR PREVISIONAL' : 'MANDATARIO';
    const fixedRegNumber = isKarin ? "1159" : "1360";
    const mandatoryRegSection = `, Registro de Asesores Previsionales N° **${fixedRegNumber}** de la Superintendencia de Pensiones`;

    if (data.pensionType === 'SOBREVIVENCIA') {
      const introText = SURVIVORSHIP_MANDATE_TEMPLATE.split('{beneficiariesTable}')[0]
        .replace('{date}', `**${formatDate(data.date) || '[Fecha]'}**`)
        .replace(/{causanteName}/g, `**${data.affiliate?.fullName || '[Nombre Causante]'}**`)
        .replace(/{causanteRut}/g, `**${data.affiliate?.rut || '[RUT Causante]'}**`)
        .replace('{mandatoryName}', `**${data.mandatory.fullName || '[Nombre Mandatario]'}**`)
        .replace('{mandatoryRut}', `**${data.mandatory.rut || '[RUT Mandatario]'}**`)
        .replace('{mandatoryAddress}', `**${data.mandatory.address || '[Dirección]'}**`)
        .replace('{mandatoryCommune}', `**${data.mandatory.commune || '[Comuna]'}**`)
        .replace('{mandatoryCity}', `**${data.mandatory.city || '[Ciudad]'}**`)
        .replace('{mandatoryPhone}', `**${data.mandatory.phone || '[Teléfono]'}**`)
        .replace('{mandatoryEmail}', `**${data.mandatory.email || '[Email]'}**`)
        .replace('{mandatoryRegSection}', mandatoryRegSection)
        .replace('{causanteAfp}', `**${data.affiliate?.afp || '[AFP]'}**`);

      docChildren.push(createRichParagraph(introText.trim()));

      docChildren.push(createTable(
        ['Nombre', 'Rut', 'F. Nac.', 'Parentesco', 'Sexo', 'Inv', 'Observaciones'],
        data.beneficiaries.map(b => [b.fullName, b.rut, formatDate(b.birthDate) || '', b.relationship, b.sex || '', b.isInvalid ? 'SI' : 'NO', getBeneficiaryObservations(b)]),
        [30, 12, 12, 15, 10, 8, 13],
        true
      ));

      docChildren.push(new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'Otros antecedentes de los beneficiarios de pensión:', bold: true, size: 20 })] }));

      docChildren.push(createTable(
        ['Apellido paterno, materno, nombres', 'Relacion de Parentesco', 'Direccion', 'Telefono', 'Correo electronico', 'Observaciones'],
        data.beneficiaries.map(b => [b.fullName, b.relationship, `${b.address}, ${b.commune}`, b.phone, b.email, getBeneficiaryObservations(b)]),
        [20, 15, 25, 12, 13, 15],
        true
      ));

      docChildren.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Por otra parte, señalamos los siguientes antecedentes que el mandatario deberá considerar para suscribir en nuestro nombre la solicitud de pensión de Sobrevivencia.", size: 20 })] }));

      const backgroundLabels = SURVIVORSHIP_BACKGROUND_LABELS;
      const backgroundRows: string[][] = [];
      Object.entries(backgroundLabels).forEach(([key, label]) => {
        if (!key.endsWith('_header')) {
          let displayLabel = label;
          if ((data.background as any)[key]) {
            if (['apvFinancing', 'apvcFinancing', 'agreedDeposits'].includes(key)) {
              const inst = (data.background as any)[`${key}Institution`];
              if (inst) displayLabel += ` (${inst})`;
            } else if (['foreignContributions', 'foreignResidence'].includes(key)) {
              const country = (data.background as any)[`${key}Country`];
              if (country) displayLabel += ` (${country})`;
            }
          }
          backgroundRows.push([displayLabel, (data.background as any)[key] ? 'X' : '', !(data.background as any)[key] ? 'X' : '']);
        }
      });

      docChildren.push(createTable(['ANTECEDENTES:', 'Si', 'No'], backgroundRows, [80, 10, 10]));

      docChildren.push(new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'Asimismo, autorizamos al mandatario para:', size: 20 })] }));

      docChildren.push(createTable(
        ['AUTORIZACIONES:', 'Si', 'No'],
        Object.entries(SURVIVORSHIP_POWER_LABELS).map(([key, label]) => [
          label,
          (data.powers as any)[key] ? 'X' : '',
          !(data.powers as any)[key] ? 'X' : ''
        ]),
        [80, 10, 10]
      ));

      docChildren.push(new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "El presente mandato faculta para solicitar liquidaciones de pensión y gestionar calificación de calidad de beneficiarios de pensión de sobrevivencia.", bold: true, size: 20 })] }));
      docChildren.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Otorgamos el presente mandato para los únicos fines antes señalados y se entiende revocado por otro de fecha posterior o por término de la gestión encomendada.", size: 20 })] }));

      docChildren.push(new Paragraph({ spacing: { before: 800 } }));
      
      const adults = data.beneficiaries.filter(b => isAdult(b.birthDate));
      const minors = data.beneficiaries.filter(b => !isAdult(b.birthDate));
      
      const sigWidth = Math.floor(CONTENT_WIDTH_DXA / 2);
      const sigWidths = [sigWidth, CONTENT_WIDTH_DXA - sigWidth];
      
      const sigRows: TableRow[] = [];
      
      const maxSigRows = Math.max(adults.length, 1);
      for (let i = 0; i < maxSigRows; i++) {
        const adult = adults[i];
        sigRows.push(new TableRow({
          children: [
            new TableCell({
              children: adult ? [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun({ text: '__________________________', bold: true })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'MANDANTE(S)', size: 18, bold: true })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: adult.fullName, size: 18, bold: true })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `RUT: ${adult.rut}`, size: 18, bold: true })] })
              ] : []
            }),
            new TableCell({
              children: i === 0 ? [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun({ text: '__________________________', bold: true })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'MANDATARIO', size: 18, bold: true })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.mandatory.fullName, size: 18, bold: true })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `RUT: ${data.mandatory.rut}`, size: 18, bold: true })] })
              ] : []
            })
          ]
        }));
      }

      docChildren.push(new Table({
        width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
        columnWidths: sigWidths,
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
        rows: sigRows
      }));

      if (minors.length > 0) {
        const minorNames = minors.map(m => `${m.fullName} (RUT: ${m.rut})`).join(', ');
        docChildren.push(new Paragraph({
          spacing: { before: 400 },
          children: [
            new TextRun({ 
              text: `Se deja constancia que El consultante firma por poder, en nombre de los beneficiarios menores de edad (${minorNames}), por ser estos menores de edad.`,
              italics: true,
              size: 18
            })
          ]
        }));
      }
    } else {
      // Standard Mandate DOCX
      const introText = MANDATE_TEMPLATE.split('Asimismo, expongo que a la fecha')[0]
        .replace(/{pensionTitle}/g, `**${getPensionTitle()}**`)
        .replace('{date}', `**${formatDate(data.date) || '[Fecha]'}**`)
        .replace('{mandatorName}', `**${data.mandator.fullName || '[Nombre Mandante]'}**`)
        .replace(/{mandatorRut}/g, `**${data.mandator.rut || '[RUT Mandante]'}**`)
        .replace('{mandatorNationality}', `**${data.mandator.nationality || '[Nacionalidad]'}**`)
        .replace('{mandatorSex}', `**${data.mandator.sex || '[Sexo]'}**`)
        .replace('{mandatorBirthDate}', `**${formatDate(data.mandator.birthDate) || '[Fecha Nacimiento]'}**`)
        .replace('{mandatorCivilStatus}', `**${data.mandator.civilStatus || '[Estado Civil]'}**`)
        .replace('{mandatorProfession}', `**${data.mandator.profession || '[Profesión]'}**`)
        .replace('{mandatorAddress}', `**${data.mandator.address || '[Dirección]'}**`)
        .replace('{mandatorCommune}', `**${data.mandator.commune || '[Comuna]'}**`)
        .replace('{mandatorCity}', `**${data.mandator.city || '[Ciudad]'}**`)
        .replace('{mandatorPhone}', `**${data.mandator.phone || '[Teléfono]'}**`)
        .replace('{mandatorEmail}', `**${data.mandator.email || '[Email]'}**`)
        .replace('{mandatorHealth}', `**${data.mandator.healthInstitution || '[Institución Salud]'}**`)
        .replace('{mandatoryName}', `**${data.mandatory.fullName || '[Nombre Mandatario]'}**`)
        .replace('{mandatoryRut}', `**${data.mandatory.rut || '[RUT Mandatario]'}**`)
        .replace('{mandatoryNationality}', `**${data.mandatory.nationality || '[Nacionalidad]'}**`)
        .replace('{mandatoryAddress}', `**${data.mandatory.address || '[Dirección]'}**`)
        .replace('{mandatoryCommune}', `**${data.mandatory.commune || '[Comuna]'}**`)
        .replace('{mandatoryCity}', `**${data.mandatory.city || '[Ciudad]'}**`)
        .replace('{mandatoryPhone}', `**${data.mandatory.phone || '[Teléfono]'}**`)
        .replace('{mandatoryEmail}', `**${data.mandatory.email || '[Email]'}**`)
        .replace('{mandatoryRegSection}', mandatoryRegSection)
        .replace('{mandatorAfp}', `**${data.mandator.afp || '[AFP]'}**`)
        .replace('{vejezDetail}', `**${getVejezDetail()}**`);

      docChildren.push(createRichParagraph(introText.trim()));

      docChildren.push(new Paragraph({ children: [new TextRun({ text: 'Asimismo, expongo que a la fecha, los datos de mi empleador son los siguientes:', size: 20 })] }));
      docChildren.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: 'Nombre      : ', size: 20 }), new TextRun({ text: data.employer.name || '', bold: true, size: 20 })] }));
      docChildren.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: 'RUT         : ', size: 20 }), new TextRun({ text: data.employer.rut || '', bold: true, size: 20 })] }));
      docChildren.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: 'Dirección   : ', size: 20 }), new TextRun({ text: data.employer.address || '', bold: true, size: 20 })] }));
      docChildren.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: 'Teléfono    : ', size: 20 }), new TextRun({ text: data.employer.phone || '', bold: true, size: 20 })] }));

      if (data.beneficiaries.length > 0) {
        docChildren.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Para efectos de la suscripción de la pensión antes mencionada, declaro conocer que tienen la calidad de beneficiarios de pensión de sobrevivencia: el cónyuge, los hijos, la madre o padre de hijos de filiación no matrimonial y, a falta de todos los anteriores, los padres. En consecuencia, efectúo la siguiente declaración de beneficiarios:", size: 20 })] }));
        docChildren.push(createTable(
          ['Nombre', 'Rut', 'F. Nac.', 'Parentesco', 'Sexo', 'Inv', 'Observaciones'],
          data.beneficiaries.map(b => [b.fullName, b.rut, formatDate(b.birthDate) || '', b.relationship, b.sex || '', b.isInvalid ? 'SI' : 'NO', getBeneficiaryObservations(b)]),
          [30, 12, 12, 15, 10, 8, 13],
          true
        ));
      }

      docChildren.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: `Por otra parte, señalo los siguientes antecedentes que el mandatario deberá considerar para suscribir en mi nombre solicitud de pensión de ${getPensionTitle()}${getVejezDetail()}.`, size: 20 })] }));

      docChildren.push(createTable(
        ['ANTECEDENTES:', 'Si', 'No'],
        Object.entries(BACKGROUND_LABELS).map(([key, label]) => [label, (data.background as any)[key] ? 'X' : '', !(data.background as any)[key] ? 'X' : '']),
        [80, 10, 10]
      ));

      docChildren.push(new Paragraph({ spacing: { before: 200 } }));

      const situationMap: Record<string, string> = {
        'DEPENDENT': 'Trabajador dependiente',
        'UNEMPLOYED': 'Desempleado (< 12 meses)',
        'INDEPENDENT': 'Trabajador independiente',
        'VOLUNTARY': 'Afiliado voluntario'
      };

      docChildren.push(createTable(
        ['Me encuentro en la siguiente situación', 'Si', 'No'],
        Object.entries(situationMap).map(([key, label]) => [label, data.background.laborSituation === key ? 'X' : '', data.background.laborSituation !== key ? 'X' : '']),
        [80, 10, 10]
      ));

      docChildren.push(new Paragraph({ spacing: { before: 200 } }));

      docChildren.push(createTable(
        ['AUTORIZACIONES:', 'Si', 'No'],
        Object.entries(POWER_LABELS).map(([key, label]) => [label, (data.powers as any)[key] ? 'X' : '', !(data.powers as any)[key] ? 'X' : '']),
        [80, 10, 10]
      ));

      const invalidityText = data.pensionType === 'INVALIDEZ' 
        ? 'Además el presente mandato se extiende para la COMISIÓN MÉDICA DE INVALIDEZ, (Regional y Central)., está facultado para solicitar información respecto del trámite de calificación de invalidez, consultar el acta del trámite, aportar información respecto del trámite, retirar Resolución y Dictamen de invalidez.' 
        : '';

      const footerTextRaw = MANDATE_TEMPLATE.split('{powersList}')[1];
      const footerText = footerTextRaw
        .replace('{invaliditySection}', invalidityText)
        .split('{mandatorName}')[0]
        .trim();

      const footerParagraphs = footerText.split('\n').map(p => p.trim()).filter(p => p !== '');
      footerParagraphs.forEach(p => {
        docChildren.push(new Paragraph({ 
          spacing: { before: 200 }, 
          children: [new TextRun({ text: p, size: 20 })] 
        }));
      });

      docChildren.push(new Paragraph({ spacing: { before: 800 } }));
      const sigWidth = Math.floor(CONTENT_WIDTH_DXA / 2);
      const sigWidths = [sigWidth, CONTENT_WIDTH_DXA - sigWidth];

      docChildren.push(new Table({
        width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
        columnWidths: sigWidths,
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
        rows: [
          new TableRow({
            children: [
              new TableCell({ 
                width: { size: sigWidths[0], type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '__________________________', bold: true }), new TextRun({ text: '\nMANDANTE', bold: true, break: 1 }), new TextRun({ text: `\n${data.mandator.fullName || '[Nombre Mandante]'}`, bold: true, break: 1 }), new TextRun({ text: `\nRUT: ${data.mandator.rut || '[RUT]'}`, bold: true, break: 1 })] })] 
              }),
              new TableCell({ 
                width: { size: sigWidths[1], type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '__________________________', bold: true }), new TextRun({ text: `\n${mandatoryLabel}`, bold: true, break: 1 }), new TextRun({ text: `\n${data.mandatory.fullName || '[Nombre Mandatario]'}`, bold: true, break: 1 }), new TextRun({ text: `\nRUT: ${data.mandatory.rut || '[RUT]'}`, bold: true, break: 1 })] })] 
              })
            ]
          })
        ]
      }));
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: MARGIN_DXA, right: MARGIN_DXA, bottom: MARGIN_DXA, left: MARGIN_DXA }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "Pag. ", size: 16, color: "646464" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "646464" }),
                  new TextRun({ text: " de ", size: 16, color: "646464" }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "646464" })
                ]
              })
            ]
          })
        },
        children: docChildren
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Mandato_${getPensionTitle()}_${(data.mandator.fullName || data.affiliate?.fullName || 'Previsional').replace(/\s+/g, '_')}.docx`);
  };

  const handleGenerateContract = async () => {
    setIsGeneratingContract(true);
    try {
      const contractMarkdown = await generateContract(data);
      const clientName = data.mandator.fullName || data.affiliate?.fullName || 'Cliente';
      const advisorName = data.mandatory.fullName || '';
      await exportContractToDocx(contractMarkdown, clientName, 'contrato', advisorName);
    } catch (error) {
      console.error('Error generating contract:', error);
      alert('Hubo un error al generar el contrato. Por favor intente nuevamente.');
    } finally {
      setIsGeneratingContract(false);
    }
  };

  return (
    <div className="sticky top-8 space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 min-h-[600px] flex flex-col">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">Vista Previa</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={downloadDocx}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 text-sm font-semibold"
            >
              <FileCode className="w-4 h-4" />
              Word
            </button>
            <button
              onClick={handleGenerateContract}
              disabled={isGeneratingContract}
              className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200 text-sm font-semibold disabled:opacity-50"
            >
              {isGeneratingContract ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileSignature className="w-4 h-4" />
              )}
              Contrato
            </button>
          </div>
        </div>

        <div className="flex-1 font-serif text-gray-700 whitespace-pre-wrap leading-relaxed text-[11px] overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {generatePreviewText()}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest text-center">
          Documento generado por Mandatos Previsionales IA
        </div>
      </div>
    </div>
  );
}
