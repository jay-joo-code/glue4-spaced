import type { SelectListing } from '$root/src/db/schema';
import { format } from 'date-fns';

const listingDateRange = (listing: SelectListing) => {
  return `${format(new Date(listing.start), 'MM/dd')} - ${format(
    new Date(listing.end),
    'MM/dd'
  )}, ${format(new Date(listing.end), 'yyyy')}`;
};

export default listingDateRange;
