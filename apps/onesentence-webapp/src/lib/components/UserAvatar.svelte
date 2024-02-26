<script lang="ts">
	import IconCheckOutlined from '$lib/icons/glue/IconCheckOutlined.svelte';

	export let user;

	$: formattedUserName = formatUserName(user?.name) || '';

	const formatUserName = (name: string) => {
		const words = name.split(' ');
		const lastWord = words[words.length - 1];
		const convertedWord = lastWord.charAt(0) + '.';
		words[words.length - 1] = convertedWord;
		return words.join(' ');
	};
</script>

<div class="flex items-center">
	<div class="avatar">
		<div class="h-8 w-8 rounded-full">
			<img src={user?.avatarUrl} />
		</div>
	</div>
	<div class="ml-3">
		<p class="text-sm font-medium leading-5">{formattedUserName}</p>
		<div class="flex items-center space-x-1">
			<p class="text-xs text-base-content/70">Cornell University</p>
			<span class="text-xs text-green-600 dark:text-green-300">
				<IconCheckOutlined />
			</span>
		</div>
	</div>
</div>
