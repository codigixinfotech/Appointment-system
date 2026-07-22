import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import type { Doctor, Tenant } from '../../services/db';
import { FaArrowLeft, FaPlus, FaTrash, FaUserMd, FaEdit, FaCalendarAlt } from 'react-icons/fa';

const STANDARD_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '06:00 PM'];

export const DoctorManager = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: '',
    speciality: '',
    experience: '',
    address: '',
    onlineConsult: true,
    inPerson: true,
    education: '',
    languages: [],
    rating: 5.0,
    bio: '',
    photo: '',
    email: '',
    phone: '',
    inPersonHours: [],
    onlineHours: [],
    unavailableDates: [],
    fee: 0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      speciality: '',
      experience: '',
      address: '',
      onlineConsult: true,
      inPerson: true,
      education: '',
      languages: [],
      rating: 5.0,
      bio: '',
      photo: '',
      email: '',
      phone: '',
      inPersonHours: [],
      onlineHours: [],
      unavailableDates: [],
      fee: 0,
    });
    setEditingDoctorId(null);
    setIsAdding(false);
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    const t = await db.getTenantById(id!);
    if (t) setTenant(t);
    const docs = await db.getDoctorsByTenant(id!);
    setDoctors(docs);
  };

  const handleAddRange = () => {
    if (!fromDate || !toDate) return;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const dates: string[] = [];

    let current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    setFormData(prev => ({
      ...prev,
      unavailableDates: Array.from(new Set([...(prev.unavailableDates || []), ...dates])).sort()
    }));
    setFromDate('');
    setToDate('');
  };

  const handleEdit = (doctor: Doctor) => {
    setFormData(doctor);
    setEditingDoctorId(doctor.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (doctorId: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      await db.deleteDoctor(doctorId);
      loadData();
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const doctorData = {
      tenantId: id,
      name: formData.name || '',
      speciality: formData.speciality || '',
      experience: formData.experience || '',
      address: formData.address || tenant?.name || '',
      onlineConsult: formData.onlineConsult !== undefined ? formData.onlineConsult : true,
      inPerson: formData.inPerson !== undefined ? formData.inPerson : true,
      education: formData.education || '',
      languages: formData.languages || ['English'],
      rating: formData.rating || 5.0,
      bio: formData.bio || '',
      photo: formData.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
      email: formData.email || '',
      phone: formData.phone || '',
      inPersonHours: formData.inPersonHours || [],
      onlineHours: formData.onlineHours || [],
      unavailableDates: formData.unavailableDates || [],
      fee: Number(formData.fee) || 0,
    };

    if (editingDoctorId) {
      await db.updateDoctor(editingDoctorId, doctorData);
    } else {
      await db.createDoctor(doctorData);
    }

    resetForm();
    loadData();
  };

  if (!tenant) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl  text-gray-900">Manage Doctors</h1>
            <p className="text-gray-500 mt-1 text-xs">Hospital: <strong className="text-indigo-600">{tenant.name}</strong></p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded  text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <FaPlus /> Add Doctor
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddDoctor} className="bg-white rounded p-4 border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-3">
            <h3 className="col-span-full text-xl  mb-2">{editingDoctorId ? 'Edit Doctor Profile' : 'New Doctor Profile'}</h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs  text-gray-700">Name</label>
              <input required type="text" placeholder="Dr. John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs  text-gray-700">Speciality</label>
              <input required type="text" placeholder="Cardiologist" value={formData.speciality} onChange={e => setFormData({ ...formData, speciality: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs  text-gray-700">Photo URL</label>
              <input type="text" placeholder="https://..." value={formData.photo} onChange={e => setFormData({ ...formData, photo: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs  text-gray-700">Experience (Years)</label>
              <input type="text" placeholder="10 Years" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs  text-gray-700">Email Address</label>
              <input type="email" placeholder="doctor@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs  text-gray-700">Mobile Number</label>
              <input type="tel" placeholder="+1 234 567 8900" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs  text-gray-700">Consultation Fee (INR)</label>
              <input type="number" min="0" placeholder="0 (Leave empty or 0 for free)" value={formData.fee || ''} onChange={e => setFormData({ ...formData, fee: e.target.value === '' ? 0 : Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div className="flex flex-col gap-2 col-span-full mt-4">
              <label className="text-xs  text-gray-700">In-Person Time Slots</label>
              <div className="flex flex-wrap gap-2">
                {STANDARD_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      const current = formData.inPersonHours || [];
                      const isSelected = current.includes(slot);
                      setFormData({ ...formData, inPersonHours: isSelected ? current.filter(s => s !== slot) : [...current, slot] });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs  transition-colors ${formData.inPersonHours?.includes(slot) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 col-span-full">
              <label className="text-xs  text-gray-700">Online Time Slots</label>
              <div className="flex flex-wrap gap-2">
                {STANDARD_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      const current = formData.onlineHours || [];
                      const isSelected = current.includes(slot);
                      setFormData({ ...formData, onlineHours: isSelected ? current.filter(s => s !== slot) : [...current, slot] });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs  transition-colors ${formData.onlineHours?.includes(slot) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 col-span-full">
              <label className="text-xs  text-gray-700">Unavailable Dates</label>

              {/* Added Range UI */}
              <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 rounded border border-gray-100">
                <div className="flex flex-col gap-1">
                  <label className="text-xs  text-gray-500 uppercase">From Date</label>
                  <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs  text-gray-500 uppercase">To Date</label>
                  <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm" />
                </div>
                <button type="button" onClick={handleAddRange} disabled={!fromDate || !toDate} className="px-4 py-1.5 bg-indigo-100 text-indigo-700  rounded-lg text-sm hover:bg-indigo-200 disabled:opacity-50 transition-colors">
                  Add Date Range
                </button>
              </div>

              {/* Display existing unavailable dates */}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.unavailableDates?.map(date => (
                  <div key={date} className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs  border border-red-100">
                    {date}
                    <button type="button" onClick={() => setFormData({ ...formData, unavailableDates: formData.unavailableDates?.filter(d => d !== date) })} className="hover:text-red-800 ml-1">
                      &times;
                    </button>
                  </div>
                ))}
                {(!formData.unavailableDates || formData.unavailableDates.length === 0) && (
                  <span className="text-xs text-gray-400 font-medium">No unavailable dates configured.</span>
                )}
              </div>
            </div>

            <div className="col-span-full flex justify-end gap-4 mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-gray-500  hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-8 py-2 bg-indigo-600 text-white  rounded-lg shadow-sm">Save Doctor</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(doctor)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm">
                  <FaEdit size={14} />
                </button>
                <button onClick={() => handleDelete(doctor.id)} className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm">
                  <FaTrash size={14} />
                </button>
              </div>
              <img src={doctor.photo} alt={doctor.name} className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" />
              <h4 className=" text-lg">{doctor.name}</h4>
              <span className="text-sm text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full mt-2 mb-4">{doctor.speciality}</span>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mb-2"><FaUserMd /> {doctor.experience}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${doctor.fee && doctor.fee > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {doctor.fee && doctor.fee > 0 ? `Fee: ₹${doctor.fee}` : 'Free Consultation'}
              </span>
              <button
                onClick={() => navigate(`/admin/appointments?tenant_id=${id}&doctor_id=${doctor.id}`)}
                className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-indigo-50"
              >
                <FaCalendarAlt /> Booked Calendar
              </button>
            </div>
          ))}

          {doctors.length === 0 && !isAdding && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No doctors added yet. Click "Add Doctor" to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
