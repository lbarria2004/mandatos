import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No se encontró una clave de API configurada.");
  }
  return new GoogleGenAI({ apiKey });
};

const getClausulasLegales = (isKarin: boolean) => `
SEGUNDO: Naturaleza u objeto del contrato: El presente contrato de asesoría previsional tiene por objeto otorgar información a los afiliados y beneficiarios del Sistema de Pensiones, considerando de manera integral todos los aspectos que dicen relación con su situación particular y que fueren necesarios para adoptar decisiones informadas de acuerdo a sus necesidades e intereses, en relación con las prestaciones y beneficios que contempla el D.L. N° 3.500. Dicha asesoría podrá comprender además la intermediación de seguros previsionales.

TERCERO: Obligaciones Del Asesor Previsional:
I. Otorgar información, asesorar y orientar al afiliado o sus beneficiarios, según corresponda, considerando de manera integral todos los aspectos que digan relación con su situación particular y que fueren necesarias para que adopten decisiones informadas de acuerdo a sus necesidades e intereses, en relación con las prestaciones y beneficios que contempla el D.L. N° 3.500. 
II. Asesorar en la selección de modalidad de pensión, informando acerca de los procedimientos y funcionamiento del Sistema de Consultas y Ofertas de Montos de Pensión, enviar y transmitir las consultas de montos de pensión requeridas por los consultantes y asistirle en todas las gestiones que corresponda efectuar una vez evacuadas las ofertas de pensión por el Sistema, ya sea en casos de aceptación de alguna de las ofertas contenida en el Certificado de Ofertas, la cotización y aceptación de una oferta externa en caso de negociación directa con alguna compañía de seguros, la participación en el sistema de remate electrónico de pensión, el ingreso dentro de los plazos correspondientes de una nueva consulta en el Sistema, o bien la posibilidad de desistirse de contratar conforme a las ofertas recibidas. 
III. En caso que el afiliado o sus beneficiarios cumplan los requisitos para pensionarse, o se trate de un pensionado bajo la modalidad de retiro programado, la asesoría deberá informar en especial sobre la forma de hacer efectiva su pensión según las modalidades previstas en el artículo 61 del D.L. N° 3.500, sus características y demás beneficios a que pudieren acceder según el caso, con una estimación de sus montos. 
IV. Analizar y verificar la situación previsional tanto del pensionable como de sus beneficiarios legales. El asesor deberá obtener o requerir del cliente los antecedentes que permitan establecer o verificar la existencia o no de beneficiarios con derecho a pensión de sobrevivencia, a fin de evitar se incurra en la conducta descrita en el artículo 13 del D.L. N° 3.500, de 1980. v. En caso de que el solicitante cumpliera con los requisitos legales para obtener pensión de invalidez deberá informar el derecho que le asiste para acceder a dicha pensión con la misma compañía de seguros obligada a efectuar el pago del aporte adicional en conformidad al artículo 60 del D.L. N° 3.500 aun cuando ésta no hubiera presentado una oferta de pensión, e informarle el plazo del cual dispone para ejercer dicha opción. 

${isKarin 
  ? `CUARTO: Pólizas Comprometidas: el Asesor tiene contratada una Póliza de Responsabilidad Civil Profesional Nº 9148171 con SEGUROS GENERALES SURAMERICANA S.A., emitida el 27/09/2025., vigencia desde 01/10/2025 hasta el 30/09/2026.`
  : `CUARTO: Pólizas Comprometidas: La Entidad de Asesoria Previsional Asesoriapensiones.cl Spa, tiene contratada una Póliza de Responsabilidad Civil Profesional Nº 9279324 con SEGUROS GENERALES SURAMERICANA S.A., emitida el 30/10/2025., vigencia desde 01/10/2025 hasta el 30/09/2026.`
}

QUINTO: Vigencia: El presente contrato tendrá vigencia durante el período que dure el trámite de pensión y se extenderá hasta que el contratante Selecciones su Modalidad de Pensión, o desista de pensionarse.

SEXTO: Honorarios: Los honorarios brutos convenidos a pagar al “ASESOR PREVISIONAL” por la prestación de sus servicios, deberán ajustarse al rango de comisiones que se encuentran establecidas en el Decreto Ley 3.500 y en el Decreto Supremo conjunto del Ministerio de Hacienda y Trabajo y Previsión Social N° 26 publicado el 01 de Octubre de 2020.
Primera Asesoría (Selección de Modalidad de Pensión):
1.5% del saldo destinado a la modalidad de pensión de renta vitalicia con tope 60 UF y 
1.2% en el caso de retiro programado con tope 36 UF.
Segunda Asesoría (Cambio de Modalidad de Pensión de Retiro Programado a otra Modalidad):
1,5% menos el porcentaje pagado por la primera asesoría, aplicado al saldo destinado a pensión, con tope 60 UF menos las unidades de fomento efectivamente pagadas.
Además, se establece que el pago de los honorarios queda sujeto a la prestación efectiva de la asesoría de que trata el contrato y que éstos honorarios o comisión se cobrarán en términos brutos, es decir, el monto incluye el impuesto al que esté obligado el Asesor Previsional.

SÉPTIMO: Derecho a Información: El contratante podrá requerir, en cualquier momento, información escrita respecto de las gestiones realizadas durante el curso de la asesoría. Asimismo, el asesor o entidad de asesoría se compromete a la entrega de un INFORME FINAL, en el cual explicita la recomendación o sugerencia entregada, indicando los antecedentes, escenarios o los considerandos que sirvieron de base para la recomendación.  
Este Informe Final, deberá explicitar claramente la fecha en que se extendió y las firmas de las partes, las que podrán ser electrónicas.

OCTAVO: Voluntariedad del contrato de Asesoría Previsional y efectos de la recomendación del asesor: El presente contrato se suscribe libre y voluntariamente toda vez que para ejercer derechos previsionales no es requisito la contratación de asesoría previsional. La recomendación escrita que se otorgue por el Asesor Previsional o por la Entidad de Asesoría Previsional, esto es por medio del Informe Final, no es obligatoria para el afiliado o sus beneficiarios, pudiendo éstos optar por cualquier alternativa que les parezca conveniente. Cualquier disposición de este contrato que pudiere constituir una limitación a la libertad contractual y al derecho del afiliado a elegir AFP, tipo de fondo, cuándo pensionarse, la modalidad de pensión y la entidad que otorgue su pensión, se tendrá por no escrita.

NOVENO: Privacidad de la información: El Asesor Previsional se obliga a resguardar la privacidad de toda la información a la que acceda producto del contrato.

DÉCIMO: Independencia del Asesor Previsional: El asesor previsional declara no ser directores, accionistas, ejecutivos principales, gerentes, apoderados o dependientes de una AFP, Compañía de Seguros, Sociedad Administradora de Fondos de Cesantía, aseguradora, reaseguradora, liquidadora de siniestros o entidades que conformen el grupo empresarial de esas sociedades. Asimismo, se compromete a otorgar la asesoría previsional con absoluta independencia, no pudiendo condicionarla a otros productos o servicios propios o de una persona relacionada.

DÉCIMO PRIMERO: Prohibiciones: Se encuentra prohibido limitar en forma alguna la libre elección del contratante respecto de tomar o no la recomendación del Asesor. El Asesor no podrá entregar al contratante incentivos o beneficios adicionales al objeto de la Asesoría.

DÉCIMO SEGUNDO: Término del contrato: El afiliado podrá poner término en cualquier momento al presente contrato sin que se establezca el pago de una multa o algún otro tipo de penalización por dicha terminación, bastando para ello la comunicación de esta decisión por escrito al Asesor o a la Entidad de Asesoría Previsional, la que deberá remitirse por escrito al domicilio o correo electrónico de éste que figura en el contrato. El Asesor o la Entidad de Asesoría Previsional podrán poner término al contrato de igual forma, debiendo siempre remitir la comunicación escrita al domicilio del afiliado vía correo certificado. Con todo, se entenderá terminada la vigencia del contrato transcurrido el plazo de 3 días contado desde el envío de la comunicación.

El presente contrato de Asesoría Previsional, se firma en dos ejemplares quedando un ejemplar en poder de cada una de las partes.
`;

const PROMPT_CONTRATO = `
Eres un experto legal y previsional chileno. Tu tarea es redactar las partes VARIABLES de un "Contrato de Prestación de Servicios de Asesoría Previsional".

REGLAS:
1. **RELLENO DE DATOS:** Rellena el ENCABEZADO y la cláusula PRIMERO con la información proporcionada. **IMPORTANTE: Todos los datos extraídos del formulario (nombres, RUTs, fechas, direcciones, estados civiles, etc.) DEBEN aparecer en NEGRITA (ej: **Juan Pérez**, **12.345.678-9**).**
2. **FORMATO DE FECHAS:** Todas las fechas DEBEN estar en formato dd/mm/aaaa.
3. **DATOS DEL ASESOR:** 
   - Si el mandatario es KARIN PABLINA OROSTICA SANTELICES, usa sus datos (RUT: 15.126.775-0, Domicilio: AV. SAN MARTIN 924 OF 311, TEMUCO).
   - De lo contrario, usa siempre los datos de LUIS MAURICIO BARRÍA CHODIL.
4. **BENEFICIARIOS:** En la cláusula PRIMERO, genera la descripción de los beneficiarios y, a continuación, genera una TABLA con los siguientes encabezados exactos: Nombre, Rut, F. Nac., Parentesco, Sexo, Inv.
   - En la columna "Inv", escribe "Si" si el beneficiario es inválido (isInvalid: true) y "No" si no lo es.
   - Si no hay beneficiarios, pon: "El consultante declara no contar con beneficiarios legales de pensión".
5. **CAMPOS FALTANTES:** Si faltan datos, deja el espacio en blanco subrayado (ej: __________).
6. **SALIDA:** Devuelve el contrato estructurado así:
   - El texto del ENCABEZADO directamente (NO escribas la palabra "ENCABEZADO").
   - PRIMERO: (Descripción y Tabla de Beneficiarios)
   - [CLAUSULAS_LEGALES_ESTANDAR] (Escribe exactamente esta etiqueta)
   - El bloque de firmas al final (NO escribas la palabra "FIRMAS").

---
PLANTILLA ENCABEZADO (VEJEZ/INVALIDEZ):
En TEMUCO, a {{FECHA}} suscriben el presente contrato, por una parte {{NOMBRE AFILIADO}} RUT: {{RUT AFILIADO}}, estado civil: {{ESTADO CIVIL AFILIADO}}, Fecha de Nacimiento: {{FECHA DE NACIMIENTO AFILIADO}}, profesión u oficio: {{OFICIO AFILIADO}}, Domiciliados en: {{DIRECCIÓN}}, Ciudad: {{CIUDAD}}, Comuna: {{COMUNA}} Celular N° {{CELULAR}} Correo electrónico: {{CORREO ELECTRÓNICO}}; AFP {{AFP DE ORIGEN}} , Sistema de Salud: {{SISTEMA DE SALUD}} en adelante el "Consultante" y por la otra {{NOMBRE ASESOR}} de Profesión u oficio ASESOR PREVISIONAL, nacido el {{FECHA NACIMIENTO ASESOR}}, domiciliado en AV. SAN MARTIN 924 OF 311, Ciudad, TEMUCO, Comuna, TEMUCO, Celular: {{CELULAR ASESOR}}. e-mail: {{EMAIL ASESOR}},. {{ENTIDAD_INFO}} han suscrito el siguiente Contrato de Prestación de Servicios de Asesoría Previsional para tramitar Pensión de {{TIPO DE PENSIÓN}}.

---
PLANTILLA ENCABEZADO (SOBREVIVENCIA):
En TEMUCO, a {{FECHA}} suscriben el presente contrato, por una parte {{NOMBRE CONSULTANTE}}, RUT {{RUT CONSULTANTE}}, estado civil: {{ESTADO CIVIL CONSULTANTE}}, Nacida el {{FECHA DE NACIMIENTO CONSULTANTE}}, profesión u oficio: {{PROFESIÓN CONSULTANTE}}, Madre de hijos con derecho a pensión.,Beneficiaria de Pensión de sobrevivencia de {{NOMBRE CAUSANTE}}, RUT {{RUT CAUSANTE}}, Causante, Afiliado a AFP {{AFP DE ORIGEN}} y por la otra.,{{NOMBRE ASESOR}} de Profesión u oficio ASESOR PREVISIONAL, nacido el {{FECHA NACIMIENTO ASESOR}}, domiciliado en AV. SAN MARTIN 924 OF 311, Ciudad, TEMUCO, Comuna, TEMUCO, Celular: {{CELULAR ASESOR}}. e-mail: {{EMAIL ASESOR}},. {{ENTIDAD_INFO}} han suscrito el siguiente Contrato de Prestación de Servicios de Asesoría Previsional para tramitar Pensión de {{TIPO DE PENSIÓN}}.

---
FIRMAS:
| {{NOMBRE ASESOR}} | {{NOMBRE AFILIADO/CONSULTANTE}} |
| {{RUT ASESOR}} | RUT: {{RUT AFILIADO/CONSULTANTE}} |
| ASESOR PREVISIONAL | CONSULTANTE |
| {{FIRMA_ENTIDAD}} | |
`;

export async function generateContract(data: any): Promise<string> {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  
  const advisorName = data.mandatory?.fullName || "";
  const isKarin = advisorName.toLowerCase().includes('karin') && advisorName.toLowerCase().includes('orostica');
  const registrationNumber = isKarin ? "1159" : "1360";

  const entidadInfo = isKarin 
    ? `inscrito en el Registro de Asesores Previsionales con el N° **${registrationNumber}** de la Superintendencia de Pensiones, mismo domicilio, en adelante "El Asesor Previsional",`
    : `Rep. Legal de ENTIDAD DE ASESORIA PREVISIONAL ASESORIAPENSIONES.CL SPA RUT: 78.263.233-7 inscrito en el Registro de Asesores Previsionales con el N° **${registrationNumber}** de la Superintendencia de Pensiones, mismo domicilio, en adelante "La Entidad de Asesoría Previsional",`;

  const firmaEntidad = isKarin ? "" : "Rep. Legal Entidad de Asesoria Previsional Asesoriapensiones.cl SPA";

  const systemInstruction = PROMPT_CONTRATO
    .replace(/{{ENTIDAD_INFO}}/g, entidadInfo)
    .replace(/{{FIRMA_ENTIDAD}}/g, firmaEntidad);

  const prompt = `
    DATOS PARA EL CONTRATO:
    ${JSON.stringify(data, null, 2)}
    
    INSTRUCCIÓN: Genera el contrato siguiendo la plantilla y reglas establecidas. 
    Si el asesor es Karin Orostica, asegúrate de usar sus datos en el encabezado y firmas.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
      temperature: 0.2,
    }
  });

  let contractText = response.text || "";
  
  // Replace the placeholder with the actual legal clauses
  contractText = contractText.replace("[CLAUSULAS_LEGALES_ESTANDAR]", getClausulasLegales(isKarin));
  
  return contractText;
}
