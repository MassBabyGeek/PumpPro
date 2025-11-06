/**
 * Icon Mapper Utility
 * Maps invalid icon names from backend to valid Ionicons names
 */

// Map invalid icon names to valid Ionicons names
const ICON_NAME_MAP: Record<string, string> = {
  fire: 'flame',
  target: 'flag',
  trophy: 'trophy',
  star: 'star',
  medal: 'medal',
  clock: 'time',
  heart: 'heart',
  lightning: 'flash',
  check: 'checkmark',
  // Add more mappings as needed
};

/**
 * Get a valid Ionicons name from a potentially invalid icon name
 * @param iconName - Icon name from backend
 * @returns Valid Ionicons name
 */
export const getValidIconName = (iconName: string): string => {
  // If the iconName is in the map, return the mapped value
  // Otherwise, return the original iconName (assuming it's already valid)
  return ICON_NAME_MAP[iconName] || iconName;
};
