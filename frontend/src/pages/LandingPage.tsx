import { useState } from 'react'
import BookingCalendar from '../components/BookingCalendar'
import BookingModal from '../components/BookingModal'
import type { Slot } from '../types'

export default function LandingPage() {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Book an English Class</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Click any green slot on the calendar to book your class.
          </p>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <BookingCalendar onSlotClick={setSelectedSlot} />
      </main>
      {selectedSlot && <BookingModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />}
    </div>
  )
}
