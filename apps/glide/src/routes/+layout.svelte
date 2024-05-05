<script>
  import { AppLayout } from '@glue/ui';
  import { APP_NAME, PUBLIC_NAVS, PRIVATE_NAVS, FOOTER_NAVS } from '$lib/config';
  import '$lib/app.css';
</script>

<AppLayout {APP_NAME} {PUBLIC_NAVS} {PRIVATE_NAVS} {FOOTER_NAVS}>
  <slot />
</AppLayout>
