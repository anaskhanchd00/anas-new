
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, ShieldCheck, Shield, Lock, Users, Trash2, Ban, Pause, Play, 
  Terminal, Activity, Search, Eye, X, Filter, FileText, Banknote, 
  Car, Bike, Truck, RefreshCw, AlertCircle, TrendingUp, MoreVertical,
  ChevronRight, ReceiptText, Printer, Download, CreditCard, ExternalLink,
  Snowflake, History, Landmark, Gavel, UserX, Inbox, MessageSquare, CheckCircle, Mail,
  AlertTriangle, Hammer, ClipboardList, Flag, CheckCircle2, RotateCcw,
  Settings, Phone, EyeOff, UserPlus, Fingerprint, RefreshCcw, ShieldX, Database,
  ArrowUpRight, ArrowRight, AlertOctagon, FileDown, Plus, Info, Zap, Clock, Loader2,
  Code, FileJson, Copy, HeartPulse, HardDrive, Beaker, FileSearch, Edit3, Briefcase,
  CalendarDays, Settings2, ShieldQuestion, UserCog, ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { User, Policy, MIDSubmission, PolicyStatus } from '../types';

// TOOLTIP COMPONENT (Lightweight Wrapper)
const ActionButton = ({ onClick, icon, tooltip, colorClass, disabled }: any) => (
  <div className="relative group">
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`p-2.5 rounded-xl transition-all shadow-sm disabled:opacity-30 ${colorClass}`}
    >
      {icon}
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#2d1f2d] text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-all duration-200 z-[100] translate-y-1 group-hover:translate-y-0 shadow-2xl border border-white/10">
      {tooltip}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#2d1f2d]" />
    </div>
  </div>
);

// POLICY INTELLIGENCE PANEL (Slide-over Detail View)
const PolicyIntelligencePanel = ({ policy, onClose, getCustomerName, onStatusUpdate }: { 
  policy: Policy; 
  onClose: () => void; 
  getCustomerName: (id: string) => string;
  onStatusUpdate: (id: string, status: PolicyStatus, reason: string) => void;
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-[#2d1f2d]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="bg-[#e91e8c]/10 p-3 rounded-2xl text-[#e91e8c]">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-bold font-outfit tracking-tighter">Policy Intelligence</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Registry Ref: {policy.id}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-10">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <p className="font-bold text-[#2d1f2d] flex items-center gap-2">
                   <span className={`w-2 h-2 rounded-full ${policy.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                   {policy.status}
                </p>
             </div>
             <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Holder Identity</p>
                <p className="font-bold text-[#2d1f2d] truncate">{getCustomerName(policy.userId)}</p>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
               <Car size={14} /> Risk Asset Verification
            </h3>
            <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm grid grid-cols-2 gap-8">
               <div className="col-span-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Registration</p>
                  <p className="text-2xl font-black font-outfit uppercase tracking-tighter text-[#2d1f2d]">{policy.details?.vrm || 'N/A'}</p>
               </div>
               <div className="col-span-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Specification</p>
                  <p className="text-lg font-bold text-[#2d1f2d]">{policy.details?.make} {policy.details?.model}</p>
               </div>
               
               {/* Technical Specs Layer */}
               <div className="col-span-2 grid grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">VIN / Chassis</p>
                    <p className="text-xs font-mono font-bold text-gray-600">{policy.details?.vin || 'NOT_CAPTURED'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Technical Spec</p>
                    <p className="text-xs font-bold">{policy.details?.engineSize} {policy.details?.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Paintwork</p>
                    <p className="text-xs font-bold">{policy.details?.color || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Excess</p>
                    <p className="text-xs font-bold">{policy.details?.excess || '£250'}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
               <Fingerprint size={14} /> Underwriting Metadata
            </h3>
            <div className="p-8 bg-[#2d1f2d] rounded-[32px] text-white/80 space-y-6">
               <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Licence Number</span>
                  <span className="text-sm font-mono font-bold text-[#e91e8c]">{policy.details?.licenceNumber || 'NOT_FOUND'}</span>
               </div>
               <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Cover Level</span>
                  <span className="text-sm font-bold">{policy.details?.coverLevel || 'Comprehensive'}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Binding Date</span>
                  <span className="text-sm font-bold">{policy.validatedAt ? new Date(policy.validatedAt).toLocaleString() : 'N/A'}</span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
               <Code size={14} /> Technical Audit Payload
            </h3>
            <div className="bg-gray-900 p-6 rounded-3xl overflow-x-auto">
               <pre className="text-[10px] font-mono text-green-400 leading-relaxed">
                 {JSON.stringify(policy, null, 2)}
               </pre>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100 flex flex-wrap gap-4">
            <button 
              onClick={() => onStatusUpdate(policy.id, 'Active', 'Admin Deep Audit Resume')}
              className="flex-1 py-4 bg-[#e91e8c] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#c4167a] transition-all"
            >
              <Play size={14} /> Resume Coverage
            </button>
            <button 
              onClick={() => onStatusUpdate(policy.id, 'Blocked', 'Admin Deep Audit Hold')}
              className="flex-1 py-4 border-2 border-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
            >
              <ShieldAlert size={14} /> Flag Risk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerCenterPage: React.FC = () => {
  const { 
    user, isLoading, logout, users, policies,
    runDiagnostics, testRegistrationFlow, updatePolicyStatus, deletePolicy, refreshData
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardView, setDashboardView] = useState<'summary' | 'active-feed'>('summary');
  const [isScanning, setIsScanning] = useState(false);
  const [isTestingReg, setIsTestingReg] = useState(false);
  const [diagReport, setDiagReport] = useState<any>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [policySearch, setPolicySearch] = useState('');
  const [viewingPolicy, setViewingPolicy] = useState<Policy | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const isAdmin = user?.role === 'admin';

  const getCustomerName = useCallback((userId: string) => {
    const u = users.find(u => u.id === userId);
    return u ? u.name : 'Unknown Account';
  }, [users]);

  const activePolicies = useMemo(() => {
    return policies.filter(p => p.status === 'Active');
  }, [policies]);

  const filteredPolicies = useMemo(() => {
    let list = [...policies];
    if (!isAdmin && user) {
      list = list.filter(p => p.userId === user.id && p.status !== 'Removed');
    }
    if (policySearch) {
      const s = policySearch.toLowerCase();
      list = list.filter(p => {
        const userName = getCustomerName(p.userId).toLowerCase();
        return p.id.toLowerCase().includes(s) || 
               p.details?.vrm?.toLowerCase().includes(s) ||
               userName.includes(s);
      });
    }
    if (statusFilter !== 'All') {
      const mapped = statusFilter === 'Pending' ? 'Pending Validation' : statusFilter;
      list = list.filter(p => p.status === mapped);
    }
    if (typeFilter !== 'All') {
      list = list.filter(p => p.type.toLowerCase().includes(typeFilter.toLowerCase()));
    }
    return list;
  }, [policies, policySearch, statusFilter, typeFilter, isAdmin, user, getCustomerName]);

  const totalPages = Math.ceil(filteredPolicies.length / pageSize);
  const paginatedPolicies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPolicies.slice(start, start + pageSize);
  }, [filteredPolicies, currentPage]);

  const handleDownloadPDF = useCallback((policy: Policy) => {
    if (policy.status === 'Removed') return;
    if (!policy.pdfUrl) return;
    try {
      const link = document.createElement('a');
      link.href = policy.pdfUrl;
      link.setAttribute('download', `SwiftPolicy_${policy.id}_${policy.details?.vrm || 'Document'}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("PDF RECOVERY ERROR:", err);
    }
  }, []);

  const handleRunScan = async () => {
    setIsScanning(true);
    const report = await runDiagnostics();
    setDiagReport(report);
    setIsScanning(false);
  };

  const handleTestRegistration = async () => {
    setIsTestingReg(true);
    setTestResult(null);
    const result = await testRegistrationFlow();
    setTestResult(result);
    setIsTestingReg(false);
  };

  const getStatusBadge = (status: PolicyStatus) => {
    switch (status) {
      case 'Active': return <span className="px-3 py-1 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>;
      case 'Frozen': return <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Frozen</span>;
      case 'Blocked': return <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Blocked</span>;
      case 'Validated': return <span className="px-3 py-1 bg-indigo-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Validated</span>;
      case 'Removed': return <span className="px-3 py-1 bg-gray-400 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Removed</span>;
      case 'Pending Validation': return <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Pending</span>;
      default: return <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">{status}</span>;
    }
  };

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="min-h-screen bg-[#faf8fa] pb-20 font-inter text-[#2d1f2d]">
      <div className="absolute top-0 left-0 w-full h-[350px] bg-[#2d1f2d] z-0" />
      <div className="relative z-10 pt-16 max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
               {isAdmin ? <Terminal className="text-[#e91e8c]" size={28} /> : <div className="text-2xl font-black text-[#e91e8c] font-outfit">{user.name.charAt(0)}</div>}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white font-outfit tracking-tighter">{isAdmin ? 'SwiftPanel Control' : 'My Dashboard'}</h1>
              <p className="text-white/50 text-sm">{user.email} • <span className="uppercase tracking-widest font-black text-[#e91e8c] text-[10px]">{user.role}</span></p>
            </div>
          </div>
          <button onClick={logout} className="px-8 py-3 bg-white text-[#2d1f2d] rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-gray-100 transition-all">Sign Out</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1 space-y-3">
            {[
              { id: 'dashboard', label: 'Overview', icon: <TrendingUp size={18} /> },
              ...(isAdmin ? [
                { id: 'policies', label: 'Admin Policies', icon: <ShieldCheck size={18} /> },
                { id: 'identities', label: 'Identity Vault', icon: <UserCog size={18} /> },
                { id: 'diagnostics', label: 'System Integrity', icon: <HeartPulse size={18} /> }
              ] : [
                { id: 'my-policies', label: 'My Policies', icon: <ShieldCheck size={18} /> }
              ])
            ].map((item: any) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); setDashboardView('summary'); setCurrentPage(1); }} 
                className={`w-full flex items-center gap-4 px-8 py-5 rounded-2xl font-black text-xs transition-all text-left uppercase tracking-widest ${
                  activeTab === item.id ? 'bg-[#e91e8c] text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-white/40'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-12 rounded-[56px] border border-gray-100 shadow-2xl min-h-[700px]">
              
              {activeTab === 'dashboard' && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold font-outfit">{isAdmin ? 'Live Operations Feed' : 'Policy Register'}</h2>
                  </div>

                  {isAdmin ? (
                    dashboardView === 'summary' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                        <button onClick={() => setDashboardView('active-feed')} className="p-10 bg-[#2d1f2d] rounded-[40px] text-white text-left hover:scale-[1.02] transition-transform shadow-xl">
                          <ShieldCheck className="text-[#e91e8c] mb-6" size={32} />
                          <p className="text-6xl font-black font-outfit">{activePolicies.length}</p>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-2">Active Registrations</p>
                        </button>
                        <button onClick={() => setActiveTab('policies')} className="p-10 bg-gray-50 border border-gray-100 rounded-[40px] text-left hover:scale-[1.02] transition-transform shadow-sm">
                          <Users className="text-green-500 mb-6" size={32} />
                          <p className="text-6xl font-black font-outfit">{policies.filter(p => p.status !== 'Removed').length}</p>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">Total Underwritten</p>
                        </button>
                      </div>
                    ) : (
                      <div className="animate-in slide-in-from-right-8 duration-500">
                         <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Ref</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Policyholder</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {activePolicies.map(p => (
                                <tr key={p.id} onClick={() => setViewingPolicy(p)} className="hover:bg-gray-50/50 cursor-pointer">
                                  <td className="px-6 py-5"><span className="text-xs font-black font-mono">{p.id}</span></td>
                                  <td className="px-6 py-5"><span className="text-sm font-bold">{getCustomerName(p.userId)}</span></td>
                                  <td className="px-6 py-5">
                                     <div className="flex flex-col">
                                       <span className="text-xs font-black uppercase">{p.details?.vrm}</span>
                                       <span className="text-[10px] text-gray-400">{p.details?.make} {p.details?.model}</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-5">{getStatusBadge(p.status)}</td>
                                  <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                                    <ActionButton onClick={() => setViewingPolicy(p)} icon={<Eye size={16} />} tooltip="View Intelligence" colorClass="bg-white border border-gray-100" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                         </div>
                      </div>
                    )
                  ) : (
                    <div className="space-y-8">
                       {filteredPolicies.map(p => (
                          <div key={p.id} className="p-8 bg-gray-50 border border-gray-100 rounded-[40px] shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                              <div>
                                <h3 className="text-3xl font-bold font-outfit uppercase tracking-tighter mb-2">{p.details?.vrm}</h3>
                                {getStatusBadge(p.status)}
                              </div>
                              <div className="md:text-right">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Premium</p>
                                <p className="text-3xl font-black text-[#2d1f2d]">£{p.premium}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
                               <div className="space-y-1">
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Technical Spec</p>
                                  <p className="text-xs font-bold uppercase">{p.details?.engineSize} {p.details?.fuelType}</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Color</p>
                                  <p className="text-xs font-bold uppercase">{p.details?.color || 'N/A'}</p>
                               </div>
                               <div className="flex justify-end items-center gap-3 col-span-2">
                                  <button onClick={() => handleDownloadPDF(p)} className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#e91e8c] rounded-xl"><Download size={18}/></button>
                               </div>
                            </div>
                          </div>
                       ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'policies' && isAdmin && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-3xl font-bold font-outfit mb-8">Policy Administration</h2>
                  <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Ref</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">VIN</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paginatedPolicies.map(p => (
                          <tr key={p.id} onClick={() => setViewingPolicy(p)} className="hover:bg-gray-50/50 cursor-pointer">
                            <td className="px-6 py-5"><span className="text-xs font-mono">{p.id}</span></td>
                            <td className="px-6 py-5">
                               <div className="flex flex-col">
                                 <span className="text-xs font-black uppercase">{p.details?.vrm}</span>
                                 <span className="text-[10px] text-gray-400">{p.details?.make} {p.details?.model}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5"><span className="text-[10px] font-mono text-gray-400">{p.details?.vin || 'N/A'}</span></td>
                            <td className="px-6 py-5">{getStatusBadge(p.status)}</td>
                            <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                               <ActionButton onClick={() => setViewingPolicy(p)} icon={<Eye size={16} />} tooltip="View Intelligence" colorClass="bg-white" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {viewingPolicy && isAdmin && (
        <PolicyIntelligencePanel 
          policy={viewingPolicy} 
          onClose={() => setViewingPolicy(null)} 
          getCustomerName={getCustomerName}
          onStatusUpdate={(id, status, reason) => {
            updatePolicyStatus(id, status, reason);
            setViewingPolicy(policies.find(p => p.id === id) || null);
          }}
        />
      )}
    </div>
  );
};

export default CustomerCenterPage;
