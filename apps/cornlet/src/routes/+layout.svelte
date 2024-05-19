<script>
  import { AppLayout } from '@glue/ui';
  import {
    APP_NAME,
    PUBLIC_NAVS,
    PRIVATE_NAVS,
    FOOTER_NAVS,
    ACTION_BUTTONS_AUTHED,
    ACTION_BUTTONS_UNAUTHED,
    AVATAR_NAVS
  } from '$lib/config';
  import '$lib/app.css';

  export let data;
</script>

<AppLayout
  {APP_NAME}
  {PUBLIC_NAVS}
  {PRIVATE_NAVS}
  {FOOTER_NAVS}
  {AVATAR_NAVS}
  ACTION_BUTTONS={data.user ? ACTION_BUTTONS_AUTHED : ACTION_BUTTONS_UNAUTHED}
  user={data.user}
>
  <slot />
</AppLayout>
