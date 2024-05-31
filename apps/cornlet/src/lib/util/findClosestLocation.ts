import { locations } from '$lib/locations';
import distanceBetweenLatLng from './distanceBetweenLatLng';

const findClosestLocation = (lat: number, lng: number, org: string) => {
  const locationsWithDistance = locations
    .filter((location) => location.org === org)
    .map((location) => ({
      ...location,
      distance: distanceBetweenLatLng(location.lat, location.lng, lat, lng)
    }));

  if (locationsWithDistance.length === 0) {
    return '';
  }

  let smallestDistance = locationsWithDistance[0].distance;
  let nameWithSmallestDistance = locationsWithDistance[0].name;

  for (const location of locationsWithDistance) {
    if (location.distance < smallestDistance) {
      smallestDistance = location.distance;
      nameWithSmallestDistance = location.name;
    }
  }

  return nameWithSmallestDistance;
};

export default findClosestLocation;
