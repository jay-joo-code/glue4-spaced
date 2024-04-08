<script lang="ts">
  import { enhance } from '$app/forms';
  import { PageContainer } from '@glue/ui';
  import { APP_NAME } from '$lib/config';
</script>

<PageContainer {APP_NAME} title="Sign up">
  <div class="flex justify-center items-center min-h-[70vh]">
    <form class="w-full max-w-xs" method="post" use:enhance>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Username</span>
        </div>
        <input class="input input-bordered w-full" name="username" />
      </label>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Password</span>
        </div>
        <input class="input input-bordered w-full" type="password" name="password" />
      </label>

      <button class="btn btn-block mt-6 btn-primary">Sign up</button>
    </form>
  </div>
</PageContainer>
