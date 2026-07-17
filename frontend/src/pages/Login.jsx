import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function OtpInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
      placeholder="000000"
      maxLength={6}
      className="w-full text-center tracking-[0.5em] text-2xl py-3 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    />
  );
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const switchTab = (t) => {
    setTab(t);
    setStep(1);
    setError('');
    setMessage('');
    setOtp('');
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/request-otp', {
        email: email.trim().toLowerCase(),
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp,
      });
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.includes('already exists')
      ) {
        // User already exists — continue to OTP
      } else {
        setError(err.response?.data?.message || 'Registration failed');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await api.post('/auth/request-otp', {
        email: email.trim().toLowerCase(),
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp,
      });
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Task Manager</h1>
        <p className="text-sm text-slate-500 mt-1">Organize your work, effortlessly</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => switchTab('signin')}
            className={`flex-1 py-3.5 text-sm font-medium text-center transition-colors cursor-pointer rounded-t-2xl ${
              tab === 'signin'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-slate-500 hover:text-slate-700 bg-slate-50/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 py-3.5 text-sm font-medium text-center transition-colors cursor-pointer rounded-t-2xl ${
              tab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-slate-500 hover:text-slate-700 bg-slate-50/50'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-5 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg p-3">
              {message}
            </div>
          )}

          {/* ── SIGN IN ── */}
          {tab === 'signin' && step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={!email.trim() || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {tab === 'signin' && step === 2 && (
            <form onSubmit={handleSignInVerify} className="space-y-5">
              <p className="text-sm text-slate-600">
                Enter the 6-digit code sent to <strong className="text-slate-800">{email}</strong>
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
                <OtpInput value={otp} onChange={setOtp} />
              </div>
              <button
                type="submit"
                disabled={otp.length !== 6 || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Back to email
              </button>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && step === 1 && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim() || !email.trim() || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? 'Sending verification...' : 'Continue to Verification'}
              </button>
              <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signin')}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {tab === 'register' && step === 2 && (
            <form onSubmit={handleRegisterVerify} className="space-y-5">
              <p className="text-sm text-slate-600">
                Enter the 6-digit code sent to <strong className="text-slate-800">{email}</strong>
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
                <OtpInput value={otp} onChange={setOtp} />
              </div>
              <button
                type="submit"
                disabled={otp.length !== 6 || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Verify & Create Account'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Back to registration form
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
