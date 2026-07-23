import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaMapMarkerAlt, FaVideo, FaClock, FaStar, FaHeart, FaCommentDots, FaUser, FaCheckCircle, FaSearch, FaPhoneAlt, FaEnvelope, FaTimes, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { Modal } from '../components/Modal';
import { db } from '../services/db';
import { fetchGoogleReviews } from '../services/googlePlaces';
export const BookingPage = () => {
  const {
    theme,
    tenant
  } = useTheme();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [calendarDoctor, setCalendarDoctor] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalDateStr, setSelectedCalDateStr] = useState('');
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [googlePlaceData, setGooglePlaceData] = useState(null);
  const [selectedDoctorPatientCount, setSelectedDoctorPatientCount] = useState("...");
  useEffect(() => {
    if (tenant) {
      db.getDoctorsByTenant(tenant.id).then(setDoctors);
      if (tenant.googlePlaceId) {
        fetchGoogleReviews(tenant.googlePlaceId, import.meta.env.VITE_GOOGLE_API_KEY || '').then(setGooglePlaceData);
      }
    }
  }, [tenant]);
  useEffect(() => {
    if (tenant && calendarDoctor) {
      setLoadingAppts(true);
      const today = new Date();
      setSelectedCalDateStr(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
      db.getAppointments(tenant.id, calendarDoctor.id).then(setDoctorAppointments).catch(err => {
        console.error("Failed to fetch doctor appointments", err);
        setDoctorAppointments([]);
      }).finally(() => setLoadingAppts(false));
    } else {
      setDoctorAppointments([]);
    }
  }, [tenant, calendarDoctor]);
  useEffect(() => {
    if (tenant && selectedDoctor) {
      setSelectedDoctorPatientCount("...");
      db.getAppointments(tenant.id, selectedDoctor.id).then(appts => {
        setSelectedDoctorPatientCount(appts.length);
      }).catch(err => {
        console.error("Failed to fetch patients count", err);
        setSelectedDoctorPatientCount("N/A");
      });
    }
  }, [tenant, selectedDoctor]);
  const filteredDoctors = doctors.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.speciality.toLowerCase().includes(searchQuery.toLowerCase()));
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calFirstDay = new Date(calYear, calMonth, 1).getDay();
  const prevCalMonth = () => setCalendarDate(new Date(calYear, calMonth - 1, 1));
  const nextCalMonth = () => setCalendarDate(new Date(calYear, calMonth + 1, 1));
  const getCalDateString = day => {
    return `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  if (!theme) return null;
  return <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-surface)]/80 border-b border-[var(--color-border)] shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {tenant?.logoUrl && <div className="h-10 flex items-center justify-center">
              <img src={tenant.logoUrl} alt="Logo" className="h-full w-auto object-contain" />
            </div>}
          <h1 className="text-2xl  tracking-tight text-[var(--color-text-main)]">
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
              <h2 className="text-2xl  text-[var(--color-text-main)]">Our Specialists</h2>
              <p className="text-gray-500 text-sm mt-1">Select a doctor to view their profile or book an appointment.</p>
            </div>
            <div className="relative w-full sm:w-64 shrink-0">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search name or service..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {filteredDoctors.map((doctor, index) => <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} key={doctor.id} className="bg-white rounded  shadow-sm border border-gray-100 flex flex-col sm:flex-row relative overflow-hidden hover:shadow-md transition-shadow items-stretch">

                {/* Left Side: Photo and Rating */}
                <div className="p-6 pb-8 flex flex-col items-center justify-center relative sm:border-r border-gray-100 bg-gray-50/30 w-full sm:w-56 shrink-0">
                  <div className="absolute top-4 left-4 flex items-center gap-1 text-[var(--color-accent)] text-xs ">
                    {doctor.rating.toFixed(1)} <FaStar />
                  </div>

                  <div className="w-24 h-24 rounded-full border-[3px] border-white p-1 bg-white relative shadow-sm mt-2">
                    <img src={doctor.photo} alt={doctor.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="-mt-3 z-20 bg-white px-4 py-1 rounded-full text-[10px]  shadow-sm border border-gray-100 uppercase tracking-wider" style={{
                color: 'var(--color-primary)'
              }}>
                    {doctor.speciality}
                  </div>
                </div>

                {/* Middle: Details */}
                <div className="p-6 flex-1 text-center sm:text-left flex flex-col justify-center relative">
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:text-red-500 cursor-pointer transition-colors shadow-sm border border-gray-100">
                    <FaHeart />
                  </div>

                  <h3 className="text-xl  text-gray-800">{doctor.name}</h3>
                  <p className="text-sm text-gray-400 mt-2 flex items-center justify-center sm:justify-start gap-1">
                    <FaMapMarkerAlt className="shrink-0" /> {doctor.address}
                  </p>

                  <div className="flex flex-col gap-1 mt-2 text-xs font-medium text-gray-500">
                    {doctor.phone && <span className="flex items-center justify-center sm:justify-start gap-1">
                        <FaPhoneAlt className="shrink-0 text-gray-400" /> {doctor.phone}
                      </span>}
                    {doctor.email && <span className="flex items-center justify-center sm:justify-start gap-1">
                        <FaEnvelope className="shrink-0 text-gray-400" /> {doctor.email}
                      </span>}
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 text-xs font-medium text-[var(--color-primary)]">
                    <span className="flex items-center gap-1"><FaClock /> {doctor.experience}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-primary)] opacity-30"></span>
                    <span className="flex items-center gap-1"><FaUserMd /> {doctor.education.split(',')[0]}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-primary)] opacity-30"></span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${doctor.fee && doctor.fee > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {doctor.fee && doctor.fee > 0 ? `₹${doctor.fee}` : 'Free'}
                    </span>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="w-full sm:w-48 flex flex-row sm:flex-col border-t sm:border-t-0 sm:border-l border-gray-100 shrink-0 bg-gray-50/50">
                  <button onClick={() => setSelectedDoctor(doctor)} className="flex-1 py-3 sm:py-0 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors border-r sm:border-r-0 sm:border-b border-gray-100 flex items-center justify-center">
                    View Profile
                  </button>
                  <button onClick={() => {
                setCalendarDoctor(doctor);
                setCalendarDate(new Date());
              }} className="flex-1 py-3 sm:py-0 text-xs font-semibold text-indigo-600 hover:bg-gray-100 transition-colors border-r sm:border-r-0 sm:border-b border-gray-100 flex items-center justify-center">
                    Booked Calendar
                  </button>
                  <button onClick={() => navigate(`/${tenant?.slug}/book/${doctor.id}`)} className="flex-1 py-3 sm:py-0 text-xs font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center bg-white sm:bg-transparent" style={{
                color: 'var(--color-primary)'
              }}>
                    Book Appointment
                  </button>
                </div>
              </motion.div>)}
          </div>
        </div>

        {/* Right Side: Hospital Info & Map */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white border border-gray-100 rounded overflow-hidden shadow-sm flex flex-col relative group">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-[0.03] rounded-bl-full -z-0"></div>

            <div className="p-3 relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl  text-[var(--color-text-main)] mb-2">{tenant?.name}</h3>
                  <div className="text-[10px]  uppercase tracking-wider text-gray-400 mt-1 mb-4">{tenant?.brandName}</div>
                </div>
              </div>

              <div className="space-y-5">
                {tenant?.address && <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                      <FaMapMarkerAlt className="text-gray-400 text-sm" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-line">
                      {tenant.address}
                    </p>
                  </div>}

                {tenant?.phone && <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                      <FaPhoneAlt className="text-gray-400 text-sm" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                      {tenant.phone}<br />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Main Line</span>
                    </p>
                  </div>}
              </div>

              {tenant?.workingHours && tenant.workingHours.length > 0 && <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-xs  text-gray-400 uppercase tracking-wider mb-4">Working Hours</h4>
                  {tenant.workingHours.map((wh, idx) => <div key={idx} className={`flex justify-between items-center p-3 rounded mb-2 ${wh.isEmergency ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
                      <span className={`text-sm font-medium ${wh.isEmergency ? 'text-red-600 ' : 'text-gray-500'}`}>{wh.label}</span>
                      <span className={`text-sm  flex items-center gap-1 ${wh.isEmergency ? 'text-red-600' : 'text-gray-800'}`}>
                        {wh.isEmergency && <FaPhoneAlt className="text-xs" />} {wh.time}
                      </span>
                    </div>)}
                </div>}
            </div>

            {/* Map Placeholder */}
            {tenant?.mapEmbedUrl && <div className="w-full h-[250px] relative mt-2 border-t border-gray-100 p-2 bg-gray-50">
                <div className="w-full h-full rounded overflow-hidden shadow-sm border border-gray-200">
                  {tenant.mapEmbedUrl.includes('maps/embed') || tenant.mapEmbedUrl.includes('google.com/maps/d/embed') ? <iframe src={tenant.mapEmbedUrl} width="100%" height="100%" style={{
                border: 0,
                filter: 'contrast(1.1) brightness(0.95)'
              }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Hospital Map"></iframe> : <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white text-center">
                      <FaMapMarkerAlt className="text-3xl text-red-500 mb-2" />
                      <h5 className="font-semibold text-gray-700 text-sm mb-1">Hospital Location</h5>
                      <p className="text-xs text-gray-500 mb-4 max-w-[220px] truncate-3-lines">
                        {tenant.address || 'Click below to view the location on Google Maps.'}
                      </p>
                      <a href={tenant.mapEmbedUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-white rounded text-xs font-semibold transition hover:opacity-90" style={{
                  backgroundColor: theme.primaryColor
                }}>
                        Open in Google Maps
                      </a>
                    </div>}
                </div>
              </div>}
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      <Modal isOpen={!!selectedDoctor} onClose={() => setSelectedDoctor(null)} maxWidth="max-w-4xl" noPadding={true}>
        {selectedDoctor && <div className="flex flex-col md:flex-row gap-0 bg-white overflow-hidden rounded-2xl max-w-4xl mx-auto border border-gray-100">
            {/* Left panel (Image + bio card) */}
            <div className="w-full md:w-[420px] flex flex-col relative shrink-0 border-r border-gray-100 pb-4">
              <div className="bg-[#eaf4fe] h-28 w-full relative">
                <img src={selectedDoctor.photo} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 object-cover object-top drop-shadow-md" style={{
              clipPath: 'inset(0 0 0 0 round 9999px 9999px 0 0)'
            }} alt={selectedDoctor.name} />
              </div>
              <div className="bg-white rounded-t-[30px] -mt-4 relative z-10 px-6 pt-4 pb-2 flex flex-col shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl  text-gray-800 tracking-tight">{selectedDoctor.name}</h2>
                    <div className="text-sm text-gray-400 mt-1 font-medium">{selectedDoctor.speciality}, {tenant?.brandName}</div>
                    <div className="text-sm mt-1.5 flex items-center gap-1 font-medium" style={{
                  color: 'var(--color-primary)'
                }}>
                      <FaMapMarkerAlt /> {selectedDoctor.address.split(',')[0]}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm cursor-pointer mt-1 hover:shadow-md transition-shadow bg-[var(--color-primary)]">
                    <FaCommentDots className="text-lg" />
                  </div>
                </div>

                <div className="flex justify-between gap-2 mt-4">
                  <div className="flex-1 bg-white border border-gray-100 rounded-xl py-2 px-2 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[9px] text-gray-400  uppercase tracking-wider mb-1">Patients</span>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-800"><FaUser className="text-[var(--color-primary)] text-xs" /> {selectedDoctorPatientCount}</div>
                  </div>
                  <div className="flex-1 bg-white border border-gray-100 rounded-xl py-2 px-2 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[9px] text-gray-400  uppercase tracking-wider mb-1">Experience</span>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-800"><FaCheckCircle className="text-[var(--color-primary)] text-xs" /> {selectedDoctor.experience.split(' ')[0]} Yrs+</div>
                  </div>
                  <div className="flex-1 bg-white border border-gray-100 rounded-xl py-2 px-2 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[9px] text-gray-400  uppercase tracking-wider mb-1">Rating</span>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-800"><FaStar className="text-[var(--color-primary)] text-xs" /> {googlePlaceData?.rating ? googlePlaceData.rating.toFixed(1) : selectedDoctor.rating.toFixed(1)}</div>
                  </div>
                </div>

                {(selectedDoctor.email || selectedDoctor.phone) && <div className="mt-4">
                    <h3 className=" text-gray-800 mb-1 text-sm font-semibold">Contact</h3>
                    <div className="flex flex-col gap-2">
                      {selectedDoctor.email && <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaEnvelope className="text-[var(--color-primary)]" /> {selectedDoctor.email}
                        </div>}
                      {selectedDoctor.phone && <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaPhoneAlt className="text-[var(--color-primary)]" /> {selectedDoctor.phone}
                        </div>}
                    </div>
                  </div>}

                <div className="mt-4">
                  <h3 className=" text-gray-800 mb-1 text-sm font-semibold">Consultation</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${selectedDoctor.fee && selectedDoctor.fee > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {selectedDoctor.fee && selectedDoctor.fee > 0 ? `Fee: ₹${selectedDoctor.fee}` : 'Free'}
                    </span>
                  </div>
                </div>

                <h3 className=" text-gray-800 mt-4 mb-1 text-sm font-semibold">About</h3>
                <p className="text-xs text-gray-500 leading-snug font-medium line-clamp-3">{selectedDoctor.bio}</p>

                <h3 className=" text-gray-800 mt-4 mb-2 text-sm font-semibold">Reviews</h3>
                <div className="flex items-center">
                  {googlePlaceData?.reviews && googlePlaceData.reviews.length > 0 ? <>
                      {googlePlaceData.reviews.slice(0, 5).map((review, idx) => <img key={idx} src={review.profile_photo_url} className={`w-10 h-10 rounded-full border-2 border-white relative shadow-sm ${idx > 0 ? '-ml-3' : ''}`} style={{
                  zIndex: 10 + idx * 10
                }} alt={review.author_name} title={review.author_name} />)}
                      {googlePlaceData.user_ratings_total && googlePlaceData.user_ratings_total > 5 && <div className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-50 flex items-center justify-center text-[10px] text-white  shadow-sm bg-[var(--color-primary)]">
                          {googlePlaceData.user_ratings_total}+
                        </div>}
                    </> : <>
                      <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white relative z-10 shadow-sm" alt="review" />
                      <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-20 shadow-sm" alt="review" />
                      <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-30 shadow-sm" alt="review" />
                      <img src="https://i.pravatar.cc/100?img=4" className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-40 shadow-sm" alt="review" />
                      <img src="https://i.pravatar.cc/100?img=5" className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-50 shadow-sm" alt="review" />
                      <div className="w-10 h-10 rounded-full border-2 border-white -ml-3 relative z-50 flex items-center justify-center text-xs text-white  shadow-sm bg-[var(--color-primary)]">15+</div>
                    </>}
                </div>
              </div>
            </div>

            {/* Right panel (Availability & Book) */}
            <div className="flex-1 flex flex-col p-4 bg-gray-50/50 justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Availability</h3>

                <div className="flex-1 flex flex-col gap-3">
                {/* In Person Schedule */}
                {selectedDoctor.inPerson && <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className=" text-gray-800 mb-2 flex items-center gap-2 text-sm font-semibold"><FaUserMd className="text-gray-400" /> In Person Visits</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                        <span className="text-xs font-medium text-gray-500">Available Slots</span>
                        <span className="text-xs font-semibold text-gray-700">{selectedDoctor.inPersonHours && selectedDoctor.inPersonHours.length > 0 ? `${selectedDoctor.inPersonHours.length} slots` : 'Not Configured'}</span>
                      </div>
                    </div>
                  </div>}

                {/* Online Schedule */}
                {selectedDoctor.onlineConsult && <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className=" text-gray-800 mb-2 flex items-center gap-2 text-sm font-semibold"><FaVideo className="text-green-500" /> Online Consultation</h3>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-xs font-medium text-gray-500">Available Slots</span>
                      <span className="text-xs font-semibold text-gray-700">{selectedDoctor.onlineHours && selectedDoctor.onlineHours.length > 0 ? `${selectedDoctor.onlineHours.length} slots` : 'Not Configured'}</span>
                    </div>
                  </div>}
              </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200/60">
                <button onClick={() => navigate(`/${tenant?.slug}/book/${selectedDoctor.id}`)} className="w-full py-3 rounded-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md flex items-center justify-center gap-2 text-sm bg-[var(--color-primary)]">
                  Book an Appointment
                </button>
              </div>
            </div>
          </div>}
      </Modal>      {/* Booked Calendar Modal */}
      <AnimatePresence>
        {calendarDoctor && <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onClick={() => setCalendarDoctor(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col z-10 max-h-[90vh]">
              {/* Header: Dynamic Theme-colored Gradient Banner */}
              <div className="relative overflow-hidden p-5 flex justify-between items-center text-white select-none shrink-0" style={{
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryColor}dd 100%)`
          }}>
                {/* Decorative design graphic */}
                <div className="absolute right-0 top-0 w-36 h-36 bg-white/5 rounded-full -translate-y-8 translate-x-8 blur-xl pointer-events-none"></div>
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 rounded-xl border-2 border-white/20 overflow-hidden shadow-md shrink-0 bg-white">
                    <img src={calendarDoctor.photo} alt={calendarDoctor.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                      <FaCalendarAlt className="text-white/80 text-base" /> Booked Appointments
                    </h3>
                    <p className="text-[11px] text-white/85 mt-0.5 font-medium">
                      Dr. {calendarDoctor.name} • <span className="text-white">{calendarDoctor.speciality}</span>
                    </p>
                  </div>
                </div>
                
                <button onClick={() => setCalendarDoctor(null)} className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all shadow-sm active:scale-95 z-10">
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 flex-1 flex flex-col overflow-y-auto">
                {loadingAppts ? <div className="h-80 flex flex-col items-center justify-center text-gray-400 font-semibold gap-3">
                    <div className="animate-spin rounded-full h-7 w-7 border-3 border-[var(--color-primary)] border-t-transparent"></div>
                    <span className="text-xs font-medium">Retrieving schedule...</span>
                  </div> : <div className="flex flex-col md:flex-row gap-5 flex-1">
                    
                    {/* Left Column: Compact Datepicker Calendar */}
                    <div className="w-full md:w-[270px] shrink-0 border border-gray-150 rounded-2xl p-3.5 bg-gray-50/50 shadow-sm flex flex-col gap-2.5">
                      {/* Navigation */}
                      <div className="flex justify-between items-center bg-white border border-gray-150 px-2.5 py-1.5 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                        <span className="font-bold text-gray-700 text-xs">
                          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][calendarDate.getMonth()]} {calendarDate.getFullYear()}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={prevCalMonth} className="w-6.5 h-6.5 rounded-md bg-white hover:bg-gray-50 text-gray-500 flex items-center justify-center shadow-sm border border-gray-200 transition active:scale-95">
                            <FaChevronLeft className="text-[8px]" />
                          </button>
                          <button onClick={nextCalMonth} className="w-6.5 h-6.5 rounded-md bg-white hover:bg-gray-50 text-gray-500 flex items-center justify-center shadow-sm border border-gray-255 transition active:scale-95">
                            <FaChevronRight className="text-[8px]" />
                          </button>
                        </div>
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-7 gap-y-1 text-center">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => <div key={idx} className="text-[9px] font-bold text-gray-400 uppercase py-0.5">
                            {day}
                          </div>)}

                        {(() => {
                    const cells = [];
                    for (let i = 0; i < calFirstDay; i++) {
                      cells.push(<div key={`empty-${i}`} className="h-7 w-7" />);
                    }
                    for (let day = 1; day <= calDaysInMonth; day++) {
                      const dateStr = getCalDateString(day);
                      const dayBookings = doctorAppointments.filter(a => a.date === dateStr);
                      const isToday = new Date().toDateString() === new Date(calYear, calMonth, day).toDateString();
                      const isSelected = selectedCalDateStr === dateStr;
                      cells.push(<button key={`day-${day}`} type="button" onClick={() => setSelectedCalDateStr(dateStr)} className={`h-7 w-7 rounded-full flex flex-col items-center justify-center relative transition-all mx-auto text-xs font-semibold ${isSelected ? 'bg-indigo-600 text-white shadow-md font-bold' : isToday ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-gray-700 hover:bg-gray-150'}`}>
                                <span>{day}</span>
                                {dayBookings.length > 0 && !isSelected && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-red-500"></span>}
                              </button>);
                    }
                    return cells;
                  })()}
                      </div>
                    </div>

                    {/* Right Column: Booked Slots Details Panel */}
                    <div className="flex-1 flex flex-col gap-3.5 border border-gray-150 rounded-2xl p-4 bg-white shadow-sm min-h-[220px]">
                      <div className="border-b border-gray-100 pb-1.5 shrink-0">
                        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Booked Slots</h4>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          {selectedCalDateStr ? new Date(selectedCalDateStr).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'No date selected'}
                        </p>
                      </div>

                      <div className="flex-1 overflow-y-auto max-h-[190px] pr-1 flex flex-col gap-1.5">
                        {(() => {
                    const dayBookings = doctorAppointments.filter(a => a.date === selectedCalDateStr);
                    if (dayBookings.length === 0) {
                      return <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400 my-auto">
                                <FaCheckCircle className="text-2xl text-emerald-500 mb-2 opacity-80" />
                                <span className="text-xs font-bold text-gray-600">All slots available</span>
                                <span className="text-[9px] text-gray-400 mt-0.5">No booked appointments for this date.</span>
                              </div>;
                    }
                    return dayBookings.map(b => <div key={b.id} className="flex items-center gap-2.5 p-2 bg-red-50/50 hover:bg-red-50 border border-red-100/50 rounded-xl transition-colors shrink-0">
                              <div className="w-7 h-7 rounded-lg bg-red-100/70 text-red-600 flex items-center justify-center shrink-0">
                                  <FaClock className="text-xs" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-800 leading-none mb-0.5">{b.time_slot}</span>
                                <span className="text-[9px] text-gray-400 font-semibold">{b.type === 'Online' ? 'Video Consult' : 'Clinic Visit'}</span>
                              </div>
                              <span className="ml-auto text-[9px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-200/20">
                                Booked
                              </span>
                            </div>);
                  })()}
                      </div>
                    </div>

                  </div>}
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t border-gray-100 p-4 bg-gray-50 shrink-0">
                <button onClick={() => setCalendarDoctor(null)} className="px-5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95">
                  Close Calendar
                </button>
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>
    </div>;
};