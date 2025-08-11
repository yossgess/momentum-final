// Simple test for formatDistance utility
const formatDistance = (distance_km) => {
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

console.log('Testing formatDistance utility:');
console.log('formatDistance(0.5):', formatDistance(0.5));
console.log('formatDistance(0.9):', formatDistance(0.9));
console.log('formatDistance(1.0):', formatDistance(1.0));
console.log('formatDistance(1.4):', formatDistance(1.4));
console.log('formatDistance(1.6):', formatDistance(1.6));
console.log('formatDistance(5.2):', formatDistance(5.2));
console.log('formatDistance(null):', formatDistance(null));
console.log('formatDistance(undefined):', formatDistance(undefined));
console.log('formatDistance(NaN):', formatDistance(NaN));
