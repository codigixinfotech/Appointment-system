import React, { useState } from 'react';
import type { BookingData } from '../../../pages/BookingWizardPage';
import { FaCalendarAlt, FaClock, FaUser, FaStethoscope, FaMapMarkerAlt, FaNotesMedical, FaQrcode, FaCreditCard, FaUniversity, FaMobileAlt, FaCheckCircle, FaSpinner, FaLock } from 'react-icons/fa';
import { useTheme } from '../../../theme/ThemeProvider';

interface Props {
  data: BookingData;
  onSuccess: () => void;
  prev: () => void;
}

export const Step3_ReviewPay: React.FC<Props> = ({ data, onSuccess, prev }) => {
  const { tenant } = useTheme();
  
  const fee = 500; // Mock fee in INR
  const gst = Math.round(fee * 0.18);
  const total = fee + gst;

  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    // Simulate network delay
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const upiId = tenant?.upiId || 'mock@upi';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(tenant?.name || 'Demo')}&am=590`;

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
          <FaSpinner className="animate-spin text-4xl text-[var(--color-primary)]" />
          <div className="absolute inset-0 border-4 border-[var(--color-primary)]/20 rounded-full"></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment...</h3>
        <p className="text-gray-500 font-medium">Please do not refresh or close this window.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-xl font-bold text-gray-800">Review & Pay</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide flex justify-center">
        <div className="w-full max-w-4xl mt-2 flex flex-col gap-8 pb-10">
          
          {/* Summary Section */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              {/* Doctor & Slot Card */}
              <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 rounded-bl-full -z-0"></div>
                <div className="relative z-10 flex gap-4 items-center border-b border-gray-200/60 pb-4 mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm overflow-hidden shrink-0 bg-white">
                    <img src={data.doctor?.photo} alt={data.doctor?.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 tracking-tight mb-1">{data.doctor?.name}</h4>
                    <p className="text-xs font-medium text-[var(--color-primary)] mb-1 uppercase tracking-wider">{data.doctor?.speciality}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><FaMapMarkerAlt className="text-gray-400"/> {data.doctor?.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><FaCalendarAlt/> Date & Time</div>
                    <div className="font-bold text-gray-800 text-sm">{new Date(data.date || '').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-xs font-medium text-[var(--color-primary)] mt-0.5"><FaClock className="inline mr-1 mb-0.5"/> {data.timeSlot}</div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><FaStethoscope/> Type</div>
                    <div className="font-bold text-gray-800 text-sm">{data.type}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{data.type === 'Online' ? 'Video Call' : 'Clinic Visit'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="w-full lg:w-[350px] bg-white border border-gray-200 rounded-3xl p-6 shadow-sm h-fit">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-md">
                <FaUser className="text-[var(--color-primary)]" /> Patient Info
              </h4>
              
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-medium">Name</span>
                  <span className="font-bold text-gray-800 text-right">{data.patient?.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-medium">Gender & Age</span>
                  <span className="font-bold text-gray-800 text-right">{data.patient?.gender}, {data.patient?.age} Yrs</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-medium">Mobile Number</span>
                  <span className="font-bold text-gray-800 text-right">+91 {data.mobile}</span>
                </div>
                {data.patient?.description && (
                  <div className="pt-1">
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1"><FaNotesMedical/> Reason</span>
                    <p className="text-xs font-medium text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">{data.patient.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Payment Section */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Payment Details Card */}
            <div className="w-full lg:w-[320px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--color-primary)]/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-xl"></div>
              
              <h4 className="font-bold text-white mb-6 text-lg relative z-10">Payment Details</h4>
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-300 font-medium">Consultation Fee</span>
                  <span className="font-bold text-white">₹{fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-300 font-medium">GST (18%)</span>
                  <span className="font-bold text-white">₹{gst.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-600/50 mt-2 pt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-300 font-medium text-sm">Total Payable</span>
                    <span className="text-2xl font-black text-white">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Gateway Mock */}
            <div className="flex-1 w-full bg-white border border-gray-200 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaLock className="text-green-500" />
                  <span className="font-bold text-gray-800 text-sm">Secure Checkout</span>
                </div>
                <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-full uppercase tracking-wider">Test Mode</span>
              </div>
              
              <div className="flex flex-col sm:flex-row h-full">
                {/* Sidebar Methods */}
                <div className="w-full sm:w-48 bg-gray-50/50 border-r border-gray-100 flex flex-row sm:flex-col p-2 gap-1 overflow-x-auto">
                  <button 
                    onClick={() => setMethod('upi')}
                    className={`flex items-center gap-2 p-3 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${method === 'upi' ? 'bg-white shadow-sm text-[var(--color-primary)] border border-gray-200' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
                  >
                    <FaQrcode /> UPI / QR
                  </button>
                  <button 
                    onClick={() => setMethod('card')}
                    className={`flex items-center gap-2 p-3 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${method === 'card' ? 'bg-white shadow-sm text-[var(--color-primary)] border border-gray-200' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
                  >
                    <FaCreditCard /> Cards
                  </button>
                  <button 
                    onClick={() => setMethod('netbanking')}
                    className={`flex items-center gap-2 p-3 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${method === 'netbanking' ? 'bg-white shadow-sm text-[var(--color-primary)] border border-gray-200' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
                  >
                    <FaUniversity /> Netbanking
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[250px]">
                  {method === 'upi' && (
                    <div className="flex flex-col items-center w-full max-w-xs text-center">
                      <p className="text-gray-500 text-xs mb-4 font-medium">Scan with any UPI App (Paying to: {upiId})</p>
                      <div className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm mb-4">
                        <img src={qrUrl} alt="UPI QR" className="w-32 h-32 opacity-90 mix-blend-multiply" />
                      </div>
                      <button 
                        onClick={handleSimulatePayment}
                        className="w-full py-3 rounded-xl bg-[#22c55e] text-white font-bold hover:bg-[#1ea34d] transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle /> Simulate Payment
                      </button>
                    </div>
                  )}

                  {method === 'card' && (
                    <div className="w-full max-w-xs flex flex-col items-center text-center">
                      <FaCreditCard className="text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500 text-xs mb-6 font-medium">Visa, MasterCard, RuPay, Maestro</p>
                      <button 
                        onClick={handleSimulatePayment}
                        className="w-full py-3 rounded-xl bg-[#22c55e] text-white font-bold hover:bg-[#1ea34d] transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle /> Simulate Card Payment
                      </button>
                    </div>
                  )}

                  {method === 'netbanking' && (
                    <div className="w-full max-w-xs flex flex-col items-center text-center">
                      <FaUniversity className="text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500 text-xs mb-6 font-medium">Select from all major Indian banks</p>
                      <button 
                        onClick={handleSimulatePayment}
                        className="w-full py-3 rounded-xl bg-[#22c55e] text-white font-bold hover:bg-[#1ea34d] transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle /> Simulate Bank Transfer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-gray-100 flex justify-start shrink-0">
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
