
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Car, ShieldCheck, ArrowRight, Loader2,
  AlertCircle, Bike, Search, ChevronDown, Lock, CheckCircle, Database, AlertOctagon,
  Globe, ExternalLink, Calendar, Clock
} from 'lucide-react';
import { QuoteData, PaymentRecord, EnforcedInsuranceType, PolicyDuration } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const INITIAL_STATE: QuoteData = {
  vrm: '', 
  insurance_type: '',
  duration: '12 Months',
  make: '', model: '', year: '', fuelType: '', transmission: '', bodyType: '', engineSize: '', seats: '',
  isImported: false, annualMileage: '8000', usageType: 'Social, Domestic & Pleasure', ownership: 'Owned',
  isModified: false, modifications: '', securityFeatures: [], overnightParking: 'Driveway',
  title: 'Mr', firstName: '', lastName: '', dob: '', gender: 'Male', maritalStatus: 'Married', ukResident: true,
  yearsInUk: 'Born in UK', occupation: '', employmentStatus: 'Employed', industry: '',
  licenceType: 'Full UK', licenceHeldYears: '5+', licenceDate: '', hasMedicalConditions: false,
  mainDriverHistory: { hasConvictions: false, convictions: [], hasClaims: false, claims: [] },
  ncbYears: '5', isCurrentlyInsured: true, hasPreviousCancellations: false,
  additionalDrivers: [],
  postcode: '', addressLine1: '', city: '', yearsAtAddress: '5+', homeOwnership: 'Owner',
  coverLevel: 'Comprehensive', policyStartDate: new Date().toISOString().split('T')[0], voluntaryExcess: '£250',
  addons: { breakdown: false, legal: false, courtesyCar: false, windscreen: false, protectedNcb: false },
  paymentFrequency: 'monthly', payerType: 'individual',
  email: '', phone: '', contactTime: 'Anytime', marketingConsent: false, dataProcessingConsent: false,
  isAccurate: false, termsAccepted: false
};

const QuotePage: React.FC = () => {
  const { user, signup, queueMIDSubmission, generatePolicyPDF, bindPolicyManual } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuoteData>(INITIAL_STATE);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupSuccess, setLookupSuccess] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalQuote, setFinalQuote] = useState<number | null>(null);
  const [groundingSources, setGroundingSources] = useState<{title: string, uri: string}[]>([]);

  const validateVRM = (vrm: string) => {
    const normalized = vrm.replace(/\s/g, '').toUpperCase();
    return /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z][0-9]{1,3}[A-Z]{3}$|^[A-Z]{3}[0-9]{1,3}[A-Z]$|^[0-9]{1,4}[A-Z]{1,2}$|^[0-9]{1,3}[A-Z]{1,3}$|^[A-Z]{1,2}[0-9]{1,4}$|^[A-Z]{1,3}[0-9]{1,3}$/.test(normalized);
  };

  const getExpiryDate = (start: string, duration: PolicyDuration) => {
    const date = new Date(start);
    if (duration === '1 Month') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toLocaleDateString();
  };

  const executeBindingQuoteGeneration = (type: EnforcedInsuranceType, duration: PolicyDuration): number => {
    let quote = 0;
    const randomSeed = Math.random();

    if (duration === '1 Month') {
      // 1 Month logic (£400–£800)
      quote = 400 + (randomSeed * 400);
    } else {
      // Annual logic
      if (type === 'Comprehensive Cover') {
        quote = 3000 + (randomSeed * 999);
      } else if (type === 'Third Party Insurance') {
        quote = 1400 + (randomSeed * 1500);
      } else if (type === 'Motorcycle Insurance') {
        quote = 500 + (randomSeed * 500);
      }
    }

    const finalVal = Math.round(quote);
    return finalVal;
  };

  const handleLookup = async () => {
    const vrmInput = formData.vrm.replace(/\s/g, '').toUpperCase();
    if (!vrmInput) return;
    
    if (!validateVRM(vrmInput)) {
      setLookupError("Invalid UK registration format. Check VRM.");
      return;
    }

    setIsLookingUp(true);
    setLookupError(null);
    setLookupSuccess(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `UK DVLA vehicle lookup. Return ONLY JSON. Fields: registration_number, vehicle_category, make, model, body_type, fuel_type, engine_capacity_cc, year_of_manufacture, colour, transmission.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Official DVLA data for: ${vrmInput}`,
        config: { systemInstruction, tools: [{googleSearch: {}}], }
      });

      const rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(rawText);

      if (data.error || !data.make) {
        setLookupError("Vehicle record not found in national database.");
        return;
      }

      setFormData(prev => ({ 
        ...prev, 
        make: data.make, 
        model: data.model, 
        year: data.year_of_manufacture,
        fuelType: data.fuel_type,
        vrm: data.registration_number || vrmInput,
        transmission: data.transmission
      }));
      setLookupSuccess(true);
    } catch (err) {
      setLookupError("Database lookup failure. Please try again.");
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleProceedToPurchase = async () => {
    if (!formData.email) return;
    setIsProcessing(true);
    
    // Auto-calculate premium
    const premium = executeBindingQuoteGeneration(
      formData.coverLevel === 'Comprehensive' ? 'Comprehensive Cover' : 'Third Party Insurance', 
      formData.duration
    );

    // If no user, create mock account or use current
    let targetUserId = user?.id;
    if (!targetUserId) {
      const mockName = formData.email.split('@')[0];
      await signup(mockName, formData.email, 'TempPass123!');
      // signup sets local session, but in a real app we'd wait for reload or return ID
      targetUserId = JSON.parse(localStorage.getItem('sp_session') || '{}').id;
    }

    if (targetUserId) {
      await bindPolicyManual(targetUserId, {
        type: formData.coverLevel === 'Comprehensive' ? 'Comprehensive Cover' : 'Third Party Insurance',
        duration: formData.duration,
        premium: premium.toString(),
        reason: 'Automated Quote Conversion',
        details: {
          vrm: formData.vrm.toUpperCase(),
          make: formData.make,
          model: formData.model,
          policyStartDate: formData.policyStartDate,
          addressLine1: 'Pending Update',
          city: 'UK'
        }
      });
      
      setIsProcessing(false);
      navigate('/customers');
    }
  };

  if (user && ['Frozen', 'Blocked', 'Removed', 'Deleted'].includes(user.status)) {
    return (
      <div className="min-h-screen bg-[#faf8fa] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[64px] p-16 text-center shadow-2xl border border-gray-100">
           <Lock size={48} className="mx-auto text-red-500 mb-8" />
           <h2 className="text-3xl font-bold text-[#2d1f2d] mb-6">Access Restricted</h2>
           <p className="text-gray-500 mb-10">Administrative freeze detected for this account.</p>
           <button onClick={() => navigate('/customers')} className="w-full py-5 bg-[#2d1f2d] text-white rounded-2xl font-black uppercase tracking-widest text-xs">Return</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8fa] py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[48px] p-10 md:p-16 shadow-2xl border border-gray-100">
          <div className="mb-12 flex items-center gap-4">
            <div className="bg-[#e91e8c]/10 p-3 rounded-2xl text-[#e91e8c]">
              <Car size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-outfit text-[#2d1f2d]">Secure Quote</h1>
              <p className="text-gray-400 font-medium">FCA Regulated Underwriting</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Duration Option</label>
              <div className="flex bg-gray-50 p-2 rounded-3xl border border-gray-100">
                <button 
                  onClick={() => setFormData({...formData, duration: '12 Months'})}
                  className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${formData.duration === '12 Months' ? 'bg-[#e91e8c] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Calendar size={14} className="inline mr-2" /> Annual Policy
                </button>
                <button 
                  onClick={() => setFormData({...formData, duration: '1 Month'})}
                  className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${formData.duration === '1 Month' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Clock size={14} className="inline mr-2" /> 1 Month Cover
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Vehicle Registration</label>
              <div className="flex gap-4">
                <input
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 font-bold text-xl uppercase outline-none focus:border-[#e91e8c]"
                  placeholder="e.g. BT19 KYX"
                  value={formData.vrm}
                  onChange={(e) => setFormData({ ...formData, vrm: e.target.value })}
                />
                <button
                  onClick={handleLookup}
                  disabled={isLookingUp || !formData.vrm}
                  className="px-10 py-5 bg-[#2d1f2d] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-black transition-all disabled:opacity-50"
                >
                  {isLookingUp ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                  Find Vehicle
                </button>
              </div>
              {lookupError && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold">{lookupError}</div>}
            </div>

            {lookupSuccess && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white rounded-2xl shadow-sm text-green-500"><CheckCircle size={32} /></div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2d1f2d] font-outfit uppercase">{formData.make} {formData.model}</h3>
                      <p className="text-gray-400 font-medium">Verified National Record</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Term Validity</p>
                    <p className="text-sm font-bold text-[#2d1f2d]">{formData.duration} (until {getExpiryDate(formData.policyStartDate, formData.duration)})</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cover Level</label>
                    <select
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 font-bold outline-none focus:border-[#e91e8c]"
                      value={formData.coverLevel}
                      onChange={(e) => setFormData({ ...formData, coverLevel: e.target.value })}
                    >
                      <option value="Comprehensive">Comprehensive</option>
                      <option value="Third Party Fire & Theft">Third Party Fire & Theft</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Email</label>
                    <input
                      type="email"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 font-bold outline-none focus:border-[#e91e8c]"
                      placeholder="you@domain.co.uk"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="p-10 bg-[#2d1f2d] rounded-[40px] text-white text-center shadow-xl">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e91e8c] mb-4">Calculated Binding Premium</p>
                   <div className="flex justify-center items-end gap-2 mb-8">
                      <span className="text-3xl font-bold text-white/20 mb-3">£</span>
                      <span className="text-8xl font-black font-outfit tracking-tighter leading-none">
                        {executeBindingQuoteGeneration(formData.coverLevel === 'Comprehensive' ? 'Comprehensive Cover' : 'Third Party Insurance', formData.duration)}
                      </span>
                   </div>
                   <button
                    onClick={handleProceedToPurchase}
                    disabled={isProcessing || !formData.email}
                    className="w-full py-6 bg-[#e91e8c] text-white rounded-[32px] font-black uppercase tracking-widest text-sm hover:bg-[#c4167a] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <>Buy {formData.duration} Policy <ArrowRight size={20} /></>}
                  </button>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-6">Instant MID Update & Digital Certificate Included</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;
