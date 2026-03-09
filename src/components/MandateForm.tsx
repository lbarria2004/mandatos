import React from 'react';
import { MandateData, Mandator, Mandatory, MandatePowers, Background, Beneficiary } from '../types';
import { CHILEAN_AFPS, POWER_LABELS, BACKGROUND_LABELS, SURVIVORSHIP_BACKGROUND_LABELS, SURVIVORSHIP_POWER_LABELS, HEALTH_INSTITUTIONS, PREDEFINED_ADVISORS } from '../constants';
import { User, Briefcase, ShieldCheck, MapPin, Phone, Mail, Hash, Calendar, Heart, Plus, Trash2, Info, UserCheck, Calculator } from 'lucide-react';
import { formatRut, calculateDV, validateRut, cleanRut } from '../utils/rutUtils';

interface Props {
  data: MandateData;
  onChange: (data: MandateData) => void;
}

const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
    <Icon className="w-5 h-5 text-indigo-600" />
    <h2 className="text-lg font-semibold text-gray-800 uppercase tracking-wider text-sm">{title}</h2>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text", icon: Icon, isRut = false }: any) => {
  const handleRutChange = (val: string) => {
    const formatted = formatRut(val);
    onChange(formatted);
  };

  const handleCalculateDV = () => {
    const cleaned = cleanRut(value);
    // If it has a DV already, we take the body. If it's just numbers, we take all.
    // Usually users type 7-8 digits and want the DV.
    let body = cleaned;
    if (cleaned.length >= 2 && validateRut(value)) {
      // Already valid, maybe they want to recalculate? 
      body = cleaned.slice(0, -1);
    } else if (cleaned.length > 0) {
      // If it's not valid, maybe the last char is a wrong DV or just part of the body
      // We'll assume the user wants to calculate DV for what's currently there
      // If it's 7 or 8 digits, it's likely the body.
    }
    
    if (body.length >= 7) {
      const dv = calculateDV(body);
      onChange(formatRut(body + dv));
    }
  };

  const isValid = isRut && value ? validateRut(value) : true;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">{label}</label>
        {isRut && value && !isValid && (
          <span className="text-[10px] font-bold text-red-500 uppercase">RUT Inválido</span>
        )}
      </div>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
          <input
            type={type}
            value={value || ''}
            onChange={(e) => isRut ? handleRutChange(e.target.value) : onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-gray-50 border ${!isValid ? 'border-red-300' : 'border-gray-200'} rounded-lg py-2 ${Icon ? 'pl-10' : 'px-3'} pr-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none`}
          />
        </div>
        {isRut && (
          <button
            type="button"
            onClick={handleCalculateDV}
            title="Calcular Dígito Verificador"
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
          >
            <Calculator className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const SelectField = ({ label, value, onChange, options, icon: Icon }: any) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-gray-50 border border-gray-200 rounded-lg py-2 ${Icon ? 'pl-10' : 'px-3'} pr-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none`}
      >
        <option value="">Seleccione...</option>
        {options.map((opt: any) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default function MandateForm({ data, onChange }: Props) {
  const updateMandator = (field: keyof Mandator, value: any) => {
    onChange({
      ...data,
      mandator: { ...data.mandator, [field]: value }
    });
  };

  const updateMandatory = (field: keyof Mandatory, value: any) => {
    onChange({
      ...data,
      mandatory: { ...data.mandatory, [field]: value }
    });
  };

  const selectAdvisor = (advisor: any) => {
    onChange({
      ...data,
      mandatory: { ...data.mandatory, ...advisor }
    });
  };

  const updatePowers = (field: keyof MandatePowers, value: any) => {
    onChange({
      ...data,
      powers: { ...data.powers, [field]: value }
    });
  };

  const updateBackground = (field: keyof Background, value: any) => {
    onChange({
      ...data,
      background: { ...data.background, [field]: value }
    });
  };

  const addBeneficiary = () => {
    const newBeneficiary: Beneficiary = {
      fullName: '',
      rut: '',
      relationship: '',
      address: '',
      commune: '',
      phone: '',
      email: '',
      marriageDate: '',
      agreementDate: '',
      circumscription: '',
      isInvalid: false
    };
    onChange({
      ...data,
      beneficiaries: [...data.beneficiaries, newBeneficiary]
    });
  };

  const removeBeneficiary = (index: number) => {
    const newBeneficiaries = [...data.beneficiaries];
    newBeneficiaries.splice(index, 1);
    onChange({
      ...data,
      beneficiaries: newBeneficiaries
    });
  };

  const updateBeneficiary = (index: number, field: keyof Beneficiary, value: any) => {
    const newBeneficiaries = [...data.beneficiaries];
    newBeneficiaries[index] = { ...newBeneficiaries[index], [field]: value };
    onChange({
      ...data,
      beneficiaries: newBeneficiaries
    });
  };

  const updateEmployer = (field: keyof MandateData['employer'], value: string) => {
    onChange({
      ...data,
      employer: { ...data.employer, [field]: value }
    });
  };

  const updateAffiliate = (field: keyof MandateData['affiliate'], value: any) => {
    onChange({
      ...data,
      affiliate: { ...data.affiliate, [field]: value } as any
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Selector de Asesor Predefinido */}
      <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Seleccionar Asesor Predefinido</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PREDEFINED_ADVISORS.map((advisor, idx) => (
            <button
              key={idx}
              onClick={() => selectAdvisor(advisor)}
              className={`p-4 rounded-xl border transition-all text-left flex flex-col gap-1 ${
                data.mandatory.rut === advisor.rut
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white border-indigo-200 text-indigo-900 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              <span className="font-bold text-sm">{advisor.fullName}</span>
              <span className={`text-[10px] uppercase font-bold tracking-tight ${data.mandatory.rut === advisor.rut ? 'text-indigo-100' : 'text-indigo-400'}`}>
                RUT: {advisor.rut}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Mandante / Solicitante */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <SectionTitle icon={User} title={data.pensionType === 'SOBREVIVENCIA' ? "Datos del Solicitante" : "Datos del Mandante (Afiliado)"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField 
            label="Nombre Completo" 
            value={data.mandator.fullName} 
            onChange={(v: string) => updateMandator('fullName', v)} 
            placeholder="Ej: Juan Pérez"
            icon={User}
          />
          <InputField 
            label="RUT" 
            value={data.mandator.rut} 
            onChange={(v: string) => updateMandator('rut', v)} 
            placeholder="12.345.678-9"
            icon={Hash}
            isRut={true}
          />
          <InputField 
            label="Nacionalidad" 
            value={data.mandator.nationality} 
            onChange={(v: string) => updateMandator('nationality', v)} 
            placeholder="Ej: Chilena"
            icon={MapPin}
          />
          <SelectField 
            label="Sexo" 
            value={data.mandator.sex} 
            onChange={(v: string) => updateMandator('sex', v)} 
            options={['Masculino', 'Femenino']}
            icon={User}
          />
          <InputField 
            label="Fecha de Nacimiento" 
            type="date"
            value={data.mandator.birthDate} 
            onChange={(v: string) => updateMandator('birthDate', v)} 
            icon={Calendar}
          />
          <SelectField 
            label="Estado Civil" 
            value={data.mandator.civilStatus} 
            onChange={(v: string) => updateMandator('civilStatus', v)} 
            options={['Soltero/a', 'Casado/a', 'Viudo/a', 'Divorciado/a', 'Conviviente Civil']}
            icon={Heart}
          />
          <InputField 
            label="Profesión u Oficio" 
            value={data.mandator.profession} 
            onChange={(v: string) => updateMandator('profession', v)} 
            placeholder="Ej: Profesor"
            icon={Briefcase}
          />
          <InputField 
            label="Dirección" 
            value={data.mandator.address} 
            onChange={(v: string) => updateMandator('address', v)} 
            placeholder="Calle Falsa 123"
            icon={MapPin}
          />
          <InputField 
            label="Comuna" 
            value={data.mandator.commune} 
            onChange={(v: string) => updateMandator('commune', v)} 
            placeholder="Santiago"
            icon={MapPin}
          />
          <InputField 
            label="Ciudad" 
            value={data.mandator.city} 
            onChange={(v: string) => updateMandator('city', v)} 
            placeholder="Santiago"
            icon={MapPin}
          />
          <InputField 
            label="Teléfono" 
            value={data.mandator.phone} 
            onChange={(v: string) => updateMandator('phone', v)} 
            placeholder="+56 9 ..."
            icon={Phone}
          />
          <InputField 
            label="Email" 
            value={data.mandator.email} 
            onChange={(v: string) => updateMandator('email', v)} 
            placeholder="juan@ejemplo.com"
            icon={Mail}
          />
          {data.pensionType !== 'SOBREVIVENCIA' && (
            <>
              <SelectField 
                label="AFP" 
                value={data.mandator.afp} 
                onChange={(v: string) => updateMandator('afp', v)} 
                options={CHILEAN_AFPS}
                icon={ShieldCheck}
              />
              <SelectField 
                label="Institución de Salud" 
                value={data.mandator.healthInstitution} 
                onChange={(v: string) => updateMandator('healthInstitution', v)} 
                options={HEALTH_INSTITUTIONS}
                icon={ShieldCheck}
              />
            </>
          )}
        </div>
      </section>

      {/* Causante (Solo para Sobrevivencia) */}
      {data.pensionType === 'SOBREVIVENCIA' && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <SectionTitle icon={User} title="Datos del Causante (Fallecido)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
              label="Nombre Completo del Causante" 
              value={data.affiliate?.fullName} 
              onChange={(v: string) => updateAffiliate('fullName', v)} 
              placeholder="Ej: Juan Pérez"
              icon={User}
            />
            <InputField 
              label="RUT del Causante" 
              value={data.affiliate?.rut} 
              onChange={(v: string) => updateAffiliate('rut', v)} 
              placeholder="12.345.678-9"
              icon={Hash}
              isRut={true}
            />
            <InputField 
              label="Fecha de Fallecimiento" 
              type="date"
              value={data.affiliate?.deathDate} 
              onChange={(v: string) => updateAffiliate('deathDate', v)} 
              icon={Calendar}
            />
            <SelectField 
              label="AFP del Causante" 
              value={data.affiliate?.afp} 
              onChange={(v: string) => updateAffiliate('afp', v)} 
              options={CHILEAN_AFPS}
              icon={ShieldCheck}
            />
          </div>
        </section>
      )}

      {/* Empleador (Ocultar para Sobrevivencia) */}
      {data.pensionType !== 'SOBREVIVENCIA' && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <SectionTitle icon={Briefcase} title="Datos del Empleador" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
              label="Nombre o Razón Social" 
              value={data.employer.name} 
              onChange={(v: string) => updateEmployer('name', v)} 
              placeholder="Ej: Empresa S.A."
              icon={Briefcase}
            />
            <InputField 
              label="RUT Empleador" 
              value={data.employer.rut} 
              onChange={(v: string) => updateEmployer('rut', v)} 
              placeholder="76.123.456-7"
              icon={Hash}
              isRut={true}
            />
            <InputField 
              label="Dirección" 
              value={data.employer.address} 
              onChange={(v: string) => updateEmployer('address', v)} 
              placeholder="Calle 123, Oficina 45"
              icon={MapPin}
            />
            <InputField 
              label="Teléfono" 
              value={data.employer.phone} 
              onChange={(v: string) => updateEmployer('phone', v)} 
              placeholder="+56 2 ..."
              icon={Phone}
            />
          </div>
        </section>
      )}

      {/* Beneficiarios */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
          <SectionTitle icon={Heart} title="Declaración de Beneficiarios" />
          <button 
            onClick={addBeneficiary}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-tight"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
        <div className="space-y-6">
          {data.beneficiaries.map((ben, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
              <button 
                onClick={() => removeBeneficiary(idx)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Nombre Completo" 
                  value={ben.fullName} 
                  onChange={(v: string) => updateBeneficiary(idx, 'fullName', v)} 
                />
                <InputField 
                  label="RUT" 
                  value={ben.rut} 
                  onChange={(v: string) => updateBeneficiary(idx, 'rut', v)} 
                  isRut={true}
                />
                <SelectField 
                  label="Sexo" 
                  value={ben.sex} 
                  onChange={(v: string) => updateBeneficiary(idx, 'sex', v)} 
                  options={['Masculino', 'Femenino']}
                />
                <SelectField 
                  label="Parentesco" 
                  value={ben.relationship} 
                  onChange={(v: string) => updateBeneficiary(idx, 'relationship', v)} 
                  options={[
                    'Hijo por nacer',
                    'Hijo nacido Inválido',
                    'Hijo nacido no inválido',
                    'Cónyuge',
                    'Madre/Padre hijo de filiación no matrimonial',
                    'Padres del Causante',
                    'Conviviente Civil'
                  ]}
                />
                <InputField 
                  label="Fecha de Nacimiento" 
                  type="date"
                  value={ben.birthDate} 
                  onChange={(v: string) => updateBeneficiary(idx, 'birthDate', v)} 
                />
                <SelectField 
                  label="¿Es Inválido?" 
                  value={ben.isInvalid ? 'SI' : 'NO'} 
                  onChange={(v: string) => updateBeneficiary(idx, 'isInvalid', v === 'SI')} 
                  options={['SI', 'NO']}
                />
                {ben.relationship === 'Cónyuge' && (
                  <>
                    <InputField 
                      label="Fecha de matrimonio" 
                      type="date"
                      value={ben.marriageDate} 
                      onChange={(v: string) => updateBeneficiary(idx, 'marriageDate', v)} 
                    />
                    <InputField 
                      label="Circunscripción" 
                      value={ben.circumscription} 
                      onChange={(v: string) => updateBeneficiary(idx, 'circumscription', v)} 
                    />
                  </>
                )}
                {ben.relationship === 'Conviviente Civil' && (
                  <>
                    <InputField 
                      label="Fecha de Acuerdo" 
                      type="date"
                      value={ben.agreementDate} 
                      onChange={(v: string) => updateBeneficiary(idx, 'agreementDate', v)} 
                    />
                    <InputField 
                      label="Circunscripción" 
                      value={ben.circumscription} 
                      onChange={(v: string) => updateBeneficiary(idx, 'circumscription', v)} 
                    />
                  </>
                )}
                {data.pensionType === 'SOBREVIVENCIA' && (
                  <>
                    <InputField 
                      label="Dirección" 
                      value={ben.address} 
                      onChange={(v: string) => updateBeneficiary(idx, 'address', v)} 
                      placeholder="Calle Falsa 123"
                    />
                    <InputField 
                      label="Comuna" 
                      value={ben.commune} 
                      onChange={(v: string) => updateBeneficiary(idx, 'commune', v)} 
                      placeholder="Santiago"
                    />
                    <InputField 
                      label="Teléfono" 
                      value={ben.phone} 
                      onChange={(v: string) => updateBeneficiary(idx, 'phone', v)} 
                      placeholder="+56 9 ..."
                    />
                    <InputField 
                      label="Email" 
                      value={ben.email} 
                      onChange={(v: string) => updateBeneficiary(idx, 'email', v)} 
                      placeholder="beneficiario@ejemplo.com"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
          {data.beneficiaries.length === 0 && (
            <p className="text-sm text-gray-400 italic text-center py-4">No se han agregado beneficiarios.</p>
          )}
        </div>
      </section>

      {/* Mandatario */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <SectionTitle icon={Briefcase} title="Datos del Mandatario (Asesor)" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField 
            label="Nombre Completo" 
            value={data.mandatory.fullName} 
            onChange={(v: string) => updateMandatory('fullName', v)} 
            placeholder="Ej: María González"
            icon={User}
          />
          <InputField 
            label="RUT" 
            value={data.mandatory.rut} 
            onChange={(v: string) => updateMandatory('rut', v)} 
            placeholder="9.876.543-2"
            icon={Hash}
            isRut={true}
          />
          <InputField 
            label="Nacionalidad" 
            value={data.mandatory.nationality} 
            onChange={(v: string) => updateMandatory('nationality', v)} 
            placeholder="Ej: Chilena"
            icon={MapPin}
          />
          <InputField 
            label="N° Registro Asesor (Opcional)" 
            value={data.mandatory.registrationNumber} 
            onChange={(v: string) => updateMandatory('registrationNumber', v)} 
            placeholder="1234"
            icon={ShieldCheck}
          />
          <InputField 
            label="Dirección" 
            value={data.mandatory.address} 
            onChange={(v: string) => updateMandatory('address', v)} 
            placeholder="Av. Providencia 100"
            icon={MapPin}
          />
          <InputField 
            label="Comuna" 
            value={data.mandatory.commune} 
            onChange={(v: string) => updateMandatory('commune', v)} 
            icon={MapPin}
          />
          <InputField 
            label="Ciudad" 
            value={data.mandatory.city} 
            onChange={(v: string) => updateMandatory('city', v)} 
            icon={MapPin}
          />
          <InputField 
            label="Teléfono" 
            value={data.mandatory.phone} 
            onChange={(v: string) => updateMandatory('phone', v)} 
            icon={Phone}
          />
          <InputField 
            label="Email (Opcional)" 
            value={data.mandatory.email} 
            onChange={(v: string) => updateMandatory('email', v)} 
            icon={Mail}
          />
        </div>
      </section>

      {/* Antecedentes */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <SectionTitle icon={Info} title="Antecedentes" />
        <div className="space-y-4">
          {Object.entries(data.pensionType === 'SOBREVIVENCIA' ? SURVIVORSHIP_BACKGROUND_LABELS : BACKGROUND_LABELS).map(([key, label]) => {
            if (key.endsWith('_header')) {
              return (
                <h3 key={key} className="text-xs font-black text-indigo-900 uppercase tracking-widest pt-4 border-b border-indigo-50 pb-1">
                  {label}
                </h3>
              );
            }

            const isInstitutionField = ['apvFinancing', 'apvcFinancing', 'agreedDeposits'].includes(key);
            const isCountryField = ['foreignContributions', 'foreignResidence'].includes(key);

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-xs text-gray-600 font-medium pr-4">{label}</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={(data.background as any)[key] === true}
                        onChange={() => updateBackground(key as keyof Background, true)}
                        className="w-3 h-3 text-indigo-600"
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Sí</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={(data.background as any)[key] === false}
                        onChange={() => updateBackground(key as keyof Background, false)}
                        className="w-3 h-3 text-indigo-600"
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">No</span>
                    </label>
                  </div>
                </div>
                
                {/* Extra fields for survivorship */}
                {data.pensionType === 'SOBREVIVENCIA' && (data.background as any)[key] === true && (
                  <div className="ml-4 pb-2">
                    {isInstitutionField && (
                      <InputField 
                        label="Nombre de la AFP o Institución autorizada"
                        value={(data.background as any)[`${key}Institution`]}
                        onChange={(v: string) => updateBackground(`${key}Institution` as any, v)}
                        placeholder="Ej: AFP Habitat"
                      />
                    )}
                    {isCountryField && (
                      <InputField 
                        label="País"
                        value={(data.background as any)[`${key}Country`]}
                        onChange={(v: string) => updateBackground(`${key}Country` as any, v)}
                        placeholder="Ej: España"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {data.pensionType !== 'SOBREVIVENCIA' && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <SelectField 
              label="Situación en que se encontraba el afiliado" 
              value={data.background.laborSituation} 
              onChange={(v: string) => updateBackground('laborSituation', v)} 
              options={[
                { value: 'DEPENDENT', label: 'Trabajador dependiente' },
                { value: 'UNEMPLOYED', label: 'Desempleado (< 12 meses)' },
                { value: 'INDEPENDENT', label: 'Trabajador independiente' },
                { value: 'VOLUNTARY', label: 'Afiliado voluntario' }
              ]}
            />
          </div>
        )}
      </section>

      {/* Facultades */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <SectionTitle icon={ShieldCheck} title="Autorizaciones" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {Object.entries(data.pensionType === 'SOBREVIVENCIA' ? SURVIVORSHIP_POWER_LABELS : POWER_LABELS).map(([key, label]) => {
            // Filter powers based on pension type if needed
            if (data.pensionType !== 'SOBREVIVENCIA') {
              if (key === 'invalidityQualification' && data.pensionType !== 'INVALIDEZ') return null;
              if (key === 'medicalBackground' && data.pensionType !== 'INVALIDEZ') return null;
            }
            
            return (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-xs text-gray-600 font-medium pr-4">{label}</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={(data.powers as any)[key] === true}
                      onChange={() => updatePowers(key as keyof MandatePowers, true)}
                      className="w-3 h-3 text-indigo-600"
                    />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Sí</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={(data.powers as any)[key] === false}
                      onChange={() => updatePowers(key as keyof MandatePowers, false)}
                      className="w-3 h-3 text-indigo-600"
                    />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">No</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <InputField 
            label="Otras facultades (opcional)" 
            value={data.powers.other} 
            onChange={(v: string) => updatePowers('other', v)} 
            placeholder="Especifique otras gestiones..."
          />
        </div>
      </section>

      {/* Lugar y Fecha */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <SectionTitle icon={MapPin} title="Lugar y Fecha" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField 
            label="Ciudad" 
            value={data.place} 
            onChange={(v: string) => onChange({ ...data, place: v })} 
            placeholder="Santiago"
          />
          <InputField 
            label="Fecha" 
            type="date"
            value={data.date} 
            onChange={(v: string) => onChange({ ...data, date: v })} 
          />
        </div>
      </section>
    </div>
  );
}
