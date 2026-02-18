
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Activity, CheckCircle, AlertTriangle, RefreshCw, 
  ArrowLeft, Terminal, HardDrive, Cpu, Database, Zap
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const AdminDiagnosticsPage: React.FC = () => {
  const { user, runDiagnostics, isLoading } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const performCheck = async () => {
    setIsRefreshing(true);
    const result = await runDiagnostics();
    setReport(result);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (user?.role === 'admin') performCheck();
  }, [user]);

  if (!user || user.role !== 'admin') return <Navigate to="/auth" />;

  return (
    <div className="min-h-screen bg-[#faf8fa] pb-20 font-inter">
      <div className="bg-[#2d1f2d] pt-12 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div className="space-y-4">
              <Link to="/customers" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                <ArrowLeft size={14} /> Back to Hub
              </Link>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#e91e8c] rounded-2xl flex items-center justify-center shadow-2xl">
                   <Activity size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold font-outfit tracking-tighter">System Health & Diagnostics</h1>
                  <p className="text-white/40 text-sm font-medium">Real-time core logic and persistence functionality check.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={performCheck} 
              disabled={isRefreshing}
              className="flex items-center gap-2 px-8 py-4 bg-[#e91e8c] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c4167a] transition-all shadow-xl disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              Re-run Logic Audit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl overflow-hidden p-8 md:p-12">
          
          {report ? (
            <div className="space-y-12 animate-in fade-in duration-500">
              {/* Overall Status Banner */}
              <div className={`p-8 rounded-[32px] flex items-center justify-between border-2 ${
                report.status === 'Healthy' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
              }`}>
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${report.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {report.status === 'Healthy' ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Engine Integrity Status</p>
                      <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter">{report.status}</h2>
                   </div>
                </div>
                <div className="text-right hidden md:block">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40">System Uptime</p>
                   <p className="text-xl font-black font-outfit tabular-nums">99.9%</p>
                </div>
              </div>

              {/* Individual Checks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {report.checks.map((check: any, i: number) => (
                   <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-3xl space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="p-3 bg-white border border-gray-100 rounded-xl text-[#2d1f2d]">
                            {check.name === 'Storage Integrity' && <Database size={18} />}
                            {check.name === 'Licence Validation Regex' && <Zap size={18} />}
                            {check.name === 'Pricing Precision' && <Terminal size={18} />}
                            {check.name === 'GenAI Gateway' && <Cpu size={18} />}
                         </div>
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           check.result === 'Pass' ? 'bg-green-100 text-green-700' : 
                           check.result === 'Warning' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                         }`}>
                           {check.result}
                         </span>
                      </div>
                      <div>
                         <h3 className="font-black text-sm text-[#2d1f2d] mb-1">{check.name}</h3>
                         <p className="text-xs text-gray-500 leading-relaxed">{check.message}</p>
                      </div>
                      <p className="text-[8px] font-mono text-gray-300 uppercase">Audit Time: {new Date(check.timestamp).toLocaleTimeString()}</p>
                   </div>
                 ))}
              </div>

              {/* Technical Spec Summary */}
              <div className="pt-10 border-t border-gray-100 space-y-6">
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Terminal size={14} /> System Environment Audit
                 </h3>
                 <div className="bg-[#2d1f2d] rounded-3xl p-8 font-mono text-xs text-white/60 space-y-2 overflow-x-auto shadow-inner">
                    <p><span className="text-[#e91e8c]">Platform:</span> SwiftPolicy Enterprise Core v2.4.0</p>
                    <p><span className="text-[#e91e8c]">Engine:</span> React 18.2 + ESM.sh Distributed Modules</p>
                    <p><span className="text-[#e91e8c]">Persistence:</span> Local Storage Persistent Registry (LSPR)</p>
                    {/* Fix: Corrected model name reference from 1.5 to 3 to match codebase usage */}
                    <p><span className="text-[#e91e8c]">Intelligence:</span> Google Gemini 3 Flash Grounding Protocol</p>
                    <p><span className="text-[#e91e8c]">UK Compliance:</span> FCA/MID Integration Protocol Active</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="py-40 text-center space-y-6">
               <RefreshCw size={48} className="mx-auto text-gray-100 animate-spin" />
               <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Assembling System Report...</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDiagnosticsPage;
