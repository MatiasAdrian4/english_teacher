import { useState } from 'react'
import dayjs from 'dayjs'
import { useAuth } from '../../context/AuthContext'
import { deleteAdminSlot, deleteAdminBooking } from '../../api/client'
import type { Slot, BookingResponse } from '../../types'

interface Props {
  slot: Slot
  booking: BookingResponse | null
  onClose: () => void
  onMutated: () => void
}

export default function SlotDetailModal({ slot, booking, onClose, onMutated }: Props) {
  const { credentials } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDeleteSlot() {
    if (!credentials) return
    setLoading(true)
    setError(null)
    try {
      await deleteAdminSlot(credentials, slot.id)
      onMutated()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete slot')
      setLoading(false)
    }
  }

  async function handleCancelBooking() {
    if (!credentials || !booking) return
    setLoading(true)
    setError(null)
    try {
      await deleteAdminBooking(credentials, booking.id)
      onMutated()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to cancel booking')
      setLoading(false)
    }
  }

  const fmt = (dt: string) => dayjs(dt).format('ddd, MMM D YYYY · HH:mm')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
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
          <Row label="Start" value={fmt(slot.start_time)} />
          <Row label="End" value={fmt(slot.end_time)} />
          <div className="flex gap-2">
            <span className="text-gray-500 w-16 shrink-0">Status</span>
            {booking ? (
              <span className="font-medium text-red-600">Booked</span>
            ) : slot.is_available ? (
              <span className="font-medium text-green-600">Available</span>
            ) : (
              <span className="font-medium text-gray-500">Unavailable</span>
            )}
          </div>
        </div>

        {/* Booking info */}
        {booking && (
          <div className="border border-gray-200 rounded-lg p-4 mb-4 space-y-2 text-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Booking
            </p>
            <Row label="Reference" value={booking.booking_reference} mono />
            <Row label="Name" value={booking.name} />
            <Row label="Email" value={booking.email} />
            <Row label="Phone" value={booking.phone} />
            <Row
              label="Payment"
              value={booking.payment_method === 'mercadopago' ? 'Mercado Pago' : 'PayPal'}
            />
            <Row label="Booked" value={dayjs(booking.created_at).format('MMM D YYYY, HH:mm')} />
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
          {booking ? (
            <button
              onClick={handleCancelBooking}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Cancelling…' : 'Cancel Booking'}
            </button>
          ) : (
            <button
              onClick={handleDeleteSlot}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Deleting…' : 'Delete Slot'}
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
