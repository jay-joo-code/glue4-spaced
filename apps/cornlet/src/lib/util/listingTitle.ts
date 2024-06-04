import type { SelectListing } from '$root/src/db/schema';

const listingTitle = (listing: SelectListing) => {
  const propertyDesc =
    listing.propertyType === 'studio'
      ? 'studio'
      : `${listing.totalRooms}-BR ${listing.propertyType}`;
  const roomSingularPlural = listing.availableRooms > 1 ? 'rooms' : 'room';
  return `${listing.availableRooms} ${roomSingularPlural} in a ${propertyDesc}`;
};

export default listingTitle;
