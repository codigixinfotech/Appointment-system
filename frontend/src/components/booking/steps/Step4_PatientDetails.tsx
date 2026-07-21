import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { BookingData } from '../../../pages/BookingWizardPage';
import { FaUserAlt, FaBirthdayCake, FaVenusMars, FaNotesMedical } from 'react-icons/fa';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Please select a gender' }),
  description: z.string().max(250, 'Description too long').optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  updateData: (data: Partial<BookingData>) => void;
  next: () => void;
  prev: () => void;
}

export const Step4_PatientDetails: React.FC<Props> = ({ updateData, next, prev }) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: FormValues) => {
    updateData({
      patient: {
        name: data.name,
        age: data.age,
        gender: data.gender,
        description: data.description || '',
      }
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-xl font-bold text-gray-800">Patient Details</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide flex justify-center">
        <div className="w-full max-w-2xl bg-gray-50/50 rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden h-fit mt-4">
          
          <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-primary)] opacity-5 rounded-bl-full -z-0"></div>
          
          <div className="relative z-10">
            <h4 className="text-2xl font-bold text-gray-800 mb-2">Who is the appointment for?</h4>
            <p className="text-gray-500 mb-8 text-sm">Please provide accurate details so the doctor can prepare for your visit.</p>
            
            <div className="space-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUserAlt className="text-gray-400" /> Full Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. John Doe"
                  className={`w-full p-4 text-lg font-medium bg-white rounded-xl border shadow-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-blue-100'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Age */}
                <div className="w-full sm:w-1/3">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaBirthdayCake className="text-gray-400" /> Age (Years)
                  </label>
                  <input
                    type="number"
                    {...register('age')}
                    placeholder="e.g. 28"
                    className={`w-full p-4 text-lg font-medium bg-white rounded-xl border shadow-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.age ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-blue-100'
                    }`}
                  />
                  {errors.age && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{errors.age.message}</p>}
                </div>

                {/* Gender */}
                <div className="w-full sm:w-2/3">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaVenusMars className="text-gray-400" /> Gender
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <label key={g} className="cursor-pointer relative">
                        <input type="radio" value={g} {...register('gender')} className="peer sr-only" />
                        <div className="p-4 text-center text-sm font-bold bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 peer-checked:bg-[var(--color-primary)]/10 peer-checked:border-[var(--color-primary)] peer-checked:text-[var(--color-primary)] transition-all">
                          {g}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.gender && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{errors.gender.message}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaNotesMedical className="text-gray-400" /> Symptoms / Reason (Optional)
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Briefly describe what you are experiencing..."
                  className={`w-full p-4 text-sm font-medium bg-white rounded-xl border shadow-sm transition-all focus:outline-none focus:ring-2 resize-none ${
                    errors.description ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-[var(--color-primary)] focus:ring-blue-100'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-xs font-semibold mt-2 px-1">{errors.description.message}</p>}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-gray-100 flex justify-between shrink-0">
        <button
          type="button"
          onClick={prev}
          className="px-8 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-10 py-3.5 rounded-xl font-bold transition-all text-lg ${
            isValid
              ? 'bg-[var(--color-primary)] text-white hover:opacity-90 shadow-md' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Review Booking
        </button>
      </div>
    </form>
  );
};
