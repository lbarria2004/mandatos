export const MANDATE_TEMPLATE = `
Con fecha {date} y por medio del siguiente instrumento, yo {mandatorName}, RUT {mandatorRut}, de nacionalidad {mandatorNationality}, de sexo {mandatorSex}, nacido el {mandatorBirthDate}, estado civil {mandatorCivilStatus}, de profesión u oficio {mandatorProfession}, domiciliado en {mandatorAddress}, comuna de {mandatorCommune}, ciudad de {mandatorCity}, teléfono {mandatorPhone}, correo electrónico {mandatorEmail}, incorporado a la Institución de Salud {mandatorHealth}, confiero poder a {mandatoryName}, RUT {mandatoryRut}, de nacionalidad {mandatoryNationality}, domiciliado en {mandatoryAddress}, comuna de {mandatoryCommune}, ciudad de {mandatoryCity}, teléfono {mandatoryPhone}, correo electrónico {mandatoryEmail}{mandatoryRegSection}, para que en mi nombre suscriba en {mandatorAfp} una solicitud de Pensión de {pensionTitle}{vejezDetail}.

Asimismo, expongo que a la fecha, los datos de mi empleador son los siguientes:
		Nombre : {employerName}
		RUT : {employerRut}
		Dirección : {employerAddress}
		Teléfono : {employerPhone}

{beneficiariesSection}

{backgroundList}

{powersList}

{invaliditySection}

Otorgo el presente mandato para los únicos fines antes señalados y se entiende revocado por otro de fecha posterior o por término de la gestión encomendada.

Finalmente, declaro conocer que el trámite de pensión es gratuito, sin perjuicio de que puedo contratar voluntariamente una asesoría previsional para dicho trámite.

{mandatorName}                                  {mandatoryName}
RUT {mandatorRut}                               RUT: {mandatoryRut}
`;

export const SURVIVORSHIP_MANDATE_TEMPLATE = `
Con fecha {date} y por medio del presente instrumento, los abajo firmantes en su calidad de beneficiarios de pensión de sobrevivencia del afiliado(a) causante {causanteName}, RUT {causanteRut}, confieren poder a {mandatoryName}, RUT {mandatoryRut}, domiciliado en {mandatoryAddress}, comuna de {mandatoryCommune}, ciudad de {mandatoryCity}, teléfono {mandatoryPhone}, correo electrónico {mandatoryEmail}{mandatoryRegSection}, para que suscriba en sus nombres una solicitud de Pensión de Sobrevivencia en {causanteAfp}.

Para tales efectos, declaramos conocer que tienen la calidad de beneficiarios de pensión de sobrevivencia, los hijos, la madre o padre de hijos de filiación no matrimonial y, a falta de todos los anteriores, los padres. Al respecto declaramos no conocer más beneficiarios de pensión del afiliado {causanteName} RUT {causanteRut}, que los que suscribimos el presente documento, y que nuestros datos son los siguientes:

{beneficiariesTable}

Otros antecedentes de los beneficiarios de pensión:

{beneficiariesExtraTable}

Por otra parte, señalamos los siguientes antecedentes que el mandatario deberá considerar para suscribir en nuestro nombre la solicitud de pensión de Sobrevivencia.

{backgroundList}

Asimismo, autorizamos al mandatario para:

{powersList}

El presente mandato faculta para solicitar liquidaciones de pensión y gestionar calificación de calidad de beneficiarios de pensión de sobrevivencia.

Otorgamos el presente mandato para los únicos fines antes señalados y se entiende revocado por otro de fecha posterior o por término de la gestión encomendada.
`;

export const CHILEAN_AFPS = [
  "AFP Capital",
  "AFP Cuprum",
  "AFP Habitat",
  "AFP Modelo",
  "AFP PlanVital",
  "AFP ProVida",
  "AFP Uno"
];

export const HEALTH_INSTITUTIONS = [
  "FONASA",
  "Isapre Banmédica",
  "Isapre Colmena",
  "Isapre Consalud",
  "Isapre CruzBlanca",
  "Isapre Esencial",
  "Isapre Nueva Masvida",
  "Isapre Vida Tres"
];

export const POWER_LABELS: Record<string, string> = {
  invalidityQualification: "Suscribir solicitud de Calificación de Invalidez (El mandatario deberá indicar los datos necesarios para suscribir la ficha de datos personales para solicitud de calificación de invalidez)",
  medicalBackground: "Completar y suscribir el listado de antecedentes médicos aportados para tramitar la solicitud de calificación de invalidez (el mandato deberá especificar los antecedentes médicos aportados)",
  bonoReconocimiento: "Suscribir solicitud de Bono de Reconocimiento",
  statusInformation: "Solicitar información respecto del estado del trámite de pensión",
  balanceCertificate: "Retirar en la AFP el Certificado de Saldo",
  voluntaryContributionsForm: "Suscribir formulario \"Destino de Cotizaciones Voluntarias\"",
  cavTransferForm: "Suscribir formulario \"Transferencia de Fondos desde la Cuenta de Ahorro Voluntario\"",
  apvSelectionForm: "Suscribir formulario \"Selección de Alternativas de Ahorro Previsional Voluntario\"",
  modalityChange: "Suscribir solicitud de cambio de modalidad de pensión",
  surplusCalculation: "Suscribir solicitud de cálculo de excedente de libre disposición",
  nominalValueMaintenance: "Suscribir opción por mantener el valor nominal del saldo destinado a pensión"
};

export const BACKGROUND_LABELS: Record<string, string> = {
  preliminaryPension: "Deseo pensión preliminar",
  apsRequest: "Solicito Pensión Garantizada Universal (PGU)",
  oldSystemPension: "Recibo pensión antiguo sistema",
  invalidityPensionThisSystem: "Recibo pensión invalidez de este Sistema",
  minimumPensionAdjustment: "Deseo que mi pensión se ajuste a la pensión mínima, si resulta inferior a ella",
  basicSolidaryPensionAdjustment: "Deseo que mi pensión se ajuste a la pensión básica solidaria, si resulta inferior a ella",
  statuteAffected: "Estoy afecto al Estatuto Administrativo (Ley 18.834) o Leyes números 18.883, 19,070, 19,378 o artículo 332 número 6 del Código Orgánico de Tribunales, respecto de los cuales la obtención de pensión implica la cesación en el cargo.",
  apvFinancing: "Destinaré Ahorro Previsional Voluntario al financiamiento de mi pensión.",
  apvcFinancing: "Destinaré Ahorro Previsional Voluntario Colectivo al financiamiento de mi pensión.",
  cavFinancing: "Traspasaré fondos desde mi Cuenta de Ahorro Voluntario para el financiamiento de mi pensión",
  agreedDeposits: "Poseo depósitos convenidos",
  unemploymentInsuranceFinancing: "Traspasaré fondos desde mi Cuenta Individual de Cesantía",
  foreignContributions: "Tengo cotizaciones en otro país",
  foreignResidence: "Tengo períodos de residencia en otro país",
  fundTypeChange: "Deseo cambiar de Tipo de Fondo",
  publicInformationList: "Deseo que mis datos personales (nombre, Rut, dirección, saldo cuenta capitalización individual, bono de reconocimiento) y los datos de mis beneficiarios de pensión, aparezcan en un LISTADO PÚBLICO DE INFORMACIÓN."
};

export const SURVIVORSHIP_BACKGROUND_LABELS: Record<string, string> = {
  situacion_header: "Situación en que se encontraba el afiliado:",
  laborSituation_DEPENDENT: "Trabajador dependiente que se encontraba prestando servicios",
  laborSituation_UNEMPLOYED: "Desempleado por un período no mayor a doce meses",
  laborSituation_INDEPENDENT: "Trabajador independiente",
  laborSituation_VOLUNTARY: "Afiliado voluntario",
  afiliado_tenia_header: "El Afiliado tenía",
  apvFinancing: "Ahorro Previsional Voluntario en otra AFP o Institución Autorizada",
  apvcFinancing: "Depósitos de Ahorro Previsional Voluntario Colectivo en otra AFP o Institución Autorizada",
  agreedDeposits: "Depósitos Convenidos en otra AFP o Institución Autorizada",
  foreignContributions: "Cotizaciones en otro país",
  foreignResidence: "Períodos de residencia en otro pais",
  decisiones_header: "Decisiones de Beneficiarios:",
  preliminaryPension: "Deseamos pensión preliminar",
  minimumPensionAdjustment: "Deseamos que la pensión se ajuste a la pensión mínima, si resulta inferior a ella",
  basicSolidaryPensionAdjustment: "Deseamos que la pensión se ajuste a la pensión básica solidaria, si resulta inferior a ella",
  fundTypeChange: "Deseamos cambiar de Tipo de Fondo",
  publicInformationList: "Deseamos que nuestros datos personales como beneficiarios de pensión (nombre, Rut, dirección, saldo cuenta capitalización individual, bono de reconocimiento), aparezcan en un LISTADO PÚBLICO DE INFORMACIÓN"
};

export const SURVIVORSHIP_POWER_LABELS: Record<string, string> = {
  childInvalidityQualification: "Suscribir solicitud de Calificación de Invalidez de hijo del afiliado",
  bonoReconocimiento: "Suscribir solicitud de Bono de Reconocimiento",
  statusInformation: "Solicitar información respecto del estado del trámite de pensión",
  balanceCertificate: "Retirar en la AFP el Certificado de Saldo",
  modalityChange: "Suscribir solicitud de cambio de modalidad de pensión",
  nominalValueMaintenance: "Suscribir opción por mantener el valor nominal del saldo destinado a pensión"
};

export const PREDEFINED_ADVISORS = [
  {
    fullName: "Luis Mauricio Barria Chodil",
    rut: "9.319.028-9",
    nationality: "Chileno",
    address: "Av. San Martin 924 of 311",
    commune: "Temuco",
    city: "Temuco",
    phone: "951698189",
    email: "luisbarria.pensiones@gmail.com",
    registrationNumber: "" 
  },
  {
    fullName: "Karin Pablina Orostica Santelices",
    rut: "15.126.775-0",
    nationality: "Chilena",
    address: "Av. San Martin 924 of 311",
    commune: "Temuco",
    city: "Temuco",
    phone: "991613526",
    email: "karinorostica.pensiones@gmail.com",
    registrationNumber: "" 
  }
];
