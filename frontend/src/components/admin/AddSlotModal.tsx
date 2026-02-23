import { useState } from 'react'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { useAuth } from '../../context/AuthContext'
import { createAdminSlot } from '../../api/client'

interface FormValues {
  title: string
  description: string
  start_time: string
  end_time: string
  price: string
  required_level:
    | 'beginner'
    | 'pre-intermediate'
    | 'intermediate'
    | 'upper-intermediate'
    | 'advanced'
    | 'proficient'
  max_students: string
}

interface Props {
  onClose: () => void
  onCreated: () => void
}

const DURATIONS = [
  { label: '1h', minutes: 60 },
  { label: '1h 30m', minutes: 90 },
  { label: '2h', minutes: 120 },
]

export default function AddSlotModal({ onClose, onCreated }: Props) {
  const { credentials } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [activeDuration, setActiveDuration] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const startTime = watch('start_time')

  function applyDuration(minutes: number) {
    setActiveDuration(minutes)
    if (startTime) {
      setValue('end_time', dayjs(startTime).add(minutes, 'minute').format('YYYY-MM-DDTHH:mm'), {
        shouldValidate: true,
      })
    }
  }

  function handleStartChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (activeDuration && e.target.value) {
      setValue(
        'end_time',
        dayjs(e.target.value).add(activeDuration, 'minute').format('YYYY-MM-DDTHH:mm'),
        { shouldValidate: true },
      )
    }
  }

  async function onSubmit(data: FormValues) {
    if (!credentials) return
    setServerError(null)
    try {
      await createAdminSlot(credentials, {
        title: data.title,
        description: data.description || undefined,
        start_time: data.start_time,
        end_time: data.end_time,
        price: parseFloat(data.price),
        required_level: data.required_level,
        max_students: parseInt(data.max_students, 10),
      })
      onCreated()
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Failed to create slot')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Add Time Slot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Conversation Practice"
              {...register('title', { required: 'Title is required' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              placeholder="Topics covered, what students should prepare, etc."
              rows={2}
              {...register('description')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Start */}
          <div>
            <input
              type="datetime-local"
              {...register('start_time', { required: 'Start time is required' })}
              onChange={(e) => {
                void register('start_time').onChange(e)
                handleStartChange(e)
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.start_time && (
              <p className="text-red-500 text-xs mt-1">{errors.start_time.message}</p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${!startTime ? 'text-gray-400' : 'text-gray-700'}`}
            >
              Duration
            </label>
            <div className="flex gap-2">
              {DURATIONS.map(({ label, minutes }) => (
                <button
                  key={minutes}
                  type="button"
                  disabled={!startTime}
                  onClick={() => applyDuration(minutes)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    !startTime
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : activeDuration === minutes
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${!startTime ? 'text-gray-400' : 'text-gray-700'}`}
            >
              End
              {activeDuration && (
                <span className="ml-2 text-xs text-gray-400 font-normal">(auto-calculated)</span>
              )}
            </label>
            <input
              type="datetime-local"
              disabled={!startTime}
              min={startTime}
              {...register('end_time', {
                required: 'End time is required',
                validate: (value) => !startTime || value > startTime || 'End must be after start',
              })}
              onChange={(e) => {
                void register('end_time').onChange(e)
                setActiveDuration(null)
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
            {errors.end_time && (
              <p className="text-red-500 text-xs mt-1">{errors.end_time.message}</p>
            )}
          </div>

          {/* Price + Max Students */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Must be ≥ 0' },
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
              <input
                type="number"
                min="1"
                defaultValue={1}
                {...register('max_students', {
                  required: 'Required',
                  min: { value: 1, message: 'At least 1' },
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.max_students && (
                <p className="text-red-500 text-xs mt-1">{errors.max_students.message}</p>
              )}
            </div>
          </div>

          {/* Required Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Level</label>
            <select
              {...register('required_level', { required: 'Level is required' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a level…</option>
              <option value="beginner">Beginner</option>
              <option value="pre-intermediate">Pre-Intermediate</option>
              <option value="intermediate">Intermediate</option>
              <option value="upper-intermediate">Upper-Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="proficient">Proficient</option>
            </select>
            {errors.required_level && (
              <p className="text-red-500 text-xs mt-1">{errors.required_level.message}</p>
            )}
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isSubmitting ? 'Creating…' : 'Create Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
