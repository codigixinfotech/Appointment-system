import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { BookingData } from '../../../pages/BookingWizardPage';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserAlt, FaBirthdayCake, FaVenusMars, FaNotesMedical, FaMobileAlt, FaShieldAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { db } from '../../../services/db';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Please select a gender' }),
  description: z.string().max(250, 'Description too long').optional(),
  mobile: z.string().length(10, 'Must be a 10-digit number'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  next: () => void;
  prev: () => void;
}

export const Step2_PatientAuth: React.FC<Props> = ({ data, updateData, next, prev }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [debugOtp, setDebugOtp] = useState('');

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: data.patient?.name || '',
      age: data.patient?.age || '',
      gender: (data.patient?.gender as any) || 'Male',
      description: data.patient?.description || '',
      mobile: data.mobile || '',
    }
  });

  const mobileValue = watch('mobile');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, otpSent]);

  const onFormSubmit = async (formData: FormValues) => {
    setError('');

    // Save patient details first
    updateData({
      mobile: formData.mobile,
      patient: {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        description: formData.description || '',
      }
    });

    try {
      setIsVerifying(true);
      const res = await db.sendOtp(formData.mobile);
      if (res.debugOtp) {
        setDebugOtp(res.debugOtp);
      } else {
        setDebugOtp('');
      }
      setOtpSent(true);
      setTimer(300);
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
        const isValidOTP = await db.verifyOtp(mobileValue, code);
        if (isValidOTP) {
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
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-xl  text-gray-800">Patient Details & Verification</h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide flex justify-center">
        <div className="w-full max-w-2xl bg-gray-50/50 rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden h-fit mt-4">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-primary)] opacity-5 rounded-bl-full -z-0"></div>

          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
                onSubmit={handleSubmit(onFormSubmit)}
              >
                <h4 className="text-2xl  text-gray-800 mb-2">Who is the appointment for?</h4>
                <p className="text-gray-500 mb-8 text-sm">Please provide accurate details and a valid mobile number for verification.</p>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs  text-gray-700 mb-2 flex items-center gap-2">
                      <FaUserAlt className="text-gray-400" /> Full Name
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="e.g. John Doe"
                      className={`w-full p-4 text-lg font-medium bg-white rounded-xl border shadow-sm transition-all focus:outline-none focus:ring-2 ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-blue-100'
                        }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{errors.name.message as string}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Age */}
                    <div className="w-full sm:w-1/3">
                      <label className="block text-xs  text-gray-700 mb-2 flex items-center gap-2">
                        <FaBirthdayCake className="text-gray-400" /> Age
                      </label>
                      <input
                        type="number"
                        {...register('age')}
                        placeholder="e.g. 28"
                        className={`w-full p-4 text-lg font-medium bg-white rounded-xl border shadow-sm transition-all focus:outline-none focus:ring-2 ${errors.age ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-blue-100'
                          }`}
                      />
                      {errors.age && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{errors.age.message as string}</p>}
                    </div>

                    {/* Gender */}
                    <div className="w-full sm:w-2/3">
                      <label className="block text-xs  text-gray-700 mb-2 flex items-center gap-2">
                        <FaVenusMars className="text-gray-400" /> Gender
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Male', 'Female', 'Other'].map((g) => (
                          <label key={g} className="cursor-pointer relative">
                            <input type="radio" value={g} {...register('gender')} className="peer sr-only" />
                            <div className="p-4 text-center text-sm  bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 peer-checked:bg-[var(--color-primary)]/10 peer-checked:border-[var(--color-primary)] peer-checked:text-[var(--color-primary)] transition-all">
                              {g}
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.gender && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{errors.gender.message as string}</p>}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-xs  text-gray-700 mb-2 flex items-center gap-2">
                      <FaMobileAlt className="text-gray-400" /> Mobile Number
                    </label>
                    <div className={`flex items-center bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${errors.mobile ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-blue-100'}`}>
                      <div className="px-4 py-4 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-lg flex items-center justify-center">
                        +91
                      </div>
                      <input
                        type="tel"
                        {...register('mobile')}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          e.target.value = val;
                          register('mobile').onChange(e);
                        }}
                        placeholder="9876543210"
                        className="flex-1 w-full bg-transparent px-4 py-4 text-lg  text-gray-800 focus:outline-none tracking-wider placeholder:font-normal placeholder:tracking-normal"
                      />
                    </div>
                    {errors.mobile && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{errors.mobile.message as string}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs  text-gray-700 mb-2 flex items-center gap-2">
                      <FaNotesMedical className="text-gray-400" /> Symptoms / Reason (Optional)
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      placeholder="Briefly describe what you are experiencing..."
                      className={`w-full p-4 text-sm font-medium bg-white rounded-xl border shadow-sm transition-all focus:outline-none focus:ring-2 resize-none ${errors.description ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-blue-100'
                        }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{errors.description.message as string}</p>}
                  </div>

                  {error && <p className="text-red-500 text-sm  mt-2 text-center">{error}</p>}

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between shrink-0">
                    <button
                      type="button"
                      onClick={prev}
                      className="px-8 py-3.5 rounded-xl  text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!isValid || isVerifying}
                      className={`px-10 py-3.5 rounded-xl  transition-all text-lg flex items-center gap-2 ${isValid && !isVerifying
                        ? 'bg-[var(--color-primary)] text-white hover:opacity-90 shadow-md'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {isVerifying ? <><FaSpinner className="animate-spin" /> Sending...</> : 'Get Verification Code'}
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col items-center pt-8"
              >
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-100/50">
                  <FaShieldAlt className="text-3xl" />
                </div>
                <h4 className="text-2xl  text-gray-800 mb-2">Verify it's you</h4>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed text-center">
                  We've sent a code to <span className=" text-gray-800">+91 {mobileValue}</span>.
                  <button onClick={() => { setOtpSent(false); setOtp(['', '', '', '']); }} className="text-[var(--color-primary)] font-semibold ml-2 hover:underline">Edit Info</button>
                </p>

                {debugOtp && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-6 text-sm text-center font-medium shadow-sm w-full max-w-sm">
                    Developer Mode: Your OTP is <span className=" text-lg">{debugOtp}</span>
                  </div>
                )}

                <div className="flex gap-4 justify-center mb-2">
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
                      className={`w-14 h-16 text-center text-3xl  rounded-xl bg-white border shadow-sm focus:outline-none transition-all ${error
                        ? 'border-red-400 text-red-500 ring-2 ring-red-100'
                        : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100'
                        }`}
                    />
                  ))}
                </div>
                {error && <p className="text-red-500 text-xs font-semibold mt-2 mb-4 text-center">{error}</p>}

                <div className="text-center mt-6 mb-8 text-sm font-medium">
                  {timer > 0 ? (
                    <span className="text-gray-500">Resend code in <span className="text-[var(--color-primary)] ">00:{timer.toString().padStart(2, '0')}</span></span>
                  ) : (
                    <button
                      onClick={() => {
                        setTimer(30); setOtp(['', '', '', '']); setError('');
                        onFormSubmit(watch()); // Resubmit to send OTP again
                      }}
                      className="text-[var(--color-primary)]  hover:underline"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>

                <div className="w-full mt-4 pt-6 border-t border-gray-100 flex justify-between">
                  <button
                    onClick={() => { setOtpSent(false); setOtp(['', '', '', '']); }}
                    className="px-8 py-3.5 rounded-xl  text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={otp.join('').length < 4 || isVerifying}
                    className={`px-10 py-3.5 rounded-xl  transition-all text-lg flex items-center justify-center gap-2 ${otp.join('').length === 4
                      ? 'bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {isVerifying ? (
                      <><FaSpinner className="animate-spin" /> Verifying...</>
                    ) : (
                      <><FaCheckCircle /> Verify & Review</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
