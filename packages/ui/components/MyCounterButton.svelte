<script lang="ts">
  let count = 0;

  function handleClick() {
    count += 1;
  }
</script>

<button class="btn btn-primary" on:click={handleClick}>
  revoluationary new counter: {count}
</button>
