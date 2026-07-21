import React, { useState, useEffect, useRef } from 'react';
import type { BookingData } from '../../../pages/BookingWizardPage';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMobileAlt, FaShieldAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { db } from '../../../services/db';

interface Props {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  next: () => void;
  prev: () => void;
}

export const Step2_Auth: React.FC<Props> = ({ data, updateData, next, prev }) => {
  const [mobile, setMobile] = useState(data.mobile || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [debugOtp, setDebugOtp] = useState('');
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, otpSent]);

  const handleSendOTP = async () => {
    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    
    try {
      setIsVerifying(true); // Re-use spinner for sending
      const res = await db.sendOtp(mobile);
      if (res.debugOtp) {
        setDebugOtp(res.debugOtp);
      } else {
        setDebugOtp('');
      }
      updateData({ mobile });
      setOtpSent(true);
      setTimer(300); // 5 minutes matching backend
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length === 4) {
      setIsVerifying(true);
      try {
        const isValid = await db.verifyOtp(mobile, code);
        if (isValid) {
          next();
        } else {
          setError('Invalid OTP code.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to verify OTP');
      } finally {
        setIsVerifying(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Mobile Verification</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center py-10 px-4">
        <div className="w-full max-w-md bg-gray-50/50 border border-gray-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 rounded-bl-full -z-0"></div>
          
          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="w-16 h-16 bg-blue-50 text-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100/50">
                  <FaMobileAlt className="text-3xl" />
                </div>
                <h4 className="text-2xl font-bold text-gray-800 mb-2">What's your number?</h4>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">We will send a 4-digit verification code to confirm your appointment details.</p>
                
                <div className="mb-6">
                  <div className={`flex items-center bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-blue-100'}`}>
                    <div className="px-4 py-4 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-lg flex items-center justify-center">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobile(val);
                        setError('');
                      }}
                      placeholder="98765 43210"
                      className="flex-1 w-full bg-transparent px-4 py-4 text-lg font-bold text-gray-800 focus:outline-none tracking-wider placeholder:font-normal placeholder:tracking-normal"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{error}</p>}
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={mobile.length < 10}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    mobile.length >= 10
                      ? 'bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Get Verification Code
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-100/50">
                  <FaShieldAlt className="text-3xl" />
                </div>
                <h4 className="text-2xl font-bold text-gray-800 mb-2">Verify it's you</h4>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                  We've sent a code to <span className="font-bold text-gray-800">+91 {mobile}</span>. 
                  <button onClick={() => setOtpSent(false)} className="text-[var(--color-primary)] font-semibold ml-2 hover:underline">Edit</button>
                </p>
                
                {debugOtp && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-6 text-sm text-center font-medium shadow-sm">
                    Developer Mode: Your OTP is <span className="font-bold text-lg">{debugOtp}</span>
                  </div>
                )}
                
                <div className="flex gap-4 justify-between mb-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-14 h-16 text-center text-3xl font-bold rounded-xl bg-white border shadow-sm focus:outline-none transition-all ${
                        error 
                          ? 'border-red-400 text-red-500 ring-2 ring-red-100' 
                          : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                  ))}
                </div>
                {error && <p className="text-red-500 text-xs font-semibold mt-2 mb-4 text-center">{error}</p>}

                <div className="text-center mt-6 mb-8 text-sm font-medium">
                  {timer > 0 ? (
                    <span className="text-gray-500">Resend code in <span className="text-[var(--color-primary)] font-bold">00:{timer.toString().padStart(2, '0')}</span></span>
                  ) : (
                    <button 
                      onClick={() => { setTimer(30); setOtp(['','','','']); setError(''); }}
                      className="text-[var(--color-primary)] font-bold hover:underline"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>

                <button
                  onClick={handleVerify}
                  disabled={otp.join('').length < 4 || isVerifying}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    otp.join('').length === 4
                      ? 'bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isVerifying ? (
                    <><FaSpinner className="animate-spin" /> Verifying...</>
                  ) : (
                    <><FaCheckCircle /> Verify & Continue</>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-gray-100 flex justify-between">
        <button
          onClick={prev}
          className="px-8 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};
