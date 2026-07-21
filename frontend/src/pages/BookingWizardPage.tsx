import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../theme/ThemeProvider';
import { db } from '../services/db';
import type { Doctor } from '../services/db';

// Step Imports
import { Step1_SelectSlot } from '../components/booking/steps/Step1_SelectSlot';
import { Step2_Auth } from '../components/booking/steps/Step2_Auth';
import { Step4_PatientDetails as Step3_PatientDetails } from '../components/booking/steps/Step4_PatientDetails';
import { Step5_Summary as Step4_Summary } from '../components/booking/steps/Step5_Summary';
import { Step6_PaymentMock as Step5_PaymentMock } from '../components/booking/steps/Step6_PaymentMock';

export interface BookingData {
  doctor: Doctor | null;
  date: string | null;
  timeSlot: string | null;
  type: 'In-Person' | 'Online' | null;
  mobile: string;
  patient: {
    name: string;
    gender: string;
    age: string;
    description: string;
  } | null;
}

export const BookingWizardPage: React.FC = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { theme, tenant } = useTheme();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<number>(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    doctor: null,
    date: null,
    timeSlot: null,
    type: null,
    mobile: '',
    patient: null,
  });

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (tenant && doctorId) {
        const docs = await db.getDoctorsByTenant(tenant.id);
        const doc = docs.find(d => d.id === doctorId) || null;
        setDoctor(doc);
        setBookingData(prev => ({ ...prev, doctor: doc }));
      }
      setLoading(false);
    };
    fetchDoctor();
  }, [tenant, doctorId]);

  // If no doctor found, redirect back
  useEffect(() => {
    if (!loading && !doctor) {
      navigate(`/${tenant?.slug || ''}`);
    }
  }, [doctor, loading, navigate, tenant]);

  if (loading || !doctor || !theme) return <div className="min-h-screen bg-gray-50"></div>;

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateData = (newData: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...newData }));
  };

  const handleClose = () => {
    navigate('/');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1_SelectSlot data={bookingData} updateData={updateData} next={nextStep} />;
      case 2:
        return <Step2_Auth data={bookingData} updateData={updateData} next={nextStep} prev={prevStep} />;
      case 3:
        return <Step3_PatientDetails updateData={updateData} next={nextStep} prev={prevStep} />;
      case 4:
        return <Step4_Summary data={bookingData} next={nextStep} prev={prevStep} />;
      case 5:
        return <Step5_PaymentMock onSuccess={() => setIsSuccess(true)} prev={prevStep} />;
      default:
        return null;
    }
  };

  const WIZARD_STEPS = [
    { id: 1, title: 'Select Slot', subtitle: bookingData.timeSlot ? 'Completed' : 'Choose date & time' },
    { id: 2, title: 'Mobile Auth', subtitle: step > 2 ? 'Completed' : 'Enter mobile & OTP' },
    { id: 3, title: 'Patient Details', subtitle: step > 3 ? 'Completed' : 'Basic info' },
    { id: 4, title: 'Summary', subtitle: step > 4 ? 'Completed' : 'Review booking' },
    { id: 5, title: 'Payment', subtitle: step > 5 ? 'Completed' : 'Complete payment' }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-surface)]/80 border-b border-[var(--color-border)] shadow-sm px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <FaArrowLeft />
        </button>
        {tenant?.logoUrl && (
          <div className="h-10 flex items-center justify-center">
            <img src={tenant.logoUrl} alt="Logo" className="h-full w-auto object-contain" />
          </div>
        )}
        <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-main)]">
          {tenant?.name}
        </h1>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-4 flex">
        <div className="flex flex-col md:flex-row w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">

          {/* Left Sidebar: Wizard Steps */}
          {!isSuccess && (
            <div className="w-full md:w-[280px] border-r border-gray-100 bg-white p-4 shrink-0 flex flex-col gap-4 z-10">
              <h3 className="text-xl font-bold text-gray-800 mb-4 mt-2">Setup Appointment</h3>
              <div className="flex flex-col gap-6 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gray-100 -z-10" />

                {WIZARD_STEPS.map((s) => {
                  const isCompleted = step > s.id;
                  const isActive = step === s.id;

                  return (
                    <div key={s.id} className="flex items-start gap-4">
                      {/* Circle Indicator */}
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors border`}
                        style={{
                          backgroundColor: isActive ? 'var(--color-primary)' : isCompleted ? '#ffffff' : '#ffffff',
                          borderColor: (isActive || isCompleted) ? 'var(--color-primary)' : '#4b5563',
                          color: isCompleted ? 'var(--color-primary)' : isActive ? '#ffffff' : '#1f2937',
                          borderWidth: isCompleted ? '2px' : '1px'
                        }}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <span className="text-[13px] font-semibold">{s.id}</span>
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex flex-col">
                        <span 
                          className="text-[15px] font-semibold"
                          style={{ color: isActive ? 'var(--color-primary)' : '#374151' }}
                        >
                          {s.title}
                        </span>
                        <span 
                          className="text-[11px] font-bold mt-0.5"
                          style={{ color: isCompleted ? 'var(--color-primary)' : '#9ca3af' }}
                        >
                          {s.subtitle}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Wizard Content */}
          <div className="flex-1 bg-gray-50/30 flex flex-col p-4 overflow-y-auto">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key={step}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  {renderStep()}
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center h-full pt-12 pb-12 w-full"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <FaCheckCircle className="text-green-500 text-6xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-500 max-w-md mb-8">
                    Your appointment with <span className="font-semibold text-gray-800">{bookingData.doctor?.name}</span> on <span className="font-semibold text-gray-800">{bookingData.date}</span> at <span className="font-semibold text-gray-800">{bookingData.timeSlot}</span> has been confirmed. We have sent the details to {bookingData.mobile}.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 rounded-xl text-white font-bold hover:opacity-90 transition-opacity text-lg"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Return to Portal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};
