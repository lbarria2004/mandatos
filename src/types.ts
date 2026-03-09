export type PensionType = 'VEJEZ' | 'INVALIDEZ' | 'SOBREVIVENCIA';
export type VejezType = 'EDAD' | 'ANTICIPADA';

export interface Person {
  fullName: string;
  rut: string;
  nationality?: string;
  sex?: string;
  address: string;
  commune: string;
  city?: string;
  birthDate?: string;
  civilStatus?: string;
  profession?: string;
  phone: string;
  email: string;
}

export interface Beneficiary extends Person {
  relationship: string;
  observations?: string;
  marriageDate?: string;
  agreementDate?: string;
  circumscription?: string;
  isInvalid?: boolean;
}

export interface Mandator extends Person {
  afp: string;
  healthInstitution?: string;
  beneficiariesCount?: number;
}

export interface Mandatory extends Person {
  registrationNumber: string;
}

export interface Background {
  preliminaryPension: boolean;
  apsRequest: boolean;
  oldSystemPension: boolean;
  invalidityPensionThisSystem: boolean;
  minimumPensionAdjustment: boolean;
  basicSolidaryPensionAdjustment: boolean;
  statuteAffected: boolean;
  apvFinancing: boolean;
  apvcFinancing: boolean;
  cavFinancing: boolean;
  agreedDeposits: boolean;
  unemploymentInsuranceFinancing: boolean;
  foreignContributions: boolean;
  foreignResidence: boolean;
  fundTypeChange: boolean;
  publicInformationList: boolean;
  laborSituation: 'DEPENDENT' | 'UNEMPLOYED' | 'INDEPENDENT' | 'VOLUNTARY' | '';
  laborSituation_DEPENDENT?: boolean;
  laborSituation_UNEMPLOYED?: boolean;
  laborSituation_INDEPENDENT?: boolean;
  laborSituation_VOLUNTARY?: boolean;
  apvFinancingInstitution?: string;
  apvcFinancingInstitution?: string;
  agreedDepositsInstitution?: string;
  foreignContributionsCountry?: string;
  foreignResidenceCountry?: string;
}

export interface MandatePowers {
  bonoReconocimiento: boolean;
  statusInformation: boolean;
  balanceCertificate: boolean;
  voluntaryContributionsForm: boolean;
  cavTransferForm: boolean;
  apvSelectionForm: boolean;
  modalityChange: boolean;
  surplusCalculation: boolean;
  nominalValueMaintenance: boolean;
  invalidityQualification?: boolean;
  medicalBackground?: boolean;
  childInvalidityQualification?: boolean;
  other: string;
}

export interface Employer {
  name: string;
  rut: string;
  address: string;
  phone: string;
}

export interface Affiliate {
  fullName: string;
  rut: string;
  deathDate: string;
  afp: string;
}

export interface MandateData {
  pensionType: PensionType;
  vejezType?: VejezType;
  mandator: Mandator;
  mandatory: Mandatory;
  affiliate?: Affiliate;
  beneficiaries: Beneficiary[];
  background: Background;
  powers: MandatePowers;
  employer: Employer;
  date: string;
  place: string;
}
