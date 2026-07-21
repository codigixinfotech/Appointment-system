import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { motion } from 'framer-motion';
import { FaUserMd, FaMapMarkerAlt, FaVideo, FaClock, FaStar, FaHeart, FaCommentDots, FaUser, FaCheckCircle, FaSearch, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { Modal } from '../components/Modal';
import { db } from '../services/db';
import { fetchGoogleReviews, type GooglePlaceResult } from '../services/googlePlaces';
import type { Doctor } from '../services/db';

export const BookingPage = () => {
  const { theme, tenant } = useTheme();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [googlePlaceData, setGooglePlaceData] = useState<GooglePlaceResult | null>(null);

  useEffect(() => {
    if (tenant) {
      db.getDoctorsByTenant(tenant.id).then(setDoctors);
      if (tenant.googlePlaceId) {
        fetchGoogleReviews(tenant.googlePlaceId, import.meta.env.VITE_GOOGLE_API_KEY || '').then(setGooglePlaceData);
      }
    }
  }, [tenant]);

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.speciality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!theme) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-surface)]/80 border-b border-[var(--color-border)] shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {tenant?.logoUrl && (
            <div className="h-10 flex items-center justify-center">
              <img src={tenant.logoUrl} alt="Logo" className="h-full w-auto object-contain" />
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">
            {tenant?.name}
          </h1>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Patient Portal
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Left Side: Doctors List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Our Specialists</h2>
              <p className="text-gray-500 text-sm mt-1">Select a doctor to view their profile or book an appointment.</p>
            </div>
            <div className="relative w-full sm:w-64 shrink-0">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={doctor.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row relative overflow-hidden hover:shadow-md transition-shadow items-stretch"
              >

                {/* Left Side: Photo and Rating */}
                <div className="p-6 pb-8 flex flex-col items-center justify-center relative sm:border-r border-gray-100 bg-gray-50/30 w-full sm:w-56 shrink-0">
                  <div className="absolute top-4 left-4 flex items-center gap-1 text-[var(--color-accent)] text-xs font-bold">
                    {doctor.rating.toFixed(1)} <FaStar />
                  </div>

                  <div className="w-24 h-24 rounded-full border-[3px] border-white p-1 bg-white relative shadow-sm mt-2">
                    <img src={doctor.photo} alt={doctor.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="-mt-3 z-20 bg-white px-4 py-1 rounded-full text-[10px] font-bold shadow-sm border border-gray-100 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                    {doctor.speciality}
                  </div>
                </div>

                {/* Middle: Details */}
                <div className="p-6 flex-1 text-center sm:text-left flex flex-col justify-center relative">
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:text-red-500 cursor-pointer transition-colors shadow-sm border border-gray-100">
                    <FaHeart />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                  <p className="text-sm text-gray-400 mt-2 flex items-center justify-center sm:justify-start gap-1">
                    <FaMapMarkerAlt className="shrink-0" /> {doctor.address}
                  </p>

                  <div className="flex flex-col gap-1 mt-2 text-xs font-medium text-gray-500">
                    {doctor.phone && (
                      <span className="flex items-center justify-center sm:justify-start gap-1">
                        <FaPhoneAlt className="shrink-0 text-gray-400" /> {doctor.phone}
                      </span>
                    )}
                    {doctor.email && (
                      <span className="flex items-center justify-center sm:justify-start gap-1">
                        <FaEnvelope className="shrink-0 text-gray-400" /> {doctor.email}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 text-xs font-medium text-[var(--color-primary)]">
                    <span className="flex items-center gap-1"><FaClock /> {doctor.experience}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-primary)] opacity-30"></span>
                    <span className="flex items-center gap-1"><FaUserMd /> {doctor.education.split(',')[0]}</span>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="w-full sm:w-48 flex flex-row sm:flex-col border-t sm:border-t-0 sm:border-l border-gray-100 shrink-0 bg-gray-50/50">
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="flex-1 py-4 sm:py-0 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors border-r sm:border-r-0 sm:border-b border-gray-100 flex items-center justify-center h-full"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate(`/${tenant?.slug}/book/${doctor.id}`)}
                    className="flex-1 py-4 sm:py-0 text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center h-full bg-white sm:bg-transparent"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Hospital Info & Map */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col relative group">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-[0.03] rounded-bl-full -z-0"></div>

            <div className="p-8 relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">{tenant?.name}</h3>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1 mb-4">{tenant?.brandName}</div>
                </div>
              </div>

              <div className="space-y-5">
                {tenant?.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                      <FaMapMarkerAlt className="text-gray-400 text-sm" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-line">
                      {tenant.address}
                    </p>
                  </div>
                )}

                {tenant?.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                      <FaPhoneAlt className="text-gray-400 text-sm" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                      {tenant.phone}<br />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Main Line</span>
                    </p>
                  </div>
                )}
              </div>

              {tenant?.workingHours && tenant.workingHours.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Working Hours</h4>
                  {tenant.workingHours.map((wh, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-3 rounded-xl mb-2 ${wh.isEmergency ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
                      <span className={`text-sm font-medium ${wh.isEmergency ? 'text-red-600 font-bold' : 'text-gray-500'}`}>{wh.label}</span>
                      <span className={`text-sm font-bold flex items-center gap-1 ${wh.isEmergency ? 'text-red-600' : 'text-gray-800'}`}>
                        {wh.isEmergency && <FaPhoneAlt className="text-xs" />} {wh.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map Placeholder */}
            {tenant?.mapEmbedUrl && (
              <div className="w-full h-[250px] relative mt-2 border-t border-gray-100 p-2 bg-gray-50">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                  <iframe
                    src={tenant.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'contrast(1.1) brightness(0.95)' }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Hospital Map"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      <Modal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      >
        {selectedDoctor && (
          <div className="flex flex-col md:flex-row gap-0 bg-white overflow-hidden rounded-2xl max-w-4xl mx-auto border border-gray-100">
            {/* Left panel (Image + bio card) */}
            <div className="w-full md:w-[420px] flex flex-col relative shrink-0 border-r border-gray-100 pb-6">
              <div className="bg-[#eaf4fe] h-44 w-full relative">
                <img src={selectedDoctor.photo} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-52 object-cover object-top drop-shadow-md" style={{ clipPath: 'inset(0 0 0 0 round 9999px 9999px 0 0)' }} alt={selectedDoctor.name} />
              </div>
              <div className="bg-white rounded-t-[30px] -mt-6 relative z-10 px-8 pt-6 pb-2 flex flex-col shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{selectedDoctor.name}</h2>
                    <div className="text-sm text-gray-400 mt-1 font-medium">{selectedDoctor.speciality}, {tenant?.brandName}</div>
                    <div className="text-sm mt-1.5 flex items-center gap-1 font-medium" style={{ color: 'var(--color-primary)' }}>
                      <FaMapMarkerAlt /> {selectedDoctor.address.split(',')[0]}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-md cursor-pointer mt-1 hover:shadow-lg transition-shadow bg-[var(--color-primary)]">
                    <FaCommentDots className="text-xl" />
                  </div>
                </div>

                <div className="flex justify-between gap-3 mt-8">
                  <div className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 px-2 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Patients</span>
                    <div className="flex items-center gap-1.5 text-base font-bold text-gray-800"><FaUser className="text-[var(--color-primary)]" /> 380+</div>
                  </div>
                  <div className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 px-2 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Experience</span>
                    <div className="flex items-center gap-1.5 text-base font-bold text-gray-800"><FaCheckCircle className="text-[var(--color-primary)]" /> {selectedDoctor.experience.split(' ')[0]} Yrs+</div>
                  </div>
                  <div className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 px-2 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Rating</span>
                    <div className="flex items-center gap-1.5 text-base font-bold text-gray-800"><FaStar className="text-[var(--color-primary)]" /> {selectedDoctor.rating.toFixed(1)}</div>
                  </div>
                </div>

                {(selectedDoctor.email || selectedDoctor.phone) && (
                  <div className="mt-8">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Contact</h3>
                    <div className="flex flex-col gap-2">
                      {selectedDoctor.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaEnvelope className="text-[var(--color-primary)]" /> {selectedDoctor.email}
                        </div>
                      )}
                      {selectedDoctor.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaPhoneAlt className="text-[var(--color-primary)]" /> {selectedDoctor.phone}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <h3 className="font-bold text-gray-800 mt-8 mb-3 text-lg">About</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{selectedDoctor.bio}</p>

                <h3 className="font-bold text-gray-800 mt-8 mb-4 text-lg">Reviews</h3>
                <div className="flex items-center">
                  {googlePlaceData?.reviews && googlePlaceData.reviews.length > 0 ? (
                    <>
                      {googlePlaceData.reviews.slice(0, 5).map((review, idx) => (
                        <img
                          key={idx}
                          src={review.profile_photo_url}
                          className={`w-10 h-10 rounded-full border-2 border-white relative shadow-sm ${idx > 0 ? '-ml-3' : ''}`}
                          style={{ zIndex: 10 + idx * 10 }}
                          alt={review.author_name}
                          title={review.author_name}
                        />
                      ))}
                      {googlePlaceData.user_ratings_total && googlePlaceData.user_ratings_total > 5 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-50 flex items-center justify-center text-[10px] text-white font-bold shadow-sm bg-[var(--color-primary)]">
                          {googlePlaceData.user_ratings_total}+
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white relative z-10 shadow-sm" alt="review" />
                      <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-20 shadow-sm" alt="review" />
                      <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-30 shadow-sm" alt="review" />
                      <img src="https://i.pravatar.cc/100?img=4" className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-40 shadow-sm" alt="review" />
                      <img src="https://i.pravatar.cc/100?img=5" className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-50 shadow-sm" alt="review" />
                      <div className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-50 flex items-center justify-center text-xs text-white font-bold shadow-sm bg-[var(--color-primary)]">15+</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right panel (Availability & Book) */}
            <div className="flex-1 flex flex-col p-4 bg-gray-50/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Availability</h3>

              <div className="flex-1 flex flex-col gap-6">
                {/* In Person Schedule */}
                {selectedDoctor.inPerson && (
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg"><FaUserMd className="text-gray-400" /> In Person Visits</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="text-sm font-medium text-gray-500">Available Slots</span>
                        <span className="text-sm font-bold text-gray-700">{(selectedDoctor.inPersonHours && selectedDoctor.inPersonHours.length > 0) ? `${selectedDoctor.inPersonHours.length} slots` : 'Not Configured'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Online Schedule */}
                {selectedDoctor.onlineConsult && (
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg"><FaVideo className="text-green-500" /> Online Consultation</h3>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-sm font-medium text-gray-500">Available Slots</span>
                      <span className="text-sm font-bold text-gray-700">{(selectedDoctor.onlineHours && selectedDoctor.onlineHours.length > 0) ? `${selectedDoctor.onlineHours.length} slots` : 'Not Configured'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200/60">
                <button
                  onClick={() => navigate(`/${tenant?.slug}/book/${selectedDoctor.id}`)}
                  className="w-full py-4 rounded-[14px] font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg flex items-center justify-center gap-2 text-[17px] bg-[var(--color-primary)]"
                >
                  Book an Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
