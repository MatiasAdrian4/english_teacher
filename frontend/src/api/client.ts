import type { Slot, BookingFormData, BookingResponse } from '../types'

// Empty string so Vite's dev proxy handles /api/* → http://localhost:8000
// In production set VITE_API_URL to the deployed backend URL
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export async function fetchAvailableSlots(): Promise<Slot[]> {
  const res = await fetch(`${BASE_URL}/api/slots`)
  if (!res.ok) throw new Error('Failed to fetch available slots')
  return res.json() as Promise<Slot[]>
}

export async function createBooking(
  slot_id: number,
  data: BookingFormData,
): Promise<BookingResponse> {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slot_id, ...data }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { detail?: string }).detail ?? 'Failed to create booking')
  }
  return res.json() as Promise<BookingResponse>
}
