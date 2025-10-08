# Location Components

This document describes the location-related components and hooks used in the TaskForm.

## Components

### LocationSelector
A comprehensive location selection component that supports both global and India-specific location filtering.

**Features:**
- **Dual Mode**: India-only or Global location selection
- **Hierarchical Selection**: Country → State → City for global mode
- **Multiple Selection**: States, Cities, Pincodes for India mode
- **Search Functionality**: Filter options by typing
- **Real Data**: Uses `country-state-city` npm package

**Props:**
- `form`: Ant Design form instance
- `initialValues`: Initial location values for edit mode

### useLocationData Hook
A custom hook that provides location data and utilities.

**Returns:**
- `countries`: All countries with ISO codes
- `states`: States for selected country
- `cities`: Cities for selected state
- `indianStates`: All Indian states
- `indianCities`: Popular Indian cities with state info
- `indianPincodes`: Major Indian pincodes with city names
- `selectedCountry`, `selectedState`: Current selections
- `handleCountryChange`, `handleStateChange`: Change handlers

## Data Structure

### Global Mode
```javascript
{
  country: "IN", // ISO country code
  state: "MH",   // ISO state code
  city: "Mumbai" // City name
}
```

### India Mode
```javascript
{
  states: ["MH", "KA", "TN"],     // Array of state codes
  cities: ["Mumbai", "Bangalore"], // Array of city names
  pincodes: ["400001", "560001"]   // Array of pincodes
}
```

## Usage Example

```jsx
import LocationSelector from './LocationSelector';

const MyForm = () => {
  const [form] = Form.useForm();
  
  return (
    <Form form={form}>
      <LocationSelector 
        form={form} 
        initialValues={existingTask?.filters} 
      />
    </Form>
  );
};
```

## Dependencies

- **country-state-city**: Provides comprehensive location data
- **Ant Design**: UI components (Select, Form, etc.)

## Benefits

1. **Real Data**: No more hardcoded location values
2. **Scalable**: Easy to add more countries/regions
3. **User-Friendly**: Search and filter capabilities
4. **Flexible**: Supports both global and regional modes
5. **Maintainable**: Centralized location logic
