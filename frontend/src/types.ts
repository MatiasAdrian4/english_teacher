export interface Slot {
  id: number
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
}

export interface BookingFormData {
  name: string
  email: string
  phone: string
  payment_method: 'mercadopago' | 'paypal'
}

export interface BookingResponse {
  id: number
  slot_id: number
  name: string
  email: string
  phone: string
  payment_method: string
  booking_reference: string
  created_at: string
}
