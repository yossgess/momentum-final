/**
 * Formats distance in kilometers for display
 * @param distance_km - Distance in kilometers (can be null/undefined)
 * @returns Formatted distance string
 */
export const formatDistance = (distance_km: number | null | undefined): string => {
  // Handle null, undefined, or invalid values
  if (distance_km == null || isNaN(distance_km)) {
    return 'N/A';
  }

  // For distances less than 1 km, show "less than 1 km"
  if (distance_km < 1) {
    return 'less than 1 km';
  }

  // For distances >= 1 km, round to nearest integer and show "X km"
  return `${Math.round(distance_km)} km`;
};
