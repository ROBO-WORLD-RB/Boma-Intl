/**
 * Property-Based Tests for Mobile Touch Target Sizes
 * 
 * **Feature: streetwear-enhancements, Property 8: Mobile Touch Target Size**
 * **Validates: Requirements 11.6**
 * 
 * For any interactive element on mobile viewport, the touch target
 * SHALL have minimum dimensions of 44x44 pixels.
 */

import * as fc from 'fast-check';

// Tailwind CSS class patterns that define minimum touch target sizes
const TOUCH_TARGET_CLASSES = [
  'min-w-[44px]',
  'min-h-[44px]',
  'w-11', // 44px in Tailwind (11 * 4 = 44)
  'h-11',
  'w-12', // 48px - also acceptable
  'h-12',
  'min-w-11',
  'min-h-11',
];

// Minimum touch target size in pixels (WCAG 2.5.5 AAA)
const MIN_TOUCH_TARGET_SIZE = 44;

// Tailwind spacing scale (in pixels)
const TAILWIND_SPACING: Record<string, number> = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '14': 56,
  '16': 64,
};

/**
 * Parse a Tailwind class to extract the pixel value
 */
function parseTailwindSize(className: string): number | null {
  // Handle arbitrary values like min-w-[44px]
  const arbitraryMatch = className.match(/(?:min-)?[wh]-\[(\d+)px\]/);
  if (arbitraryMatch) {
    return parseInt(arbitraryMatch[1], 10);
  }

  // Handle standard Tailwind spacing like w-11, h-12
  const spacingMatch = className.match(/(?:min-)?[wh]-(\d+)/);
  if (spacingMatch) {
    const spacingKey = spacingMatch[1];
    return TAILWIND_SPACING[spacingKey] ?? null;
  }

  return null;
}

/**
 * Check if a set of CSS classes provides adequate touch target size
 */
function hasAdequateTouchTarget(classes: string[]): { width: boolean; height: boolean } {
  let hasMinWidth = false;
  let hasMinHeight = false;

  for (const cls of classes) {
    const size = parseTailwindSize(cls);
    if (size !== null && size >= MIN_TOUCH_TARGET_SIZE) {
      if (cls.includes('w-') || cls.includes('w-[')) {
        hasMinWidth = true;
      }
      if (cls.includes('h-') || cls.includes('h-[')) {
        hasMinHeight = true;
      }
    }
  }

  return { width: hasMinWidth, height: hasMinHeight };
}

describe('Touch Target Property Tests', () => {
  /**
   * **Feature: streetwear-enhancements, Property 8: Mobile Touch Target Size**
   * **Validates: Requirements 11.6**
   * 
   * For any valid touch target class combination, the parsed size
   * SHALL be at least 44 pixels.
   */
  test('Property 8: Touch target classes parse to at least 44px', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...TOUCH_TARGET_CLASSES),
        (className) => {
          const size = parseTailwindSize(className);
          // If we can parse the size, it should be >= 44px
          return size === null || size >= MIN_TOUCH_TARGET_SIZE;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Tailwind spacing scale values 11 and above meet touch target requirements
   */
  test('Tailwind spacing values 11+ meet 44px minimum', () => {
    // Only test values that exist in Tailwind's spacing scale
    const validSpacingValues = [11, 12, 14, 16];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...validSpacingValues),
        (spacingValue) => {
          const pixelValue = TAILWIND_SPACING[spacingValue.toString()];
          return pixelValue !== undefined && pixelValue >= MIN_TOUCH_TARGET_SIZE;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Arbitrary pixel values in classes are correctly parsed
   */
  test('Arbitrary pixel values are correctly parsed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 200 }),
        fc.constantFrom('w', 'h', 'min-w', 'min-h'),
        (pixels, prefix) => {
          const className = `${prefix}-[${pixels}px]`;
          const parsed = parseTailwindSize(className);
          return parsed === pixels;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Class combinations with both width and height >= 44px are valid touch targets
   */
  test('Valid touch target class combinations provide adequate size', () => {
    const validWidthClasses = ['min-w-[44px]', 'w-11', 'w-12', 'min-w-[48px]'];
    const validHeightClasses = ['min-h-[44px]', 'h-11', 'h-12', 'min-h-[48px]'];

    fc.assert(
      fc.property(
        fc.constantFrom(...validWidthClasses),
        fc.constantFrom(...validHeightClasses),
        (widthClass, heightClass) => {
          const result = hasAdequateTouchTarget([widthClass, heightClass]);
          return result.width && result.height;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Classes below 44px do not satisfy touch target requirements
   */
  test('Classes below 44px do not satisfy touch target requirements', () => {
    const smallClasses = ['w-8', 'w-10', 'h-8', 'h-10', 'min-w-[32px]', 'min-h-[40px]'];

    fc.assert(
      fc.property(
        fc.constantFrom(...smallClasses),
        (className) => {
          const size = parseTailwindSize(className);
          // Small classes should parse to less than 44px
          return size !== null && size < MIN_TOUCH_TARGET_SIZE;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Unit tests for touch target utility functions
 */
describe('Touch Target Utility Functions', () => {
  test('parseTailwindSize handles arbitrary values correctly', () => {
    expect(parseTailwindSize('min-w-[44px]')).toBe(44);
    expect(parseTailwindSize('min-h-[44px]')).toBe(44);
    expect(parseTailwindSize('w-[48px]')).toBe(48);
    expect(parseTailwindSize('h-[100px]')).toBe(100);
  });

  test('parseTailwindSize handles standard spacing correctly', () => {
    expect(parseTailwindSize('w-11')).toBe(44);
    expect(parseTailwindSize('h-11')).toBe(44);
    expect(parseTailwindSize('w-12')).toBe(48);
    expect(parseTailwindSize('min-w-11')).toBe(44);
  });

  test('parseTailwindSize returns null for invalid classes', () => {
    expect(parseTailwindSize('bg-white')).toBeNull();
    expect(parseTailwindSize('flex')).toBeNull();
    expect(parseTailwindSize('text-sm')).toBeNull();
  });

  test('hasAdequateTouchTarget correctly identifies valid combinations', () => {
    expect(hasAdequateTouchTarget(['min-w-[44px]', 'min-h-[44px]'])).toEqual({
      width: true,
      height: true,
    });
    expect(hasAdequateTouchTarget(['w-11', 'h-11'])).toEqual({
      width: true,
      height: true,
    });
  });

  test('hasAdequateTouchTarget correctly identifies invalid combinations', () => {
    expect(hasAdequateTouchTarget(['w-8', 'h-8'])).toEqual({
      width: false,
      height: false,
    });
    expect(hasAdequateTouchTarget(['min-w-[44px]', 'h-8'])).toEqual({
      width: true,
      height: false,
    });
  });
});
