import { locations } from '$lib/locations';
import distanceBetweenLatLng from './distanceBetweenLatLng';

const calculateMinsToOrg = (lat: number, lng: number, org: string) => {
  const distancesFromLocations = locations
    .filter((location) => location.org === org)
    .map((location) => distanceBetweenLatLng(location.lat, location.lng, lat, lng));
  const minDistance = Math.min(...distancesFromLocations);
  return (Math.round(minDistance * 10) / 10) * 20;
};

export default calculateMinsToOrg;
