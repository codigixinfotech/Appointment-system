import React, { useState } from 'react';
import { FaQrcode, FaCreditCard, FaUniversity, FaMobileAlt, FaCheckCircle, FaSpinner, FaLock } from 'react-icons/fa';
import { useTheme } from '../../../theme/ThemeProvider';

interface Props {
  onSuccess: () => void;
  prev: () => void;
}

export const Step6_PaymentMock: React.FC<Props> = ({ onSuccess, prev }) => {
  const { tenant } = useTheme();
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
        <h3 className="text-xl font-bold text-gray-800">Complete Payment</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide flex justify-center">
        <div className="w-full max-w-3xl bg-gray-50/50 rounded-3xl border border-gray-100 shadow-sm flex flex-col mt-2 h-fit overflow-hidden relative">
          
          {/* Payment Gateway Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaLock className="text-green-400 text-lg" />
              </div>
              <div>
                <div className="font-bold tracking-wide text-lg leading-tight">Secure Checkout</div>
                <div className="text-xs text-gray-300 font-medium">128-bit SSL Encrypted</div>
              </div>
            </div>
            <div className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">Test Mode</div>
          </div>

          <div className="flex flex-col md:flex-row bg-white relative z-10">
            {/* Sidebar Methods */}
            <div className="w-full md:w-64 bg-gray-50/80 border-r border-gray-100 flex flex-row md:flex-col p-4 gap-3 overflow-x-auto">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 hidden md:block px-2 pt-2">Payment Options</div>
              
              <button 
                onClick={() => setMethod('upi')}
                className={`flex items-center gap-3 p-4 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${method === 'upi' ? 'bg-white shadow-md text-[var(--color-primary)] border border-gray-100' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
              >
                <FaQrcode className="text-lg" /> UPI / QR
              </button>
              <button 
                onClick={() => setMethod('card')}
                className={`flex items-center gap-3 p-4 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${method === 'card' ? 'bg-white shadow-md text-[var(--color-primary)] border border-gray-100' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
              >
                <FaCreditCard className="text-lg" /> Cards
              </button>
              <button 
                onClick={() => setMethod('netbanking')}
                className={`flex items-center gap-3 p-4 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${method === 'netbanking' ? 'bg-white shadow-md text-[var(--color-primary)] border border-gray-100' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
              >
                <FaUniversity className="text-lg" /> Netbanking
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[350px]">
              
              {method === 'upi' && (
                <div className="flex flex-col items-center w-full max-w-sm text-center">
                  <h4 className="font-bold text-xl text-gray-800 mb-2">Scan QR with any UPI App</h4>
                  <p className="text-gray-500 text-sm mb-8 font-medium">Paying to: {upiId}</p>
                  
                  {/* Mock QR */}
                  <div className="p-4 bg-white border-4 border-gray-50 rounded-2xl shadow-sm mb-8 relative">
                    <img src={qrUrl} alt="UPI QR" className="w-48 h-48 opacity-90 mix-blend-multiply" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100">
                        <FaMobileAlt className="text-[var(--color-primary)] text-3xl" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex items-center gap-4 my-2">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <button 
                    onClick={handleSimulatePayment}
                    className="w-full mt-6 py-4 rounded-xl bg-[#22c55e] text-white font-bold hover:bg-[#1ea34d] transition-colors shadow-sm flex items-center justify-center gap-2 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <FaCheckCircle className="text-lg" /> Simulate Successful Payment
                  </button>
                </div>
              )}

              {method === 'card' && (
                <div className="w-full max-w-sm flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <FaCreditCard className="text-5xl text-gray-400" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-800 mb-2">Pay via Credit / Debit Card</h4>
                  <p className="text-gray-500 text-sm mb-8 font-medium">Visa, MasterCard, RuPay, Maestro</p>
                  <button 
                    onClick={handleSimulatePayment}
                    className="w-full py-4 rounded-xl bg-[#22c55e] text-white font-bold hover:bg-[#1ea34d] transition-colors shadow-sm flex items-center justify-center gap-2 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <FaCheckCircle className="text-lg" /> Simulate Card Payment
                  </button>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="w-full max-w-sm flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <FaUniversity className="text-5xl text-gray-400" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-800 mb-2">Netbanking</h4>
                  <p className="text-gray-500 text-sm mb-8 font-medium">Select from all major Indian banks</p>
                  <button 
                    onClick={handleSimulatePayment}
                    className="w-full py-4 rounded-xl bg-[#22c55e] text-white font-bold hover:bg-[#1ea34d] transition-colors shadow-sm flex items-center justify-center gap-2 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <FaCheckCircle className="text-lg" /> Simulate Bank Transfer
                  </button>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-gray-100 flex justify-start shrink-0">
        <button
          onClick={prev}
          className="px-8 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-sm"
        >
          Back to Summary
        </button>
      </div>
    </div>
  );
};
