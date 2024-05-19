<script lang="ts">
  import { IconGoogle, TermsNotice } from '@glue/ui';

  export let APP_NAME: string;
  export let redirectTo: string;
  export let variant: 'center-box' | 'split-screen' = 'split-screen';
  export let bgPattern: 'temple' | 'autumn' = 'temple';

  const googleOAuthHref = `/auth/login/google?redirectTo=${redirectTo}`;
</script>

{#if variant === 'center-box'}
  <div class="flex h-full min-h-[85vh] items-center justify-center px-4">
    <div
      class="my-8 w-full rounded-xl border border-base-content/20 bg-base-100 px-8 py-16 text-center sm:max-w-sm"
    >
      <h1 class="text-3xl font-bold">Welcome back</h1>
      <p class="mt-2 text-sm text-base-content/70">Sign in to get started with {APP_NAME}</p>

      <!-- oauth -->
      <div class="mt-12 space-y-4">
        <a type="button" class="btn-outline btn-block btn mt-2 gap-2" href={googleOAuthHref}>
          <IconGoogle /> Sign in with Google
        </a>
      </div>

      <!-- terms -->
      <div class="mt-8">
        <TermsNotice {APP_NAME} />
      </div>
    </div>
  </div>
{:else if variant === 'split-screen'}
  <div class="grid grid-cols-1 lg:grid-cols-5 min-h-[85vh]">
    <div
      class="opacity-20 hidden lg:block lg:col-span-2 text-primary"
      class:bg-pattern-temple={bgPattern === 'temple'}
      class:bg-pattern-autumn={bgPattern === 'autumn'}
    ></div>

    <div class="flex justify-center items-center lg:col-span-3">
      <div class="w-full max-w-xs flex flex-col items-center text-center">
        <div class="rounded-full py-2 px-4 bg-primary/10">
          <h2 class="font-extrabold text-primary">{APP_NAME}</h2>
        </div>

        <p class="font-extrabold mt-10 text-3xl">Welcome back</p>
        <p class="text-base-content/80 mt-3 text-sm">Sign in to continue using {APP_NAME}</p>
        <div class="mt-12 space-y-4 w-full">
          <a type="button" class="btn-outline btn-block btn mt-2 gap-2" href={googleOAuthHref}>
            <IconGoogle /> Sign in with Google
          </a>
        </div>
        <div class="mt-8">
          <TermsNotice {APP_NAME} />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .bg-pattern-temple {
    background-color: oklch(var(--p));
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .bg-pattern-autumn {
    background-color: oklch(var(--p));
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='autumn' fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
