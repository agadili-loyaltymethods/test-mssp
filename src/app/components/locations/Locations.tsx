import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { setLocation } from '../../redux/slices/locationSlice';
import { useLocationService } from '../../hooks/useLocationService';
import { useAlertService } from '../../hooks/useAlertService';
import { Location } from '../../types';
import './Locations.scss';

const Locations: React.FC = () => {
  const dispatch = useDispatch();
  const { getLocations } = useLocationService();
  const { errorAlert } = useAlertService();
  
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getLocations();
        const filteredLocations = locations.filter(
          (location: Location) => !location.ext.hideInMSSP
        );
        
        setAllLocations(filteredLocations);
        
        if (filteredLocations.length > 0) {
          setSelectedLocation(filteredLocations[0].name);
          handleLocationChange(filteredLocations[0].name);
        }
      } catch (error: any) {
        errorAlert(error?.error?.error || error?.message);
      }
    };
    
    fetchLocations();
  }, [getLocations, errorAlert]);
  
  const handleLocationChange = (locationName: string) => {
    const location = allLocations.find(loc => loc.name === locationName);
    if (location) {
      dispatch(setLocation({ location: location.number }));
    }
  };
  
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const locationName = event.target.value;
    setSelectedLocation(locationName);
    handleLocationChange(locationName);
  };
  
  if (allLocations.length === 0) {
    return null;
  }
  
  return (
    <Box display="flex" flexDirection="column" flex="1" alignItems="center">
      <FormControl variant="outlined" size="small" fullWidth>
        <InputLabel>Property Name</InputLabel>
        <Select
          value={selectedLocation}
          onChange={handleSelectChange}
          label="Property Name"
          startAdornment={
            <span className="material-symbols-outlined distance-icon">distance</span>
          }
        >
          {allLocations.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              {option.ext.operator && option.ext.operator !== 'PlayNow'
                ? `${option.ext.operator} - ${option.name}`
                : option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Locations;
