<script lang="ts">
	import SectionBoldStatement from '$lib/components/glue/landing/SectionBoldStatement.svelte';
	import SectionFeatureList from '$lib/components/glue/landing/SectionFeatureList.svelte';
	import SectionHero from '$lib/components/glue/landing/SectionHero.svelte';
	import SectionInfo from '$lib/components/glue/landing/SectionInfo.svelte';
	import SectionRotatingCirclesHero from '$lib/components/glue/landing/SectionRotatingCirclesHero.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
</script>

<PageContainer title="About us" isHoriPadding={false}>
	<SectionRotatingCirclesHero />
	<SectionHero />
	<SectionFeatureList />
	<SectionBoldStatement />
	<SectionInfo />
	<SectionInfo isReversed={true} />
	<SectionBoldStatement
		overline="Get started"
		heading="Ready to get started with our calendars?"
		desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius nisi debitis in autem iure distinctio omnis sapiente laboriosam id ipsa!"
		linkLabel="Get started"
		linkHref="/" />
</PageContainer>
