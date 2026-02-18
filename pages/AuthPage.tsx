import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Shield, ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle2, KeyRound, Loader2, Eye, EyeOff, Phone, Calendar, MapPin } from 'lucide-react';

interface AuthErrors {
  [key: string]: string;
}

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('reset');
  const isAdminParam = searchParams.get('admin') === 'true';
  const modeParam = searchParams.get('mode');
  
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'reset'>(
    resetToken ? 'reset' : (modeParam === 'signup' ? 'signup' : 'login')
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  
  const [formErrors, setFormErrors] = useState<AuthErrors>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user, adminUser, login, signup, requestPasswordReset, resetPasswordWithToken } = useAuth();
  const navigate = useNavigate();

  // Respond to mode changes from header buttons
  useEffect(() => {
    if (modeParam === 'signup') setView('signup');
    else if (!resetToken) setView('login');
  }, [modeParam, resetToken]);

  useEffect(() => {
    // Logic updated to check correct target session
    if (isAdminParam && adminUser) navigate('/admin');
    else if (!isAdminParam && user) navigate('/portal');
  }, [user, adminUser, navigate, isAdminParam]);

  const validate = () => {
    const errors: AuthErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (view !== 'reset' && !emailRegex.test(email)) errors.email = 'Valid email is required';
    
    if (['login', 'signup', 'reset'].includes(view)) {
      if (password.length < 6) errors.password = 'Min 6 characters required';
    }

    if (view === 'signup') {
      if (!name || name.trim().length < 3) errors.name = 'Full legal name required';
      if (phone && !/^(\+44|0)7\d{9}$|^(\+44|0)\d{9,10}$/.test(phone.replace(/\s/g, ''))) {
        errors.phone = 'Invalid UK phone format';
      }
    }
    
    if (view === 'reset' && password !== confirmPassword) {
      errors.confirmPassword = 'Keys do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setLoading(true);

    try {
      if (view === 'login') {
        if (email.toLowerCase() === 'admin@swiftpolicy.co.uk') {
          if (!isAdminParam) {
            setError('Administrator access is restricted to the dedicated portal. Please use the link in the footer.');
            setLoading(false);
            return;
          }
        }

        const res = await login(email, password, isAdminParam);
        if (res.success) {
          setSuccess('Access verified. Redirecting...');
          setTimeout(() => navigate(isAdminParam ? '/admin' : '/portal'), 1000);
        } else {
          setError(res.message);
        }
      } else if (view === 'signup') {
        const additional = { phone, dob, address };
        const res = await signup(name, email, password, additional);
        if (res) {
          setSuccess('Enrollment successful. Account created.');
          setTimeout(() => navigate('/portal'), 2000);
        } else {
          setError('Email domain already registered or reserved.');
        }
      } else if (view === 'forgot') {
        const found = await requestPasswordReset(email);
        if (found) {
          setSuccess('Recovery link dispatched. Check your inbox.');
        } else {
          setError('No associated account found.');
        }
      } else if (view === 'reset') {
        const ok = await resetPasswordWithToken(resetToken || '', password);
        if (ok) {
          setSuccess('Credentials updated. Returning to login...');
          setTimeout(() => {
            navigate('/auth');
            setView('login');
          }, 2000);
        } else {
          setError('Link expired or token invalid.');
        }
      }
    } catch (err) {
      setError('Operational error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label: string, field: string, value: string, setValue: (val: string) => void, placeholder: string, type: string = 'text', Icon: any, required: boolean = true) => {
    const isInvalid = !!formErrors[field];
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#2d1f2d]/30 ml-1">
          {label} {!required && <span className="normal-case opacity-50">(Optional)</span>}
        </label>
        <div className="relative">
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isInvalid ? 'text-red-400' : 'text-[#e91e8c]/30'}`} size={18} />
          <input
            type={inputType}
            required={required}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (formErrors[field]) {
                const newErrors = { ...formErrors };
                delete newErrors[field];
                setFormErrors(newErrors);
              }
            }}
            className={`w-full border rounded-2xl pl-12 pr-${isPassword ? '12' : '6'} py-4 text-base focus:outline-none transition-all ${
              isInvalid ? 'bg-red-50 border-red-200 focus:border-red-400' : 'bg-gray-50 border-gray-100 focus:border-[#e91e8c]'
            }`}
            placeholder={placeholder}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e91e8c] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {isInvalid && <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {formErrors[field]}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8fa] flex items-center justify-center p-6 py-20">
      <div className={`w-full ${view === 'signup' ? 'max-w-2xl' : 'max-w-md'} transition-all duration-500`}>
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <Link to="/" className="inline-flex bg-[#2d1f2d] p-4 rounded-2xl shadow-xl mb-6">
            <Shield className="text-[#e91e8c] h-8 w-8" />
          </Link>
          <h1 className="text-4xl font-bold text-[#2d1f2d] mb-2 font-outfit">
            {isAdminParam ? 'Executive Terminal' : (view === 'login' ? 'Portal Access' : view === 'signup' ? 'New Enrollment' : view === 'forgot' ? 'Recovery' : 'Reset Keys')}
          </h1>
          <p className="text-gray-400 font-medium">
            {view === 'login' ? 'Enter your secure keys to continue' : 'Secure, regulated policy management'}
          </p>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || success) && (
              <div className={`p-5 rounded-2xl flex items-center gap-4 text-xs font-bold ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                {error || success}
              </div>
            )}

            {view === 'signup' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  {renderField('Legal Full Name', 'name', name, setName, 'Johnathan Swift', 'text', User)}
                </div>
                {renderField('Account Email', 'email', email, setEmail, 'email@address.com', 'email', Mail)}
                {renderField('Phone Number', 'phone', phone, setPhone, '07123 456789', 'tel', Phone, false)}
                {renderField('Date of Birth', 'dob', dob, setDob, '', 'date', Calendar, false)}
                {renderField('Residential Address', 'address', address, setAddress, '123 High St, London', 'text', MapPin, false)}
                <div className="md:col-span-2">
                  {renderField('Secure Access Key', 'password', password, setPassword, '••••••••', 'password', Lock)}
                </div>
              </div>
            ) : (
              <>
                {view !== 'reset' && renderField('Account Email', 'email', email, setEmail, 'email@address.com', 'email', Mail)}
                {['login', 'reset'].includes(view) && (
                  <div className="space-y-6">
                    {renderField(view === 'reset' ? 'New Access Key' : 'Access Key', 'password', password, setPassword, '••••••••', 'password', Lock)}
                    {view === 'reset' && renderField('Confirm Access Key', 'confirmPassword', confirmPassword, setConfirmPassword, '••••••••', 'password', KeyRound)}
                    {view === 'login' && !isAdminParam && (
                       <div className="flex justify-end pr-1">
                          <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-black uppercase tracking-widest text-[#e91e8c] hover:underline">Forgot Access Key?</button>
                       </div>
                    )}
                  </div>
                )}
              </>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#2d1f2d] text-white rounded-2xl py-5 font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>{view === 'login' ? 'Verify & Enter' : view === 'signup' ? 'Complete Enrollment' : 'Send Recovery Link'} <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            {view === 'login' && !isAdminParam ? (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm font-medium">New to SwiftPolicy?</p>
                <button onClick={() => setView('signup')} className="text-sm font-bold text-[#e91e8c] hover:underline">Enroll for Policy Management</button>
              </div>
            ) : (
              <button onClick={() => setView('login')} className="text-sm font-bold text-[#e91e8c] hover:underline">Return to portal entry</button>
            )}
          </div>
        </div>
        
        {view === 'signup' && (
          <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest px-10 leading-relaxed">
            By enrolling, you agree to our <Link to="/terms" className="text-[#e91e8c]">Terms of Service</Link> and <Link to="/privacy" className="text-[#e91e8c]">Privacy Policy</Link>. All accounts are subject to regulatory underwriting verification.
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;