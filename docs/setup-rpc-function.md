# Setting Up the Discovery RPC Function

## Overview
This document explains how to set up the `get_discovery_profiles` RPC function in your Supabase database for server-side discovery filtering.

## Prerequisites
- Supabase project with profiles, swipes, and matches tables
- Database access via Supabase Dashboard or SQL editor

## Installation Steps

### 1. Execute the RPC Function
Copy and paste the SQL from `supabase/functions/get_discovery_profiles.sql` into your Supabase SQL Editor and execute it.

### 2. Verify Installation
Run this test query to ensure the function was created successfully:

```sql
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'get_discovery_profiles';
```

### 3. Test the Function
Test with a sample user ID:

```sql
SELECT * FROM get_discovery_profiles(
  'your-user-id-here'::UUID,
  'woman'::TEXT,
  'men'::TEXT,
  25,
  35,
  ARRAY['football', 'basketball']::TEXT[],
  25
);
```

## Function Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `user_id` | UUID | Current user's ID | `'123e4567-e89b-12d3-a456-426614174000'` |
| `gender_filter` | TEXT | Target gender ('man'/'woman') | `'woman'` |
| `interested_in_filter` | TEXT | User's interest ('men'/'women'/'any') | `'men'` |
| `min_age` | INTEGER | Minimum age filter | `25` |
| `max_age` | INTEGER | Maximum age filter | `35` |
| `sports_filter` | TEXT[] | Array of preferred sports | `ARRAY['football', 'basketball']` |
| `max_distance_km` | INTEGER | Maximum distance in km | `25` |

## Expected Returns

The function returns profiles with these fields:
- All standard profile fields (id, full_name, etc.)
- `distance_km`: Calculated distance from current user
- Filtered and sorted by proximity

## Security Features

- **SECURITY DEFINER**: Controlled access with proper permissions
- **RLS Integration**: Respects Row Level Security policies
- **Limited Results**: Maximum 25 profiles returned
- **Error Handling**: Graceful error management

## Performance Benefits

- **Server-side filtering**: Reduces client-side processing
- **Optimized queries**: Single database round-trip
- **Distance calculation**: Efficient Haversine formula implementation
- **Exclusion logic**: Automatic filtering of swiped/matched users

## Troubleshooting

### Function Not Found
```sql
-- Check if function exists
\df get_discovery_profiles
```

### Permission Issues
```sql
-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_discovery_profiles TO authenticated;
```

### Performance Issues
- Ensure indexes exist on frequently queried columns
- Consider adding indexes on lat/lng for distance calculations
- Monitor query execution time in Supabase Dashboard

## Integration

The TypeScript service layer in `src/shared/services/discoveryService.ts` automatically calls this RPC function when `getDiscoveryProfiles()` is invoked.

No additional client-side changes are needed beyond updating the service layer.
