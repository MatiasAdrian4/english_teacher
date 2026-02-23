import { useCallback, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import type { EventClickArg } from '@fullcalendar/core'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchAllSlots, fetchAllBookings } from '../api/client'
import type { Slot, BookingResponse } from '../types'
import AddSlotModal from '../components/admin/AddSlotModal'
import SlotDetailModal from '../components/admin/SlotDetailModal'

export default function AdminDashboardPage() {
  const { credentials, logout } = useAuth()
  const navigate = useNavigate()

  const [slots, setSlots] = useState<Slot[]>([])
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAddSlot, setShowAddSlot] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const loadData = useCallback(async () => {
    if (!credentials) return
    try {
      setLoading(true)
      const [slotsData, bookingsData] = await Promise.all([
        fetchAllSlots(credentials),
        fetchAllBookings(credentials),
      ])
      setSlots(slotsData)
      setBookings(bookingsData)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [credentials])

  useEffect(() => {
    loadData()
  }, [loadData])

  function handleLogout() {
    logout()
    navigate('/admin')
  }

  // Group bookings by slot_id
  const bookingsBySlotId: Record<number, BookingResponse[]> = {}
  for (const b of bookings) {
    ;(bookingsBySlotId[b.slot_id] ??= []).push(b)
  }

  const events = slots.map((slot) => {
    const slotBookings = bookingsBySlotId[slot.id] ?? []
    const count = slotBookings.length
    const isFull = count >= slot.max_students
    const isPartial = count > 0 && !isFull

    const label =
      slot.max_students > 1 ? `${slot.title} (${count}/${slot.max_students})` : slot.title

    return {
      id: String(slot.id),
      title: label,
      start: slot.start_time,
      end: slot.end_time,
      // full → red | partial → amber | available → green | disabled → gray
      backgroundColor: isFull
        ? '#dc2626'
        : isPartial
          ? '#d97706'
          : slot.is_available
            ? '#16a34a'
            : '#6b7280',
      borderColor: isFull
        ? '#b91c1c'
        : isPartial
          ? '#b45309'
          : slot.is_available
            ? '#15803d'
            : '#4b5563',
      textColor: '#ffffff',
    }
  })

  function handleEventClick(info: EventClickArg) {
    const slot = slots.find((s) => String(s.id) === info.event.id)
    if (slot) setSelectedSlot(slot)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your availability and bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddSlot(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Slot
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600" />
            Available
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-amber-600" />
            Partially booked
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-600" />
            Full
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-500" />
            Unavailable
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-96 text-gray-400 animate-pulse">
            Loading…
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-4 [&_.fc-event]:cursor-pointer">
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
              slotMinTime="09:00:00"
              slotMaxTime="23:00:00"
              allDaySlot={false}
              events={events}
              eventClick={handleEventClick}
              height="auto"
            />
          </div>
        )}
      </main>

      {showAddSlot && (
        <AddSlotModal
          onClose={() => setShowAddSlot(false)}
          onCreated={() => {
            setShowAddSlot(false)
            loadData()
          }}
        />
      )}

      {selectedSlot && (
        <SlotDetailModal
          slot={selectedSlot}
          bookings={bookingsBySlotId[selectedSlot.id] ?? []}
          onClose={() => setSelectedSlot(null)}
          onMutated={() => {
            setSelectedSlot(null)
            loadData()
          }}
        />
      )}
    </div>
  )
}
