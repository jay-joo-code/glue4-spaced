<script>
  import { AppLayout } from '@glue/ui';
  import config from '$lib/glue/config';
  import '$lib/glue/app.css';

  export let data;
</script>

<AppLayout
  APP_NAME={config.appName}
  ACTION_BUTTONS={data.user
    ? [
        {
          label: 'Sign out',
          href: '/glue/logout',
          variant: 'ghost'
        }
      ]
    : [
        {
          label: 'Sign in',
          href: '/glue/login',
          variant: 'ghost'
        }
      ]}
>
  <slot />
</AppLayout>
