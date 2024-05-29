<script lang="ts">
  import type { SelectListing } from '$root/src/db/schema';

  export let listing: SelectListing;
</script>

<div class="grid grid-cols-6">
  <div class="col-span-2">
    <img class="w-full object-cover rounded-lg" src={listing.photoUrls[0]} />
  </div>

  <div class="col-span-6">
    <h2 class="font-extrabold text-xl">
      {listing.availableRooms} in a {listing.totalRooms}-BR {listing.propertyType}
    </h2>
  </div>
</div>
