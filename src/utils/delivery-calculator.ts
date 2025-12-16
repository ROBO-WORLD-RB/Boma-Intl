/**
 * Delivery Fee Calculator
 * Calculates delivery fees based on Ghana regions
 * 
 * Requirements: 5.3, 12.7
 */

export type GhanaRegion =
  | 'greater-accra'
  | 'ashanti'
  | 'western'
  | 'eastern'
  | 'central'
  | 'volta'
  | 'northern'
  | 'upper-east'
  | 'upper-west'
  | 'bono'
  | 'bono-east'
  | 'ahafo'
  | 'savannah'
  | 'north-east'
  | 'oti'
  | 'western-north';

/**
 * Delivery fees in GHS for each Ghana region
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
 * List of all valid Ghana regions
 */
export const GHANA_REGIONS: GhanaRegion[] = [
  'greater-accra',
  'ashanti',
  'western',
  'eastern',
  'central',
  'volta',
  'northern',
  'upper-east',
  'upper-west',
  'bono',
  'bono-east',
  'ahafo',
  'savannah',
  'north-east',
  'oti',
  'western-north',
];

/**
 * Checks if a string is a valid Ghana region
 */
export function isValidGhanaRegion(region: string): region is GhanaRegion {
  return GHANA_REGIONS.includes(region as GhanaRegion);
}

/**
 * Calculates delivery fee based on the region
 * Returns the predefined fee for valid regions, or default fee for unknown regions
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
 * Gets delivery fee for a region from a shipping address object
 * 
 * @param shippingAddress - Object containing region field
 * @returns The delivery fee in GHS
 */
export function getDeliveryFeeFromAddress(shippingAddress: { region?: string }): number {
  if (!shippingAddress.region) {
    return DEFAULT_DELIVERY_FEE;
  }
  return calculateDeliveryFee(shippingAddress.region);
}
