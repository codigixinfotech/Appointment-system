export const DEFAULT_THEME = {
  primaryColor: '#883b4b',
  secondaryColor: '#db2777',
  accentColor: '#f59e0b',
  backgroundColor: '#fdfbfb',
  surfaceColor: '#ffffff',
  textColor: '#1f2937',
  subtextColor: '#6b7280'
};
const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`;
function mapTenant(apiTenant) {
  return {
    id: apiTenant.id,
    name: apiTenant.name,
    brandName: apiTenant.brand_name,
    slug: apiTenant.slug,
    logoUrl: apiTenant.logo_url || '',
    address: apiTenant.address || '',
    phone: apiTenant.phone || '',
    emergencyPhone: apiTenant.emergency_phone || '',
    workingHours: apiTenant.working_hours || [],
    mapEmbedUrl: apiTenant.map_embed_url || '',
    upiId: apiTenant.upi_id || '',
    googlePlaceId: apiTenant.google_place_id || '',
    theme: {
      primaryColor: apiTenant.primary_color || '#883b4b',
      secondaryColor: apiTenant.secondary_color || '#db2777',
      accentColor: apiTenant.accent_color || '#f59e0b',
      backgroundColor: apiTenant.background_color || '#fdfbfb',
      surfaceColor: apiTenant.surface_color || '#ffffff',
      textColor: apiTenant.text_color || '#1f2937',
      subtextColor: apiTenant.subtext_color || '#6b7280'
    }
  };
}
function mapDoctor(apiDoctor) {
  return {
    id: apiDoctor.id,
    tenantId: apiDoctor.tenant_id,
    name: apiDoctor.name,
    speciality: apiDoctor.speciality,
    experience: apiDoctor.experience || '',
    address: apiDoctor.address || '',
    onlineConsult: apiDoctor.online_consult,
    inPerson: apiDoctor.in_person,
    education: apiDoctor.education || '',
    languages: apiDoctor.languages || [],
    rating: apiDoctor.rating || 5.0,
    bio: apiDoctor.bio || '',
    photo: apiDoctor.photo || '',
    email: apiDoctor.email || '',
    phone: apiDoctor.phone || '',
    inPersonHours: apiDoctor.in_person_hours || [],
    onlineHours: apiDoctor.online_hours || [],
    unavailableDates: apiDoctor.unavailable_dates || [],
    fee: apiDoctor.fee || 0
  };
}
class ApiDB {
  // --- Tenants (Hospitals) ---

  async createTenant(tenant) {
    const backendPayload = {
      name: tenant.name,
      brand_name: tenant.brandName,
      slug: tenant.slug,
      logo_url: tenant.logoUrl,
      address: tenant.address,
      phone: tenant.phone,
      emergency_phone: tenant.emergencyPhone,
      working_hours: tenant.workingHours,
      map_embed_url: tenant.mapEmbedUrl,
      upi_id: tenant.upiId,
      google_place_id: tenant.googlePlaceId,
      primary_color: tenant.theme.primaryColor,
      secondary_color: tenant.theme.secondaryColor,
      accent_color: tenant.theme.accentColor,
      background_color: tenant.theme.backgroundColor,
      surface_color: tenant.theme.surfaceColor,
      text_color: tenant.theme.textColor,
      subtext_color: tenant.theme.subtextColor
    };
    const response = await fetch(`${API_BASE}/tenants/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendPayload)
    });
    if (!response.ok) throw new Error('Failed to create tenant');
    return mapTenant(await response.json());
  }
  async getAllTenants() {
    const response = await fetch(`${API_BASE}/tenants/`);
    if (!response.ok) throw new Error('Failed to fetch tenants');
    const data = await response.json();
    return data.map(mapTenant);
  }
  async getTenantBySlug(slug) {
    const tenants = await this.getAllTenants();
    return tenants.find(t => t.slug === slug) || null;
  }
  async getTenantById(id) {
    const response = await fetch(`${API_BASE}/tenants/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch tenant');
    return mapTenant(await response.json());
  }
  async updateTenant(id, updates) {
    const backendPayload = {};
    if (updates.name !== undefined) backendPayload.name = updates.name;
    if (updates.brandName !== undefined) backendPayload.brand_name = updates.brandName;
    if (updates.slug !== undefined) backendPayload.slug = updates.slug;
    if (updates.logoUrl !== undefined) backendPayload.logo_url = updates.logoUrl;
    if (updates.address !== undefined) backendPayload.address = updates.address;
    if (updates.phone !== undefined) backendPayload.phone = updates.phone;
    if (updates.emergencyPhone !== undefined) backendPayload.emergency_phone = updates.emergencyPhone;
    if (updates.workingHours !== undefined) backendPayload.working_hours = updates.workingHours;
    if (updates.mapEmbedUrl !== undefined) backendPayload.map_embed_url = updates.mapEmbedUrl;
    if (updates.upiId !== undefined) backendPayload.upi_id = updates.upiId;
    if (updates.googlePlaceId !== undefined) backendPayload.google_place_id = updates.googlePlaceId;
    if (updates.theme) {
      if (updates.theme.primaryColor !== undefined) backendPayload.primary_color = updates.theme.primaryColor;
      if (updates.theme.secondaryColor !== undefined) backendPayload.secondary_color = updates.theme.secondaryColor;
      if (updates.theme.accentColor !== undefined) backendPayload.accent_color = updates.theme.accentColor;
      if (updates.theme.backgroundColor !== undefined) backendPayload.background_color = updates.theme.backgroundColor;
      if (updates.theme.surfaceColor !== undefined) backendPayload.surface_color = updates.theme.surfaceColor;
      if (updates.theme.textColor !== undefined) backendPayload.text_color = updates.theme.textColor;
      if (updates.theme.subtextColor !== undefined) backendPayload.subtext_color = updates.theme.subtextColor;
    }
    const response = await fetch(`${API_BASE}/tenants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendPayload)
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to update tenant');
    return mapTenant(await response.json());
  }

  // --- Doctors ---

  async createDoctor(doctor) {
    const backendPayload = {
      tenant_id: doctor.tenantId,
      name: doctor.name,
      speciality: doctor.speciality,
      experience: doctor.experience,
      address: doctor.address,
      online_consult: doctor.onlineConsult,
      in_person: doctor.inPerson,
      education: doctor.education,
      languages: doctor.languages,
      rating: doctor.rating,
      bio: doctor.bio,
      photo: doctor.photo,
      email: doctor.email,
      phone: doctor.phone,
      in_person_hours: doctor.inPersonHours,
      online_hours: doctor.onlineHours,
      unavailable_dates: doctor.unavailableDates,
      fee: doctor.fee || 0
    };
    const response = await fetch(`${API_BASE}/doctors/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendPayload)
    });
    if (!response.ok) throw new Error('Failed to create doctor');
    return mapDoctor(await response.json());
  }
  async getDoctorsByTenant(tenantId) {
    const response = await fetch(`${API_BASE}/doctors/tenant/${tenantId}`);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    const data = await response.json();
    return data.map(mapDoctor);
  }
  async updateDoctor(id, updates) {
    const backendPayload = {};
    if (updates.tenantId !== undefined) backendPayload.tenant_id = updates.tenantId;
    if (updates.name !== undefined) backendPayload.name = updates.name;
    if (updates.speciality !== undefined) backendPayload.speciality = updates.speciality;
    if (updates.experience !== undefined) backendPayload.experience = updates.experience;
    if (updates.address !== undefined) backendPayload.address = updates.address;
    if (updates.onlineConsult !== undefined) backendPayload.online_consult = updates.onlineConsult;
    if (updates.inPerson !== undefined) backendPayload.in_person = updates.inPerson;
    if (updates.education !== undefined) backendPayload.education = updates.education;
    if (updates.languages !== undefined) backendPayload.languages = updates.languages;
    if (updates.rating !== undefined) backendPayload.rating = updates.rating;
    if (updates.bio !== undefined) backendPayload.bio = updates.bio;
    if (updates.photo !== undefined) backendPayload.photo = updates.photo;
    if (updates.email !== undefined) backendPayload.email = updates.email;
    if (updates.phone !== undefined) backendPayload.phone = updates.phone;
    if (updates.inPersonHours !== undefined) backendPayload.in_person_hours = updates.inPersonHours;
    if (updates.onlineHours !== undefined) backendPayload.online_hours = updates.onlineHours;
    if (updates.unavailableDates !== undefined) backendPayload.unavailable_dates = updates.unavailableDates;
    if (updates.fee !== undefined) backendPayload.fee = updates.fee;
    const response = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendPayload)
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to update doctor');
    return mapDoctor(await response.json());
  }
  async deleteDoctor(id) {
    const response = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  }

  // --- Appointments ---

  async createAppointment(appointmentData) {
    const response = await fetch(`${API_BASE}/appointments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create appointment');
    }
    return await response.json();
  }
  async getAppointments(tenantId, doctorId, date) {
    const params = new URLSearchParams();
    if (doctorId) params.append('doctor_id', doctorId);
    if (date) params.append('date', date);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE}/appointments/${tenantId}${query}`);
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return await response.json();
  }

  // --- Auth & OTP ---

  async sendOtp(mobile) {
    const response = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobile
      })
    });
    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }
    const data = await response.json();
    return {
      success: true,
      debugOtp: data.debug_otp
    };
  }
  async verifyOtp(mobile, otpCode) {
    const response = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobile,
        otp_code: otpCode
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to verify OTP');
    }
    const data = await response.json();
    return data.verified === true;
  }
}
export const db = new ApiDB();