import type { SelectListing } from '$root/src/db/schema';

const roommateDesc = (listing: SelectListing) => {
  let description = '';

  if (listing.nonbinaryRoommates > 0) {
    description += `${listing.nonbinaryRoommates} nonbinary`;
    if (listing.femaleRoommates > 0 || listing.maleRoommates > 0) {
      description += ' · ';
    }
  }

  if (listing.femaleRoommates > 0) {
    description += `${listing.femaleRoommates} female`;
    if (listing.maleRoommates > 0) {
      description += ' · ';
    }
  }

  if (listing.maleRoommates > 0) {
    description += `${listing.maleRoommates} male`;
  }

  description += ' roommate';

  if (listing.maleRoommates + listing.femaleRoommates + listing.nonbinaryRoommates > 1) {
    description += 's';
  }

  return description;
};

export default roommateDesc;
