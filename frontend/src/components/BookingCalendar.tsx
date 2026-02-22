import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import type { EventClickArg } from '@fullcalendar/core'
import { fetchAvailableSlots } from '../api/client'
import type { Slot } from '../types'

interface Props {
  onSlotClick: (slot: Slot) => void
}

export default function BookingCalendar({ onSlotClick }: Props) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAvailableSlots()
      .then(setSlots)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const events = slots.map((slot) => ({
    id: String(slot.id),
    title: '✦ Available',
    start: slot.start_time,
    end: slot.end_time,
    extendedProps: { slot },
    backgroundColor: '#10b981',
    borderColor: '#059669',
    textColor: '#ffffff',
  }))

  function handleEventClick(info: EventClickArg) {
    const slot = info.event.extendedProps.slot as Slot
    onSlotClick(slot)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400 animate-pulse">Loading available slots...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Could not load slots: {error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        allDaySlot={false}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        height="auto"
        eventCursor="pointer"
        eventDisplay="block"
      />
    </div>
  )
}
