import { useState } from 'react'
import dayjs from 'dayjs'
import { useAuth } from '../../context/AuthContext'
import { deleteAdminSlot, deleteAdminBooking } from '../../api/client'
import type { Slot, BookingResponse } from '../../types'

interface Props {
  slot: Slot
  bookings: BookingResponse[]
  onClose: () => void
  onMutated: () => void
}

export default function SlotDetailModal({ slot, bookings, onClose, onMutated }: Props) {
  const { credentials } = useAuth()
  const [loading, setLoading] = useState<number | 'slot' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDeleteSlot() {
    if (!credentials) return
    setLoading('slot')
    setError(null)
    try {
      await deleteAdminSlot(credentials, slot.id)
      onMutated()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete slot')
      setLoading(null)
    }
  }

  async function handleCancelBooking(bookingId: number) {
    if (!credentials) return
    setLoading(bookingId)
    setError(null)
    try {
      await deleteAdminBooking(credentials, bookingId)
      onMutated()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to cancel booking')
      setLoading(null)
    }
  }

  const fmt = (dt: string) => dayjs(dt).format('ddd, MMM D YYYY · HH:mm')
  const count = bookings.length
  const isFull = count >= slot.max_students

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Slot Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Slot info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-semibold text-gray-900">{slot.title}</p>
            <span
              className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                slot.class_type === 'grupal'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {slot.class_type === 'grupal' ? 'Grupal' : 'Individual'}
            </span>
          </div>
          {slot.description && <p className="text-gray-500 text-xs pb-1">{slot.description}</p>}
          <Row label="Start" value={fmt(slot.start_time)} />
          <Row label="End" value={fmt(slot.end_time)} />
          <Row label="Price" value={`$${slot.price}`} />
          <Row label="Level" value={slot.required_level} />
          <div className="flex gap-2">
            <span className="text-gray-500 w-20 shrink-0">Enrolled</span>
            <span
              className={`font-medium ${
                isFull ? 'text-red-600' : count > 0 ? 'text-amber-600' : 'text-green-600'
              }`}
            >
              {count} / {slot.max_students}
              {isFull ? ' — Full' : count > 0 ? ' — Partially booked' : ' — Available'}
            </span>
          </div>
        </div>

        {/* Enrolled students */}
        {bookings.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Enrolled Students
            </p>
            {bookings.map((b) => (
              <div
                key={b.id}
                className="border border-gray-200 rounded-lg p-3 text-sm flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{b.name}</p>
                  <p className="text-gray-500 truncate">{b.email}</p>
                  <p className="text-xs text-gray-400">
                    Ref: <span className="font-mono">{b.booking_reference}</span>
                    {' · '}
                    {b.payment_method === 'mercadopago' ? 'Mercado Pago' : 'PayPal'}
                  </p>
                </div>
                <button
                  onClick={() => handleCancelBooking(b.id)}
                  disabled={loading !== null}
                  className="shrink-0 text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-2 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === b.id ? 'Cancelling…' : 'Cancel'}
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {bookings.length === 0 && (
            <button
              onClick={handleDeleteSlot}
              disabled={loading !== null}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {loading === 'slot' ? 'Deleting…' : 'Delete Slot'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 w-20 shrink-0">{label}</span>
      <span className={`font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}
