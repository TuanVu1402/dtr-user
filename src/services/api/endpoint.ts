/**
 * API Endpoints - All routes for the backend API
 * Organized by domain modules
 */

export const endpoints = {
  // ============ AUTH ============
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    status: '/auth/status',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  // ============ USERS ============
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
  },

  // ============ PROJECTS (Real Estate) ============
  projects: {
    list: '/projects',
    detail: (slug: string) => `/projects/${slug}`,
    units: (projectId: string) => `/projects/${projectId}/units`,
    compare: '/projects/compare',
    favorite: '/projects/favorites',
    favoriteToggle: (projectId: string) => `/projects/${projectId}/favorite`,
  },

  // ============ DEVELOPERS (Chủ đầu tư) ============
  developers: {
    list: '/developers',
    detail: (id: string) => `/developers/${id}`,
    projects: (id: string) => `/developers/${id}/projects`,
  },

  // ============ AREAS (Khu vực) ============
  areas: {
    list: '/areas',
    detail: (id: string) => `/areas/${id}`,
    projects: (id: string) => `/areas/${id}/projects`,
  },

  // ============ PROPERTY TYPES (Loại hình) ============
  propertyTypes: {
    list: '/property-types',
    detail: (id: string) => `/property-types/${id}`,
  },

  // ============ UNITS (Căn hộ) ============
  units: {
    list: '/units',
    detail: (id: string) => `/units/${id}`,
    availability: '/units/availability',
  },

  // ============ NEWS ============
  news: {
    list: '/news',
    detail: (slug: string) => `/news/${slug}`,
    categories: '/news/categories',
    latest: '/news/latest',
  },

  // ============ FAVORITES ============
  favorites: {
    list: '/favorites',
    add: '/favorites',
    remove: (id: string) => `/favorites/${id}`,
  },

  // ============ COMPARISON ============
  comparison: {
    add: '/comparison/add',
    remove: '/comparison/remove',
    list: '/comparison',
    clear: '/comparison/clear',
  },

  // ============ LEADS ============
  leads: {
    create: '/leads',
    list: '/leads',
  },

  // ============ UPLOADS ============
  uploads: {
    image: '/uploads/image',
    video: '/uploads/video',
  },
} as const;

// Type-safe helper for building URLs with query params
export function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string {
  if (!params) return endpoint;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}
