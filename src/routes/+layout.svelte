<script>
  import "../app.css";
</script>

<svelte:head>
	<title>AI Mail</title>
	<meta name="robots" content="noindex nofollow" />
	<html lang="en" />
</svelte:head>

<div class="container mx-auto my-2 h-full w-full">
	<div class="flex flex-row mb-12">
		<a href="/">
			<img src="logo.svg" alt="">
		</a>
	</div>
	<slot />
</div>
