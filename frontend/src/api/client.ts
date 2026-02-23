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

// ── Admin ──────────────────────────────────────────────────────────────────────

function adminHeaders(credentials: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${credentials}`,
  }
}

/** Verify admin credentials by hitting a protected endpoint. */
export async function verifyAdminCredentials(credentials: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/slots`, {
    headers: adminHeaders(credentials),
    cache: 'no-store', // prevent a cached 200 from masking a real 401
  })
  if (res.status === 401) throw new Error('Invalid credentials')
  if (!res.ok) throw new Error('Failed to verify credentials')
}

export async function fetchAllSlots(credentials: string): Promise<Slot[]> {
  const res = await fetch(`${BASE_URL}/api/admin/slots`, {
    headers: adminHeaders(credentials),
  })
  if (!res.ok) throw new Error('Failed to fetch slots')
  return res.json() as Promise<Slot[]>
}

export async function fetchAllBookings(credentials: string): Promise<BookingResponse[]> {
  const res = await fetch(`${BASE_URL}/api/admin/bookings`, {
    headers: adminHeaders(credentials),
  })
  if (!res.ok) throw new Error('Failed to fetch bookings')
  return res.json() as Promise<BookingResponse[]>
}

export interface SlotCreatePayload {
  start_time: string
  end_time: string
}

export async function createAdminSlot(
  credentials: string,
  payload: SlotCreatePayload,
): Promise<Slot> {
  const res = await fetch(`${BASE_URL}/api/admin/slots`, {
    method: 'POST',
    headers: adminHeaders(credentials),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { detail?: string }).detail ?? 'Failed to create slot')
  }
  return res.json() as Promise<Slot>
}

export async function deleteAdminSlot(credentials: string, slotId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/slots/${slotId}`, {
    method: 'DELETE',
    headers: adminHeaders(credentials),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { detail?: string }).detail ?? 'Failed to delete slot')
  }
}

export async function deleteAdminBooking(
  credentials: string,
  bookingId: number,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: adminHeaders(credentials),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { detail?: string }).detail ?? 'Failed to cancel booking')
  }
}
