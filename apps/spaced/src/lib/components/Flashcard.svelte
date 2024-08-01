<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { IconCheckOutlined } from '@glue/ui';
  import { Editor } from '@tiptap/core';
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
  import Document from '@tiptap/extension-document';
  import FloatingMenu from '@tiptap/extension-floating-menu';
  import Link from '@tiptap/extension-link';
  import Placeholder from '@tiptap/extension-placeholder';
  import Table from '@tiptap/extension-table';
  import TableCell from '@tiptap/extension-table-cell';
  import TableHeader from '@tiptap/extension-table-header';
  import TableRow from '@tiptap/extension-table-row';
  import Typography from '@tiptap/extension-typography';
  import StarterKit from '@tiptap/starter-kit';
  import { toast } from '@zerodevx/svelte-toast';
  import { add, format, formatDistanceToNowStrict } from 'date-fns';
  import debounce from 'debounce';
  import 'highlight.js/styles/github-dark.css';
  import { lowlight } from 'lowlight';
  import { onDestroy, onMount } from 'svelte';

  export let flashcard;

  let element: HTMLDivElement;
  let editor: Editor;
  let flashcardHeight: number;

  const debouncedUpdateFlashcard = debounce.debounce(async () => {
    if (flashcard?.body !== editor.getHTML() && editor.getText().length > 0) {
      const response = await fetch(`/glue/api/crud/flashcard/${flashcard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: editor.getHTML()
        })
      });

      if (!response.ok) {
        toast.push('There was an error with debounced saving flashcard body');
      }
    }
  }, 500);

  const CodeBlockExtension = CodeBlockLowlight.extend({
    addKeyboardShortcuts() {
      return {
        Tab: ({ editor }) => {
          if (editor.isActive('codeBlock')) {
            return editor.commands.insertContent('\t');
          }
          return false;
        }
      };
    }
  }).configure({
    lowlight
  });

  const CustomDocument = Document.extend({
    content: 'heading block*'
  });

  const incrementDue = async (days: number) => {
    const due = add(new Date(), { days });
    const response = await fetch(`/glue/api/crud/flashcard/${flashcard.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        due
      })
    });

    if (response.ok) {
      toast.push(`Updated due date to ${format(due, 'yyyy/MM/dd iii')}`);
      invalidateAll();
    } else {
      toast.push('There was an error with updating due date');
    }
  };

  const incrementRandomDue = (min: number, max: number) => {
    const days = Math.round(Math.random() * (max - min)) + min;
    incrementDue(days);
  };

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        CustomDocument,
        StarterKit.configure({
          document: false,
          codeBlock: false
        }),
        CodeBlockExtension,
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
              return 'What’s the title?';
            }
          }
        }),
        Typography,
        FloatingMenu.configure({
          element: document.querySelector('.floating-menu')
        }),
        Link,
        Table.configure({
          resizable: true
        }),
        TableRow,
        TableHeader,
        TableCell
      ],
      content: flashcard?.body,
      onTransaction: () => {
        editor = editor; // force re-render
        debouncedUpdateFlashcard();
      },
      onBlur: async ({ editor }) => {
        if (editor?.getText()?.trim()?.length === 0) {
          const response = await fetch(`/glue/api/crud/flashcard/${flashcard.id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            invalidateAll();
          } else {
            toast.push('There was an error with deleting the empty flashcard');
          }
        }
      }
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<div
  class="relative rounded-lg border border-base-content/20 px-3 py-4"
  bind:clientHeight={flashcardHeight}
>
  <div class="floating-menu ml-2 opacity-70">
    <button
      on:click={() => editor?.chain().focus().toggleCodeBlock().run()}
      class="btn-secondary btn-outline btn-xs btn {editor?.isActive('codeBlock')
        ? 'is-active'
        : ''}"
    >
      code block
    </button>
    <button
      class="btn-secondary btn-outline btn-xs btn"
      on:click={() =>
        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
    >
      insertTable
    </button>
  </div>

  <div class="absolute right-2 bottom-2 z-[1] flex items-center space-x-2">
    <select
      class="select select-bordered w-full max-w-xs select-sm"
      on:input={async (event) => {
        const categoryId = event.currentTarget.value;
        const response = await fetch(`/glue/api/crud/flashcard/${flashcard.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            categoryId: categoryId === 'uncategorized' ? null : categoryId
          })
        });

        if (response.ok) {
          invalidateAll();
        } else {
          toast.push('There was an error with handling your request');
        }
      }}
    >
      {#await $page.data.lazy.categories then categories}
        {#each categories as category}
          <option selected={flashcard.categoryId === category.id} value={category.id}
            >{category.name}</option
          >
        {/each}
      {/await}
    </select>

    <div class="dropdown-left dropdown">
      <label tabindex="0" class="btn-secondary btn-xs btn m-1 text-lg"><IconCheckOutlined /></label>

      <ul
        tabindex="0"
        class="dropdown-content menu rounded-box z-[2] bg-base-100 p-2 text-end shadow"
      >
        <li
          on:click={() => {
            incrementRandomDue(2, 4);
          }}
        >
          <a>+2~4</a>
        </li>
        <li
          on:click={() => {
            incrementRandomDue(6, 8);
          }}
        >
          <a>+6~8</a>
        </li>
        <li
          on:click={() => {
            incrementRandomDue(13, 15);
          }}
        >
          <a>+13~15</a>
        </li>
        <li
          on:click={() => {
            incrementRandomDue(20, 22);
          }}
        >
          <a>+20~22</a>
        </li>
        <li
          on:click={() => {
            incrementRandomDue(27, 29);
          }}
        >
          <a>+27~29</a>
        </li>
        <li
          on:click={() => {
            incrementRandomDue(34, 36);
          }}
        >
          <a>+34~36</a>
        </li>
        <li
          on:click={() => {
            incrementRandomDue(41, 43);
          }}
        >
          <a>+41~43</a>
        </li>
        <li
          on:click={() => {
            incrementRandomDue(365, 365);
          }}
        >
          <a>+365</a>
        </li>
      </ul>
    </div>
  </div>

  <!-- direct parent div required for keyboard navigation, focus handling -->
  <div>
    <div bind:this={element} />
  </div>

  <div class="mt-4">
    <p class="text-xs text-base-content/70">
      Due in {formatDistanceToNowStrict(new Date(flashcard?.due))} • Created {formatDistanceToNowStrict(
        new Date(flashcard?.createdAt)
      )} ago
    </p>
  </div>
</div>

<style>
  :global(.ProseMirror) {
    outline: none;
    word-break: break-word;
  }
  :global(.ProseMirror ul),
  :global(.ProseMirror ol) {
    padding: 0 1rem;
    list-style: disc;
  }
  :global(.ProseMirror h1) {
    line-height: 1.3;
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  :global(.ProseMirror h2) {
    font-weight: bold;
    margin-bottom: 0.2rem;
    color: oklch(var(--ac));
  }
  :global(.ProseMirror p) {
    opacity: 0.9;
    font-size: 1rem;
  }
  :global(.ProseMirror a) {
    text-decoration: underline;
    cursor: pointer;
  }
  :global(.ProseMirror code) {
    background-color: oklch(var(--b3));
    color: oklch(var(--er));
  }
  :global(.ProseMirror pre) {
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  :global(.ProseMirror pre code) {
    color: inherit;
    padding: 0;
    background: none;
    font-size: 0.8rem;
  }
  :global(.ProseMirror img) {
    max-width: 100%;
    height: auto;
  }
  :global(.ProseMirror blockquote) {
    padding-left: 1rem;
    border-left: 2px solid rgba(13, 13, 13, 0.1);
  }
  :global(.ProseMirror hr) {
    border: none;
    border-top: 2px solid rgba(13, 13, 13, 0.1);
    margin: 2rem 0;
  }
  :global(.ProseMirror table) {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;
  }

  :global(.ProseMirror td, th) {
    border: 1px solid hsl(var(--bc) / 0.3);
    box-sizing: border-box;
    min-width: 1em;
    padding: 3px 5px;
    position: relative;
    vertical-align: top;
    font-size: 0.875rem;
  }

  :global(.ProseMirror td, th > *) {
    margin-bottom: 0;
  }

  :global(.ProseMirror th) {
    background-color: oklch(var(--b2));
    font-weight: medium;
    text-align: left;
  }

  :global(.ProseMirror p) {
    margin: 0;
  }

  :global(.ProseMirror .selectedCell:after) {
    background: rgba(200, 200, 255, 0.4);
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }

  :global(.ProseMirror .column-resize-handle) {
    background-color: #adf;
    bottom: -2px;
    position: absolute;
    right: -2px;
    pointer-events: none;
    top: 0;
    width: 4px;
  }

  :global(.ProseMirror .tableWrapper) {
    padding: 1rem 0;
    overflow-x: auto;
  }
</style>
