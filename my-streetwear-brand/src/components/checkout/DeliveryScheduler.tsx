'use client';

import { useMemo } from 'react';
import { TimeWindow, TIME_WINDOW_LABELS } from '@/types/checkout';
import {
  getMinDeliveryDate,
  getMaxDeliveryDate,
  isBlackoutDate,
  formatDateISO,
  CUTOFF_HOUR,
} from '@/lib/date-utils';

/**
 * DeliveryScheduler Component
 * Date picker and time window selector for delivery scheduling
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

export interface DeliverySchedulerProps {
  values: {
    deliveryDate: string;
    timeWindow: TimeWindow;
  };
  onChange: (field: 'deliveryDate' | 'timeWindow', value: string) => void;
  errors?: {
    deliveryDate?: string;
    timeWindow?: string;
  };
}

export function DeliveryScheduler({ values, onChange, errors }: DeliverySchedulerProps) {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Calculate min and max dates (Requirements: 3.2, 3.3, 3.7)
  const minDate = useMemo(() => getMinDeliveryDate(now), []);
  const maxDate = useMemo(() => getMaxDeliveryDate(now), []);
  
  const minDateStr = formatDateISO(minDate);
  const maxDateStr = formatDateISO(maxDate);

  // Lead time message (Requirements: 3.7)
  const leadTimeMessage = currentHour < CUTOFF_HOUR
    ? 'Orders placed before 6PM can be delivered tomorrow'
    : 'Orders placed after 6PM will be delivered day after tomorrow';

  // Time window options (Requirements: 3.5, 3.6)
  const timeWindowOptions: TimeWindow[] = ['any', 'morning', 'afternoon', 'evening'];

  // Check if selected date is a blackout date for display purposes
  const isSelectedDateBlackout = values.deliveryDate 
    ? isBlackoutDate(new Date(values.deliveryDate))
    : false;

  return (
    <section 
      className="space-y-4" 
      aria-labelledby="delivery-schedule-heading"
      role="group"
    >
      <h2 id="delivery-schedule-heading" className="text-lg font-bold uppercase tracking-wider text-white">
        Delivery Schedule
      </h2>

      {/* Lead time info (Requirements: 3.7) */}
      <p className="text-sm text-gray-400">
        {leadTimeMessage}
      </p>

      {/* Date Picker (Requirements: 3.1, 3.2, 3.3, 11.4) */}
      <div className="w-full">
        <label
          htmlFor="deliveryDate"
          className="block text-sm font-medium text-gray-200 mb-1"
        >
          Delivery Date
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        </label>
        <input
          type="date"
          id="deliveryDate"
          name="deliveryDate"
          value={values.deliveryDate}
          onChange={(e) => onChange('deliveryDate', e.target.value)}
          min={minDateStr}
          max={maxDateStr}
          className={`
            w-full px-4 py-3 bg-gray-900 border rounded-md text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
            transition-colors duration-200
            min-h-[48px]
            text-base
            appearance-none
            ${errors?.deliveryDate
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-700 focus:ring-white focus:border-white'
            }
          `}
          style={{
            // Ensure date picker is mobile-friendly with larger touch targets
            WebkitAppearance: 'none',
          }}
          required
          aria-required="true"
          aria-invalid={errors?.deliveryDate ? 'true' : 'false'}
          aria-describedby={errors?.deliveryDate ? 'deliveryDate-error' : 'deliveryDate-helper'}
        />
        {errors?.deliveryDate && (
          <p id="deliveryDate-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.deliveryDate}
          </p>
        )}
        {!errors?.deliveryDate && (
          <p id="deliveryDate-helper" className="mt-1 text-sm text-gray-400">
            Sundays and public holidays are not available for delivery
          </p>
        )}
        {isSelectedDateBlackout && !errors?.deliveryDate && (
          <p className="mt-1 text-sm text-yellow-500" role="alert">
            This date is not available for delivery. Please select another date.
          </p>
        )}
      </div>

      {/* Time Window Selector (Requirements: 3.5, 3.6, 11.4) */}
      <div className="w-full">
        <label
          htmlFor="timeWindow"
          className="block text-sm font-medium text-gray-200 mb-1"
        >
          Preferred Time Window (Optional)
        </label>
        <select
          id="timeWindow"
          name="timeWindow"
          value={values.timeWindow}
          onChange={(e) => onChange('timeWindow', e.target.value)}
          className={`
            w-full px-4 py-3 bg-gray-900 border rounded-md text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
            transition-colors duration-200
            min-h-[48px]
            text-base
            appearance-none
            cursor-pointer
            ${errors?.timeWindow
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-700 focus:ring-white focus:border-white'
            }
          `}
          style={{
            // Custom dropdown arrow for better mobile UX
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
          aria-describedby="timeWindow-helper"
        >
          {timeWindowOptions.map((window) => (
            <option key={window} value={window}>
              {TIME_WINDOW_LABELS[window]}
            </option>
          ))}
        </select>
        {errors?.timeWindow && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {errors.timeWindow}
          </p>
        )}
        <p id="timeWindow-helper" className="mt-1 text-sm text-gray-400">
          Select your preferred delivery time or leave as &quot;Any time&quot;
        </p>
      </div>
    </section>
  );
}

export default DeliveryScheduler;
