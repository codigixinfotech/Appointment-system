import React from 'react';
import type { BookingData } from '../../../pages/BookingWizardPage';
import { FaCalendarAlt, FaClock, FaUser, FaStethoscope, FaMapMarkerAlt, FaNotesMedical } from 'react-icons/fa';

interface Props {
  data: BookingData;
  next: () => void;
  prev: () => void;
}

export const Step5_Summary: React.FC<Props> = ({ data, next, prev }) => {
  const fee = 500; // Mock fee in INR
  const gst = Math.round(fee * 0.18);
  const total = fee + gst;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-xl font-bold text-gray-800">Booking Summary</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide flex justify-center">
        <div className="w-full max-w-2xl mt-2 flex flex-col gap-6">
          
          {/* Doctor & Slot Card */}
          <div className="bg-gray-50/50 rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 rounded-bl-full -z-0"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-gray-200/60 pb-6 mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden shrink-0 bg-white">
                <img src={data.doctor?.photo} alt={data.doctor?.name} className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-800 tracking-tight mb-1">{data.doctor?.name}</h4>
                <p className="text-sm font-medium text-[var(--color-primary)] mb-1 uppercase tracking-wider">{data.doctor?.speciality}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1"><FaMapMarkerAlt className="text-gray-400"/> {data.doctor?.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <FaCalendarAlt className="text-lg" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date & Time</div>
                  <div className="font-bold text-gray-800">{new Date(data.date || '').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-sm font-medium text-[var(--color-primary)] mt-0.5"><FaClock className="inline mr-1 mb-0.5"/> {data.timeSlot}</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <FaStethoscope className="text-lg" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Consultation Type</div>
                  <div className="font-bold text-gray-800">{data.type}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{data.type === 'Online' ? 'Video Call' : 'Clinic Visit'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Patient Info Card */}
            <div className="flex-1 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm h-fit">
              <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg">
                <FaUser className="text-[var(--color-primary)]" /> Patient Info
              </h4>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-sm text-gray-500 font-medium">Name</span>
                  <span className="font-bold text-gray-800 text-right">{data.patient?.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-sm text-gray-500 font-medium">Gender & Age</span>
                  <span className="font-bold text-gray-800 text-right">{data.patient?.gender}, {data.patient?.age} Yrs</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-sm text-gray-500 font-medium">Mobile Number</span>
                  <span className="font-bold text-gray-800 text-right">+91 {data.mobile}</span>
                </div>
                {data.patient?.description && (
                  <div className="pt-2">
                    <span className="text-sm text-gray-500 font-medium flex items-center gap-1 mb-2"><FaNotesMedical/> Symptoms / Reason</span>
                    <p className="text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">{data.patient.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="w-full sm:w-[300px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 shadow-lg text-white h-fit relative overflow-hidden shrink-0">
              {/* Decorative circles */}
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
                
                <div className="border-t border-gray-600/50 mt-2 pt-5">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-300 font-medium text-sm">Total Payable</span>
                    <span className="text-2xl font-black text-white">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-gray-100 flex justify-between shrink-0">
        <button
          onClick={prev}
          className="px-8 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          Edit Details
        </button>
        <button
          onClick={next}
          className="px-10 py-3.5 rounded-xl font-bold text-lg bg-[var(--color-primary)] text-white hover:opacity-90 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};
