import findClosestLocation from './findClosestLocation';

const listingLocation = (lat: number, lng: number, minsToOrg: number, org: string) => {
  return `${findClosestLocation(lat, lng, org)} • ${minsToOrg} mins to campus`;
};

export default listingLocation;
