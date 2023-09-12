<script >
	export let t = "Loading...";
</script>

<div class="fixed  top-0 left-0 right-0 bottom-0 h-100 bg-black/[.5] z-20 m-0 p-0 cursor-pointer">
	<div class="absolute top-1/2 text-white text-2xl cursor-default select-none text-bold m-0 p-0 left-1/2 -translate-y-1/2  -translate-x-1/2">
		<div class="flex flex-col items-center justify-center text-center">
			<span class="inline-flex h-20 w-20 animate-spin cursor-pointer rounded-full border-t-2 border-sky-400"></span>
			<h1 class="my-1 animate-pulse cursor-pointer">
				{t}
			</h1>
		</div>
	</div>
</div>
