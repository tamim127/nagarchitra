/**
 * NagarChitra BD - Production API Client
 * Connects frontend to the Express + TypeScript backend (http://localhost:5000/api)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const token = localStorage.getItem('nagarchitra_jwt_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    // ignore
  }
  return {};
}

export const apiClient = {
  // Health
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success && data.data?.token) {
      localStorage.setItem('nagarchitra_jwt_token', data.data.token);
    }
    return data;
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    department?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success && data.data?.token) {
      localStorage.setItem('nagarchitra_jwt_token', data.data.token);
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Issues
  async getIssues(params?: {
    status?: string;
    category?: string;
    severity?: string;
    area?: string;
    ward?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE_URL}/issues?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getIssueById(id: string) {
    const res = await fetch(`${API_BASE_URL}/issues/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async createIssue(payload: any) {
    const res = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async updateIssueStatus(
    id: string,
    payload: {
      newStatus: string;
      note: string;
      evidenceUrl?: string;
      assignedDepartment?: string;
      assignedOfficer?: string;
    }
  ) {
    const res = await fetch(`${API_BASE_URL}/issues/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async confirmIssue(id: string) {
    const res = await fetch(`${API_BASE_URL}/issues/${id}/confirm`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async voteResolution(id: string, vote: 'FIXED' | 'STILL_EXISTS', comment?: string) {
    const res = await fetch(`${API_BASE_URL}/issues/${id}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ vote, comment }),
    });
    return res.json();
  },

  async followIssue(id: string) {
    const res = await fetch(`${API_BASE_URL}/issues/${id}/follow`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async getNearbyDuplicates(lat: number, lng: number, categoryId?: string, radius?: number) {
    const query = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      radius: String(radius || 500),
    });
    if (categoryId) query.set('categoryId', categoryId);

    const res = await fetch(`${API_BASE_URL}/issues/nearby?${query.toString()}`);
    return res.json();
  },

  // Stats
  async getOverallStats() {
    const res = await fetch(`${API_BASE_URL}/stats/overall`);
    return res.json();
  },

  async getAreaSummaries() {
    const res = await fetch(`${API_BASE_URL}/stats/areas`);
    return res.json();
  },
};

export default apiClient;
