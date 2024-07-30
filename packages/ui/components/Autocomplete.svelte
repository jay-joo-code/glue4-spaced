<script lang="ts">
  export let value: string;
  export let suggestions: Suggestion[];
  export let onSuggestionSelect: (suggestion: Suggestion) => void;
  export let getSuggestionLabel: (suggestion: Suggestion) => string;

  type Suggestion = $$Generic<Record<string, unknown>>;

  let highlightedIdx = -1;
  let isInputFocused = false;
  let inputElement: HTMLInputElement;

  function handleKeydown(event: KeyboardEvent) {
    const { key } = event;

    if (key === 'ArrowDown') {
      event.preventDefault();
      highlightedIdx = (highlightedIdx + 1) % suggestions.length;
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      highlightedIdx = (highlightedIdx - 1 + suggestions.length) % suggestions.length;
    } else if (key === 'Enter') {
      event.preventDefault();
      if (highlightedIdx >= 0) {
        inputElement.blur();
        onSuggestionSelect(suggestions[highlightedIdx]);
      }
    }
  }
</script>

<div class="relative">
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Address</span>
    </div>
    <input
      bind:this={inputElement}
      type="text"
      class="input input-bordered w-full max-w-lg"
      bind:value
      on:keydown={handleKeydown}
      on:focus={() => {
        isInputFocused = true;
      }}
      on:blur={() => {
        isInputFocused = false;
      }}
    />
  </label>
  {#if isInputFocused && suggestions.length > 0}
    <div
      class="absolute top-full mt-2 left-0 w-full border border-base-content/10 p-1 rounded-lg z-20 bg-base-100"
    >
      {#each suggestions as suggestion, idx}
        <button
          class="w-full justify-start btn btn-ghost"
          class:bg-base-200={highlightedIdx === idx}
          on:click={() => onSuggestionSelect(suggestion)}
        >
          {getSuggestionLabel(suggestion)}
        </button>
      {/each}
    </div>
  {/if}
</div>
