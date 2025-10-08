import { useState, useEffect, useMemo } from 'react';
import { Country, State, City } from 'country-state-city';

const useLocationData = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Get all countries
  const countries = useMemo(() => {
    return Country.getAllCountries().map(country => ({
      value: country.isoCode,
      label: country.name,
      ...country
    }));
  }, []);

  // Get states for selected country
  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry).map(state => ({
      value: state.isoCode,
      label: state.name,
      ...state
    }));
  }, [selectedCountry]);

  // Get cities for selected state
  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState).map(city => ({
      value: city.name,
      label: city.name,
      ...city
    }));
  }, [selectedCountry, selectedState]);

  // Get popular Indian states (since this seems to be an Indian project based on pincodes)
  const indianStates = useMemo(() => {
    const indiaCode = 'IN';
    return State.getStatesOfCountry(indiaCode).map(state => ({
      value: state.isoCode,
      label: state.name,
      ...state
    }));
  }, []);

  // Get popular Indian cities
  const indianCities = useMemo(() => {
    const indiaCode = 'IN';
    const popularStates = ['MH', 'DL', 'KA', 'TN', 'WB', 'TG']; // Maharashtra, Delhi, Karnataka, Tamil Nadu, West Bengal, Telangana
    
    let allCities = [];
    popularStates.forEach(stateCode => {
      const stateCities = City.getCitiesOfState(indiaCode, stateCode);
      allCities = allCities.concat(stateCities.map(city => ({
        value: city.name,
        label: `${city.name}, ${State.getStateByCodeAndCountry(stateCode, indiaCode)?.name}`,
        stateCode,
        ...city
      })));
    });
    
    return allCities;
  }, []);

  // Get popular Indian pincodes (major cities)
  const indianPincodes = useMemo(() => {
    return [
      { value: '110001', label: '110001 - New Delhi' },
      { value: '110002', label: '110002 - New Delhi' },
      { value: '110003', label: '110003 - New Delhi' },
      { value: '400001', label: '400001 - Mumbai' },
      { value: '400002', label: '400002 - Mumbai' },
      { value: '400003', label: '400003 - Mumbai' },
      { value: '560001', label: '560001 - Bangalore' },
      { value: '560002', label: '560002 - Bangalore' },
      { value: '560003', label: '560003 - Bangalore' },
      { value: '600001', label: '600001 - Chennai' },
      { value: '600002', label: '600002 - Chennai' },
      { value: '600003', label: '600003 - Chennai' },
      { value: '700001', label: '700001 - Kolkata' },
      { value: '700002', label: '700002 - Kolkata' },
      { value: '700003', label: '700003 - Kolkata' },
      { value: '500001', label: '500001 - Hyderabad' },
      { value: '500002', label: '500002 - Hyderabad' },
      { value: '500003', label: '500003 - Hyderabad' },
      { value: '380001', label: '380001 - Ahmedabad' },
      { value: '380002', label: '380002 - Ahmedabad' },
      { value: '380003', label: '380003 - Ahmedabad' },
      { value: '110092', label: '110092 - Gurgaon' },
      { value: '110093', label: '110093 - Gurgaon' },
      { value: '110094', label: '110094 - Gurgaon' },
    ];
  }, []);

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    setSelectedState(null); // Reset state when country changes
  };

  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
  };

  return {
    countries,
    states,
    cities,
    indianStates,
    indianCities,
    indianPincodes,
    selectedCountry,
    selectedState,
    handleCountryChange,
    handleStateChange,
    setSelectedCountry,
    setSelectedState
  };
};

export default useLocationData;
