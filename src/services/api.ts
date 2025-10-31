import axios, { AxiosError } from 'axios'
import type {
  CreateLogRequest,
  CreateLogResponse,
  UpdateLogRequest,
  ExperienceLog,
  GetUserLogsResponse,
  GetPlaceLogsResponse,
  GetAverageRatingResponse,
  GetTriedPlacesResponse,
  GenerateProfileSummaryResponse,
  CreatePlaceRequest,
  CreatePlaceResponse,
  EditPlaceRequest,
  GetPlaceDetailsResponse,
  FindNearbyResponse,
  SearchByNameResponse,
  FilterPlacesResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  GetSavedPlacesResponse,
  GetRecommendationsResponse,
  RefreshRecommendationsRequest
} from '@/types/api'

// Use environment variable for deployed site, default to /api for local development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

console.log('🔧 API Configuration:')
console.log('  VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('  Using API_BASE_URL:', API_BASE_URL)

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 second timeout
  validateStatus: (status) => status < 500 // Don't throw on 4xx errors
})

// Error handler (robust to non-object response.data)
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>
    if (axiosError.response) {
      const data = axiosError.response.data
      const message = (data && typeof data === 'object' && 'error' in (data as any))
        ? String((data as any).error)
        : (typeof data === 'string' && data.trim().length > 0)
          ? data
          : 'An error occurred'
      throw new Error(message)
    } else if (axiosError.request) {
      throw new Error('No response from server')
    }
  }
  throw new Error(error instanceof Error ? error.message : 'Unknown error')
}

// ExperienceLog API
export const experienceLogAPI = {
  createLog: async (data: CreateLogRequest): Promise<CreateLogResponse> => {
    try {
      console.log('API: createLog called with data:', data)
      console.log('API: Posting to:', API_BASE_URL + '/ExperienceLog/create_log')
      const response = await apiClient.post<CreateLogResponse>('/ExperienceLog/create_log', data)
      console.log('API: createLog response:', response.data)
      return response.data
    } catch (error) {
      console.error('API: createLog error:', error)
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - server took too long to respond')
      }
      return handleError(error)
    }
  },

  updateLog: async (data: UpdateLogRequest): Promise<{ log: ExperienceLog }> => {
    try {
      const response = await apiClient.post<{ log: ExperienceLog }>('/ExperienceLog/update_log', data)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  deleteLog: async (logId: string): Promise<Record<string, never>> => {
    try {
      const response = await apiClient.post<Record<string, never>>('/ExperienceLog/delete_log', { logId })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  getUserLogs: async (userId: string): Promise<GetUserLogsResponse> => {
    try {
      const response = await apiClient.post<GetUserLogsResponse>('/ExperienceLog/_get_user_logs', { userId })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  getPlaceLogs: async (userId: string, placeId: string): Promise<GetPlaceLogsResponse> => {
    try {
      const response = await apiClient.post<GetPlaceLogsResponse>('/ExperienceLog/_get_place_logs', { userId, placeId })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  getAverageRating: async (userId: string, placeId: string): Promise<GetAverageRatingResponse> => {
    try {
      const response = await apiClient.post<GetAverageRatingResponse>('/ExperienceLog/_get_average_rating', { userId, placeId })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  getTriedPlaces: async (userId: string): Promise<GetTriedPlacesResponse> => {
    try {
      const response = await apiClient.post<GetTriedPlacesResponse>('/ExperienceLog/_get_tried_places', { userId })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  generateProfileSummary: async (userId: string): Promise<GenerateProfileSummaryResponse> => {
    const response = await apiClient.post('/ExperienceLog/generate_profile_summary', { userId });
    return response.data;
  }
}

// PlaceDirectory API
export const placeDirectoryAPI = {
  createPlace: async (data: CreatePlaceRequest): Promise<CreatePlaceResponse> => {
    try {
      const response = await apiClient.post<CreatePlaceResponse>('/PlaceDirectory/create_place', data)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  editPlace: async (data: EditPlaceRequest): Promise<Record<string, never>> => {
    try {
      const response = await apiClient.post<Record<string, never>>('/PlaceDirectory/edit_place', data)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  deletePlace: async (placeId: string): Promise<Record<string, never>> => {
    try {
      const response = await apiClient.post<Record<string, never>>('/PlaceDirectory/delete_place', { placeId })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  findNearby: async (coords: [number, number], radius: number): Promise<FindNearbyResponse> => {
    try {
      console.log('API: findNearby called with coords:', coords, 'radius:', radius)
      console.log('API: Using base URL:', API_BASE_URL)
      const response = await apiClient.post<FindNearbyResponse>('/PlaceDirectory/_find_nearby', { coords, radius })
      console.log('API: findNearby response:', response.data)
      return response.data
    } catch (error) {
      console.error('API: findNearby error:', error)
      return handleError(error)
    }
  },

  searchByName: async (query: string): Promise<SearchByNameResponse> => {
    try {
      const response = await apiClient.post<SearchByNameResponse>('/PlaceDirectory/_search_by_name', { query })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  filterPlaces: async (filters: { priceRange?: string; hours?: string; style?: string }): Promise<FilterPlacesResponse> => {
    try {
      const response = await apiClient.post<FilterPlacesResponse>('/PlaceDirectory/_filter_places', filters)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  getDetails: async (placeId: string): Promise<GetPlaceDetailsResponse> => {
    try {
      const response = await apiClient.post<GetPlaceDetailsResponse>('/PlaceDirectory/_get_details', { placeId })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  }
}

// UserDirectory API
export const userDirectoryAPI = {
  registerUser: async (data: RegisterUserRequest): Promise<RegisterUserResponse> => {
    try {
      console.log('API: registerUser called with:', data)
      const response = await apiClient.post('/UserDirectory/register_user', data)
      console.log('API: registerUser response:', response.data)
      const payload = response.data
      if (payload && typeof payload === 'object' && 'error' in (payload as any)) {
        const errorMsg = String((payload as any).error)
        console.log('API: registerUser returned error:', errorMsg)
        // If user already exists, that's okay - just return a success response
        if (errorMsg.toLowerCase().includes('already exists') || errorMsg.toLowerCase().includes('duplicate')) {
          console.log('API: User already exists, treating as success')
          return { userId: data.userId } as RegisterUserResponse
        }
        throw new Error(errorMsg)
      }
      return payload as RegisterUserResponse
    } catch (error) {
      console.error('API: registerUser error:', error)
      // If it's a "user already exists" error, don't throw
      if (error instanceof Error && (error.message.toLowerCase().includes('already exists') || error.message.toLowerCase().includes('duplicate'))) {
        console.log('API: User already exists (from catch), treating as success')
        return { userId: data.userId } as RegisterUserResponse
      }
      return handleError(error)
    }
  },

  savePlace: async (userId: string, placeId: string): Promise<Record<string, never>> => {
    try {
      console.log('API: savePlace called with userId:', userId, 'placeId:', placeId)
      const response = await apiClient.post<Record<string, never>>('/UserDirectory/save_place', { userId, placeId })
      console.log('API: savePlace response:', response.data)
      return response.data
    } catch (error) {
      console.error('API: savePlace error:', error)
      return handleError(error)
    }
  },

  unsavePlace: async (userId: string, placeId: string): Promise<Record<string, never>> => {
    try {
      const response = await apiClient.post<Record<string, never>>('/UserDirectory/unsave_place', { userId, placeId })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  updatePreferences: async (userId: string, newPrefs: Record<string, any>): Promise<Record<string, never>> => {
    try {
      const response = await apiClient.post<Record<string, never>>('/UserDirectory/update_preferences', { userId, newPrefs })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  getSavedPlaces: async (userId: string): Promise<GetSavedPlacesResponse> => {
    try {
      console.log('API: getSavedPlaces called for userId:', userId)
      const response = await apiClient.post('/UserDirectory/_get_saved_places', { userId })
      console.log('API: getSavedPlaces raw response:', response)
      console.log('API: getSavedPlaces response.data:', response.data)
      
      // Handle different response formats from backend
      let placeIds: string[] = []
      
      if (response.data) {
        // Try different possible formats
        if (Array.isArray(response.data.placeIds)) {
          placeIds = response.data.placeIds
        } else if (Array.isArray(response.data.places)) {
          placeIds = response.data.places
        } else if (Array.isArray(response.data)) {
          placeIds = response.data
        }
      }
      
      console.log('API: Extracted', placeIds.length, 'saved place IDs:', placeIds)
      return { places: placeIds }
    } catch (error) {
      console.error('API: getSavedPlaces error:', error)
      // Return empty array instead of throwing
      return { places: [] }
    }
  },
}

// RecommendationEngine API
export const recommendationEngineAPI = {
  getRecommendations: async (userId: string): Promise<GetRecommendationsResponse> => {
    try {
      console.log('API: getRecommendations called for userId:', userId)
      const response = await apiClient.post('/RecommendationEngine/get_recommendations', { userId })
      console.log('API: getRecommendations raw response:', response)
      console.log('API: getRecommendations response.data:', response.data)
      
      // Handle different response formats from backend
      let recommendations: string[] = []
      
      if (response.data) {
        // Try different possible formats
        if (Array.isArray(response.data.places)) {
          recommendations = response.data.places
        } else if (Array.isArray(response.data.recommendations)) {
          recommendations = response.data.recommendations
        } else if (Array.isArray(response.data)) {
          recommendations = response.data
        }
      }
      
      console.log('API: Extracted', recommendations.length, 'recommendations:', recommendations)
      return { recommendations }
    } catch (error) {
      console.error('API: getRecommendations error:', error)
      // Return empty array instead of throwing
      return { recommendations: [] }
    }
  },

  refreshRecommendations: async (data: RefreshRecommendationsRequest): Promise<Record<string, never>> => {
    try {
      const response = await apiClient.post<Record<string, never>>('/RecommendationEngine/refresh_recommendations', data)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  clearRecommendations: async (userId: string): Promise<Record<string, never>> => {
    try {
      const response = await apiClient.post<Record<string, never>>('/RecommendationEngine/clear_recommendations', { userId })
      return response.data
    } catch (error) {
      return handleError(error)
    }
  }
}

export default apiClient
