'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DeliveryAddress, GhanaRegion, GHANA_REGIONS, GHANA_REGION_LABELS } from '@/types/checkout';

/**
 * AddressInput Component
 * Delivery address form with geolocation support
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8
 */

export interface AddressInputProps {
  values: DeliveryAddress;
  onChange: (field: keyof DeliveryAddress, value: string | { lat: number; lng: number } | undefined) => void;
  errors?: Partial<Record<keyof DeliveryAddress, string>>;
}

type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error';

export function AddressInput({ values, onChange, errors }: AddressInputProps) {
  const [geoStatus, setGeoStatus] = useState<GeolocationStatus>('idle');
  const [geoError, setGeoError] = useState<string | null>(null);

  // Handle geolocation request (Requirements: 4.5, 4.6, 4.7)
  const handleUseMyLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      setGeoStatus('error');
      return;
    }

    setGeoStatus('loading');
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Store coordinates (Requirements: 4.8)
        onChange('coordinates', { lat: latitude, lng: longitude });

        try {
          // Reverse geocode using Nominatim (free OpenStreetMap service)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.address || {};
            
            // Pre-fill address fields (Requirements: 4.6)
            if (address.road || address.street) {
              onChange('street', address.road || address.street || '');
            }
            if (address.city || address.town || address.village || address.suburb) {
              onChange('city', address.city || address.town || address.village || address.suburb || '');
            }
            
            setGeoStatus('success');
          } else {
            // Coordinates stored but couldn't reverse geocode
            setGeoStatus('success');
          }
        } catch {
          // Coordinates stored but reverse geocoding failed
          setGeoStatus('success');
        }
      },
      (error) => {
        // Handle geolocation errors (Requirements: 4.7)
        setGeoStatus('error');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location access denied. Please enter your address manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location unavailable. Please enter your address manually.');
            break;
          case error.TIMEOUT:
            setGeoError('Location request timed out. Please try again or enter manually.');
            break;
          default:
            setGeoError('Unable to get location. Please enter your address manually.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onChange]);

  return (
    <section 
      className="space-y-4" 
      aria-labelledby="address-heading"
      role="group"
    >
      <h2 id="address-heading" className="text-lg font-bold uppercase tracking-wider text-white">
        Delivery Address
      </h2>

      {/* Use My Location Button (Requirements: 4.5) */}
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleUseMyLocation}
          isLoading={geoStatus === 'loading'}
          className="w-full sm:w-auto min-h-[44px]"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Use My Location
        </Button>
        
        {geoStatus === 'success' && (
          <p className="text-sm text-green-500">
            Location detected! Please verify and complete the address below.
          </p>
        )}
        
        {geoError && (
          <p className="text-sm text-yellow-500" role="alert">
            {geoError}
          </p>
        )}
      </div>

      {/* Street Address - Required (Requirements: 4.1) */}
      <Input
        label="Street Address"
        id="street"
        name="street"
        type="text"
        placeholder="Enter your street address"
        value={values.street}
        onChange={(e) => onChange('street', e.target.value)}
        error={errors?.street}
        required
        autoComplete="street-address"
        aria-required="true"
      />

      {/* City/Area - Required (Requirements: 4.2) */}
      <Input
        label="City / Area"
        id="city"
        name="city"
        type="text"
        placeholder="Enter your city or area"
        value={values.city}
        onChange={(e) => onChange('city', e.target.value)}
        error={errors?.city}
        required
        autoComplete="address-level2"
        aria-required="true"
      />

      {/* Region Dropdown - Required (Requirements: 4.3, 11.3) */}
      <div className="w-full">
        <label
          htmlFor="region"
          className="block text-sm font-medium text-gray-200 mb-1"
        >
          Region
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        </label>
        <select
          id="region"
          name="region"
          value={values.region || ''}
          onChange={(e) => onChange('region', e.target.value)}
          className={`
            w-full px-4 py-3 bg-gray-900 border rounded-md text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
            transition-colors duration-200
            min-h-[48px]
            text-base
            appearance-none
            cursor-pointer
            ${errors?.region
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
          required
          aria-required="true"
          aria-invalid={errors?.region ? 'true' : 'false'}
          aria-describedby={errors?.region ? 'region-error' : undefined}
        >
          <option value="">Select a region</option>
          {GHANA_REGIONS.map((region) => (
            <option key={region} value={region}>
              {GHANA_REGION_LABELS[region]}
            </option>
          ))}
        </select>
        {errors?.region && (
          <p id="region-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.region}
          </p>
        )}
      </div>

      {/* Additional Directions - Optional (Requirements: 4.4, 11.3) */}
      <div className="w-full">
        <label
          htmlFor="directions"
          className="block text-sm font-medium text-gray-200 mb-1"
        >
          Additional Directions / Landmarks (Optional)
        </label>
        <textarea
          id="directions"
          name="directions"
          placeholder="E.g., Near the blue gate, opposite the church..."
          value={values.directions || ''}
          onChange={(e) => onChange('directions', e.target.value)}
          rows={3}
          className="
            w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md text-white
            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-offset-black focus:ring-white focus:border-white
            transition-colors duration-200 resize-none
            text-base
            min-h-[88px]
          "
          autoComplete="off"
          aria-describedby="directions-helper"
        />
        <p id="directions-helper" className="mt-1 text-sm text-gray-400">
          Help our delivery team find you easily
        </p>
      </div>

      {/* Hidden coordinates indicator */}
      {values.coordinates && (
        <p className="text-xs text-gray-500">
          📍 GPS coordinates saved for delivery optimization
        </p>
      )}
    </section>
  );
}

export default AddressInput;
