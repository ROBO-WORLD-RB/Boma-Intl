/**
 * Delivery Fees Module
 * Client-side delivery fee calculation mirroring backend structure
 * 
 * Requirements: 5.3
 */

import { GhanaRegion, GHANA_REGIONS } from '@/types/checkout';

/**
 * Delivery fees in GHS for each Ghana region
 * Mirrors the backend fee structure in src/utils/delivery-calculator.ts
 */
export const DELIVERY_FEES: Record<GhanaRegion, number> = {
  'greater-accra': 20,
  'ashanti': 35,
  'western': 45,
  'eastern': 30,
  'central': 35,
  'volta': 40,
  'northern': 60,
  'upper-east': 70,
  'upper-west': 70,
  'bono': 50,
  'bono-east': 55,
  'ahafo': 50,
  'savannah': 65,
  'north-east': 65,
  'oti': 45,
  'western-north': 50,
};

/**
 * Default delivery fee when region is not recognized
 */
export const DEFAULT_DELIVERY_FEE = 50;

/**
 * Checks if a string is a valid Ghana region
 * 
 * @param region - The region string to validate
 * @returns true if the region is valid
 */
export function isValidGhanaRegion(region: string): region is GhanaRegion {
  return GHANA_REGIONS.includes(region as GhanaRegion);
}

/**
 * Calculates delivery fee based on the region
 * Returns the predefined fee for valid regions, or default fee for unknown regions
 * 
 * Requirements: 5.3
 * 
 * @param region - The Ghana region for delivery
 * @returns The delivery fee in GHS
 */
export function calculateDeliveryFee(region: string): number {
  if (isValidGhanaRegion(region)) {
    return DELIVERY_FEES[region];
  }
  return DEFAULT_DELIVERY_FEE;
}

/**
 * Gets delivery fee for a region from a delivery address object
 * 
 * @param address - Object containing region field
 * @returns The delivery fee in GHS
 */
export function getDeliveryFeeFromAddress(address: { region?: string }): number {
  if (!address.region) {
    return DEFAULT_DELIVERY_FEE;
  }
  return calculateDeliveryFee(address.region);
}

/**
 * Formats delivery fee for display
 * 
 * @param fee - The fee amount in GHS
 * @returns Formatted string with currency symbol
 */
export function formatDeliveryFee(fee: number): string {
  return `GH₵ ${fee.toFixed(2)}`;
}

/**
 * Gets all regions with their delivery fees for display
 * 
 * @returns Array of region-fee pairs sorted by fee
 */
export function getRegionsWithFees(): Array<{ region: GhanaRegion; fee: number; label: string }> {
  return GHANA_REGIONS.map((region) => ({
    region,
    fee: DELIVERY_FEES[region],
    label: region
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  })).sort((a, b) => a.fee - b.fee);
}
