export type Level =
  | 'beginner'
  | 'pre-intermediate'
  | 'intermediate'
  | 'upper-intermediate'
  | 'advanced'
  | 'proficient'
export type ClassType = 'individual' | 'grupal'

export interface Slot {
  id: number
  title: string
  description: string | null
  start_time: string
  end_time: string
  price: number
  required_level: Level
  max_students: number
  class_type: ClassType
  is_available: boolean
  created_at: string
}

export interface BookingFormData {
  name: string
  email: string
  payment_method: 'mercadopago' | 'paypal'
}

export interface BookingResponse {
  id: number
  slot_id: number
  name: string
  email: string
  payment_method: string
  booking_reference: string
  created_at: string
}
