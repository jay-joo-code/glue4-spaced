<script>
  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { currentUser, pb } from '$lib/glue/pocketbase';
  import * as Sentry from '@sentry/sveltekit';
  import { onMount } from 'svelte';
  import Footer from '../Footer.svelte';
  import { FeedbackButtonModal } from '@glue/ui';
  import TrackWidth from './TrackWidth.svelte';
  import './app.css';
  import { APP_NAME } from '../../glue/config';
  import { Navbar } from '@glue/ui';

  let topAnchor;
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

  afterNavigate(() => {
    if (topAnchor) {
      topAnchor.scrollIntoView();
    }
  });

  const identifyHeap = () => {
    if (browser && window && $currentUser) {
      const heapId = `${$currentUser?.name.replace(/\s/g, '-')}-${$currentUser?.id}`;
      window.heap?.identify(heapId);
      window.heap?.addUserProperties({
        id: $currentUser?.id,
        name: $currentUser?.name,
        email: $currentUser?.email
      });
    }
  };

  const identifySentry = () => {
    if (browser && window && $currentUser) {
      Sentry.setUser({
        id: $currentUser?.id,
        username: $currentUser?.name,
        email: $currentUser?.email
      });
    } else {
      Sentry.setUser(null);
    }
  };

  onMount(() => {
    identifyHeap();
    identifySentry();
  });
</script>

<TrackWidth />

<div bind:this={topAnchor} />

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
      <Footer />

      <!-- feedback -->
      <FeedbackButtonModal appName={APP_NAME} {pb} {currentUser} />
    </div>
  </div>
</div>
