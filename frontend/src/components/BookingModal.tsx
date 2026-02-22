import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import dayjs from 'dayjs'
import { createBooking } from '../api/client'
import type { BookingFormData, BookingResponse, Slot } from '../types'

interface Props {
  slot: Slot
  onClose: () => void
}

export default function BookingModal({ slot, onClose }: Props) {
  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>()

  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    setSubmitError(null)
    try {
      const response = await createBooking(slot.id, data)
      setBooking(response)
    } catch (err) {
      setSubmitError((err as Error).message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {booking ? 'Booking Confirmed!' : 'Book a Class'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Slot summary */}
        <div className="px-6 pt-4 pb-2">
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-sm text-emerald-800">
            <p className="font-medium">{dayjs(slot.start_time).format('dddd, MMMM D, YYYY')}</p>
            <p>
              {dayjs(slot.start_time).format('h:mm A')} – {dayjs(slot.end_time).format('h:mm A')}
            </p>
          </div>
        </div>

        {booking ? (
          /* ── Success state ── */
          <div className="p-6 text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <p className="text-gray-600">Your class is booked! Your reference number is:</p>
            <p className="text-3xl font-bold tracking-widest text-indigo-600">
              {booking.booking_reference}
            </p>
            <p className="text-xs text-gray-400">
              Save this code — you may need it to manage your booking.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* ── Booking form ── */
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.name ? 'border-red-400' : 'border-gray-300'
                }`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="jane@email.com"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-400' : 'border-gray-300'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+54 9 11 1234-5678"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.phone ? 'border-red-400' : 'border-gray-300'
                }`}
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.payment_method ? 'border-red-400' : 'border-gray-300'
                }`}
                {...register('payment_method', { required: 'Please select a payment method' })}
              >
                <option value="">Select a payment method...</option>
                <option value="mercadopago">Mercado Pago (Argentina)</option>
                <option value="paypal">PayPal (International)</option>
              </select>
              {errors.payment_method && (
                <p className="text-red-500 text-xs mt-1">{errors.payment_method.message}</p>
              )}
            </div>

            {/* Submit error */}
            {submitError && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 p-3 rounded-lg">
                {submitError}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
