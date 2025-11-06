// API Types for Matcha Tracker

export interface ExperienceLog {
  _id: string
  userId: string
  placeId: string
  timestamp: string
  rating: number
  sweetness: number
  strength: number
  notes?: string
  photo?: string
}

export interface Place {
  _id: string
  name: string
  address: string
  coordinates: [number, number]
  preparationStyles: string[]
  priceRange: string
  hours?: string
  photos: string[]
}

export interface User {
  userId: string
  displayName: string
  email: string
  savedPlaces: string[]
  preferences: Record<string, any>
}

// Request types
export interface CreateLogRequest {
  userId: string
  placeId: string
  rating: number
  sweetness: number
  strength: number
  notes?: string
  photo?: string
}

export interface UpdateLogRequest {
  logId: string
  rating?: number
  sweetness?: number
  strength?: number
  notes?: string
  photo?: string
}

export interface CreatePlaceRequest {
  name: string
  address: string
  coords: [number, number]
  styles: string[]
  priceRange: string
  hours?: string
  photos: string[]
}

export interface EditPlaceRequest {
  placeId: string
  name?: string
  address?: string
  coords?: [number, number]
  styles?: string[]
  priceRange?: string
  hours?: string
  photos?: string[]
}

export interface RegisterUserRequest {
  userId: string
  displayName: string
  email: string
}

export interface RefreshRecommendationsRequest {
  userId: string
  savedPlaces: string[]
  preferences: Record<string, any>
  triedPlaces: string[]
  allAvailablePlaces?: string[]
}

// Response types
export interface CreateLogResponse {
  logId: string
}

export interface GetUserLogsResponse {
  logs: ExperienceLog[]
}

export interface GetPlaceLogsResponse {
  logs: ExperienceLog[]
}

export interface GetAverageRatingResponse {
  averageRating: number
}

export interface GetTriedPlacesResponse {
  places: string[]
}

export interface GenerateProfileSummaryResponse {
  summary: string
}

export interface CreatePlaceResponse {
  placeId: string
}

export interface GetPlaceDetailsResponse {
  place: Place
}

export interface FindNearbyResponse {
  placeIds: string[]
}

export interface SearchByNameResponse {
  places: string[]
}

export interface FilterPlacesResponse {
  places: string[]
}

export interface RegisterUserResponse {
  userId: string
}

export interface GetSavedPlacesResponse {
  places: string[]
}

export interface GetRecommendationsResponse {
  recommendations: string[]
}

export interface ErrorResponse {
  error: string
}
