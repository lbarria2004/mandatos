/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MandateData, PensionType, VejezType } from './types';
import MandateForm from './components/MandateForm';
import MandatePreview from './components/MandatePreview';
import { Bot, Send, Sparkles, Info, ChevronRight, CheckCircle2, ShieldCheck, ArrowLeft, UserCheck, Activity, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

const createInitialData = (type: PensionType, vejezType?: VejezType): MandateData => ({
  pensionType: type,
  vejezType: vejezType,
  mandator: {
    fullName: '',
    rut: '',
    address: '',
    commune: '',
    phone: '',
    email: '',
    afp: ''
  },
  mandatory: {
    fullName: '',
    rut: '',
    registrationNumber: '',
    address: '',
    commune: '',
    city: '',
    phone: '',
    email: ''
  },
  beneficiaries: [],
  background: {
    preliminaryPension: false,
    apsRequest: false,
    oldSystemPension: false,
    invalidityPensionThisSystem: false,
    minimumPensionAdjustment: false,
    basicSolidaryPensionAdjustment: false,
    statuteAffected: false,
    apvFinancing: false,
    apvcFinancing: false,
    cavFinancing: false,
    agreedDeposits: false,
    unemploymentInsuranceFinancing: false,
    foreignContributions: false,
    foreignResidence: false,
    fundTypeChange: false,
    publicInformationList: false,
    laborSituation: '',
    laborSituation_DEPENDENT: false,
    laborSituation_UNEMPLOYED: false,
    laborSituation_INDEPENDENT: false,
    laborSituation_VOLUNTARY: false,
    apvFinancingInstitution: '',
    apvcFinancingInstitution: '',
    agreedDepositsInstitution: '',
    foreignContributionsCountry: '',
    foreignResidenceCountry: ''
  },
  powers: {
    bonoReconocimiento: false,
    statusInformation: true,
    balanceCertificate: true,
    voluntaryContributionsForm: false,
    cavTransferForm: false,
    apvSelectionForm: false,
    modalityChange: false,
    surplusCalculation: false,
    nominalValueMaintenance: false,
    invalidityQualification: type === 'INVALIDEZ',
    medicalBackground: type === 'INVALIDEZ',
    childInvalidityQualification: false,
    other: ''
  },
  employer: {
    name: '',
    rut: '',
    address: '',
    phone: ''
  },
  affiliate: type === 'SOBREVIVENCIA' ? {
    fullName: '',
    rut: '',
    deathDate: '',
    afp: ''
  } : undefined,
  date: new Date().toISOString().split('T')[0],
  place: ''
});

export default function App() {
  const [data, setData] = useState<MandateData | null>(null);
  const [selectionStep, setSelectionStep] = useState<'TYPE' | 'VEJEZ_TYPE' | 'FORM'>('TYPE');
  const [selectedType, setSelectedType] = useState<PensionType | null>(null);
  
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: '¡Hola! Soy tu asistente previsional. He sido actualizado para ayudarte con mandatos de Vejez, Invalidez y Sobrevivencia. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeSelect = (type: PensionType) => {
    setSelectedType(type);
    if (type === 'VEJEZ') {
      setSelectionStep('VEJEZ_TYPE');
    } else {
      setData(createInitialData(type));
      setSelectionStep('FORM');
    }
  };

  const handleVejezTypeSelect = (vType: VejezType) => {
    setData(createInitialData('VEJEZ', vType));
    setSelectionStep('FORM');
  };

  const handleBack = () => {
    if (selectionStep === 'VEJEZ_TYPE') setSelectionStep('TYPE');
    else if (selectionStep === 'FORM') {
      if (selectedType === 'VEJEZ') setSelectionStep('VEJEZ_TYPE');
      else setSelectionStep('TYPE');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: 'user',
            parts: [{ text: `Actúa como un experto asesor previsional chileno. El usuario está llenando un mandato de ${data?.pensionType}. 
            Datos actuales del formulario: ${JSON.stringify(data)}
            Pregunta del usuario: ${userMessage}` }]
          }
        ]
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.text || 'Lo siento, no pude procesar tu solicitud.' }]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Hubo un error al conectar con el asistente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Mandatos Previsionales IA</h1>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Generador Inteligente</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {selectionStep === 'FORM' && (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
            )}
            <button 
              onClick={() => setIsAssistantOpen(!isAssistantOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isAssistantOpen 
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Bot className="w-4 h-4" />
              {isAssistantOpen ? 'Cerrar' : 'Asistente IA'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {selectionStep === 'TYPE' && (
            <motion.div 
              key="type-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto text-center space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Seleccione el tipo de trámite</h2>
                <p className="text-slate-500 text-lg">Elija el formulario de mandato que desea generar según su necesidad previsional.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'VEJEZ', label: 'Pensión de Vejez', icon: UserCheck, color: 'bg-blue-600' },
                  { id: 'INVALIDEZ', label: 'Pensión de Invalidez', icon: Activity, color: 'bg-emerald-600' },
                  { id: 'SOBREVIVENCIA', label: 'Pensión de Sobrevivencia', icon: Users, color: 'bg-purple-600' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTypeSelect(item.id as PensionType)}
                    className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 transition-all flex flex-col items-center gap-6"
                  >
                    <div className={`${item.color} p-5 rounded-2xl text-white group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <span className="text-xl font-bold text-slate-800">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {selectionStep === 'VEJEZ_TYPE' && (
            <motion.div 
              key="vejez-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto text-center space-y-12"
            >
              <div className="space-y-4">
                <button onClick={handleBack} className="text-indigo-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mx-auto hover:underline">
                  <ArrowLeft className="w-3 h-3" /> Volver atrás
                </button>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tipo de Pensión de Vejez</h2>
                <p className="text-slate-500">Especifique si la pensión es por cumplimiento de edad o anticipada.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { id: 'EDAD', label: 'Vejez por Edad' },
                  { id: 'ANTICIPADA', label: 'Vejez Anticipada' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleVejezTypeSelect(item.id as VejezType)}
                    className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all text-xl font-bold text-slate-800"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {selectionStep === 'FORM' && data && (
            <motion.div 
              key="form-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Formulario Activo</span>
                    </div>
                    <h2 className="text-3xl font-black mb-2">
                      Mandato {data.pensionType === 'VEJEZ' ? `Vejez ${data.vejezType === 'EDAD' ? 'Edad' : 'Anticipada'}` : data.pensionType}
                    </h2>
                    <p className="text-indigo-100 text-sm max-w-md">
                      Complete los datos requeridos. La vista previa se actualizará automáticamente.
                    </p>
                  </div>
                  <Sparkles className="absolute -right-4 -bottom-4 w-40 h-40 text-white/10 rotate-12" />
                </div>
                
                <MandateForm data={data} onChange={setData} />
              </div>

              <div className="lg:col-span-5">
                <MandatePreview data={data} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Assistant Drawer */}
      <AnimatePresence>
        {isAssistantOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssistantOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2 rounded-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Asistente Previsional</h3>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">En línea</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAssistantOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-700 rounded-tl-none'
                    }`}>
                      <div className="markdown-body prose prose-sm prose-slate max-w-none">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="relative">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pregunta sobre el mandato..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
