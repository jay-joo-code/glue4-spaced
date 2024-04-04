<script lang="ts">
  import { Navbar } from '@glue/ui';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { format } from 'date-fns';
  import type { Nav } from '@glue/types';

  export let APP_NAME: string;
  export let PUBLIC_NAVS: Nav[];
  export let PRIVATE_NAVS: Nav[];

  const sitemap = [
    {
      label: 'About',
      href: '/about'
    },
    {
      label: 'Products',
      isParent: true,
      children: [
        {
          label: 'Editor',
          href: '/editor'
        },
        {
          label: 'Webapp',
          href: '/webapp'
        }
      ]
    }
  ];

  const publicNavGroup = {
    heading: 'Product',
    navs: PUBLIC_NAVS?.map(({ label, path }) => ({
      label,
      href: path
    }))
  };

  const privateNavGroup = {
    heading: 'My pages',
    navs: PRIVATE_NAVS?.map(({ label, path }) => ({
      label,
      href: path
    }))
  };

  const toastOptions = {
    dismissable: false,
    theme: {
      '--toastContainerRight': '1rem',
      '--toastBarHeight': '0',
      '--toastPadding': '0.2rem 0.6rem',
      '--toastMsgPadding': '0.2rem 0.2rem 0.2rem 0.4rem',
      '--toastBorderRadius': '0.5rem',
      '--toastMinHeight': '0',
      '--toastWidth': 'auto'
    }
  };

  $: navGroups = [publicNavGroup];
</script>

<div class="toast-styles">
  <SvelteToast options={toastOptions} />
</div>

<div class="w-screen">
  <Navbar
    appName={APP_NAME}
    {sitemap}
    actionButtons={[
      {
        label: 'Sign in',
        href: '/sign-in'
      },
      {
        label: 'Get starated',
        href: '/get-started',
        isPrimary: true
      }
    ]}
  />

  <div class="flex flex-col items-center">
    <div class="relative w-full">
      <!-- body content -->
      <div class="min-h-[82vh]">
        <slot />
      </div>

      <!-- footer -->
      <footer
        class="flex justify-center border-t border-base-content/10"
        aria-labelledby="footerHeading"
      >
        <h2 id="footerHeading" class="sr-only">Footer</h2>
        <div class="sm:py-18 relative mx-auto w-full max-w-4xl px-4 py-16 md:py-24 lg:py-24">
          <div class="xl:grid xl:grid-cols-3 xl:gap-8">
            <div class="xl:col-span-1">
              <a class="text-3xl font-bold text-base-content/70" href="/">{APP_NAME}</a>
              <p class="mt-4 text-xs font-medium text-base-content/60">
                {APP_NAME} ©
                {format(new Date(), 'yyyy')}
              </p>
            </div>
            <div class="mt-12 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
              <div class="grid grid-cols-2 gap-8 md:grid-cols-3">
                {#each navGroups as navGroup}
                  <div>
                    <h6 class="ml-1 text-lg font-bold text-base-content/80">{navGroup?.heading}</h6>
                    <ul class="mt-4 space-y-1">
                      {#each navGroup.navs as nav}
                        <li>
                          <a
                            href={nav.href}
                            class="btn-ghost btn-sm btn whitespace-nowrap px-1 text-left font-medium text-base-content/60"
                          >
                            {nav.label}
                          </a>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</div>

<style>
  .toast-styles {
    font-size: 0.9rem;
  }
</style>
