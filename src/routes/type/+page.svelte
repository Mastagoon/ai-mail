<script>
  import { slide} from "svelte/transition";
  import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import Loading from "../../components/Loading.svelte";
    import { reset } from "__sveltekit/paths";

	export let form
	let isLoading = false;

  let ready = false;
  onMount(() => ready = true);

	const handleSend = () => {

	}
</script>

{#if ready}
<div class="flex flex-col gap-4">
	<div class="flex flex-row justify-center gap-8 items-center">
		<h1 class="text-2xl font-bold capitalize">Write an email prompt</h1>
	</div>
	<form method="POST" class="flex flex-col gap-4" use:enhance={() => {
		isLoading = true
		return async ({ update }) => {
			await update({ reset: false });
			isLoading = false
		};
	}}>
			<div class="flex flex-col gap-1">
				<label class="text-lg " for="context">{isLoading}</label>
				<textarea 
					value="This is a business email, you are the CEO of a company"
					name="context" class="bg-[#D9D9D9] rounded-sm resize-none p-4" rows={2}></textarea>
			</div>

{#if form?.result}
		<textarea name="prompt" class="bg-[#D9D9D9] rounded-sm resize-none p-4" rows={6}></textarea>
			<span>Response:</span>
		<textarea value={form?.result??""} name="response" class="bg-[#D9D9D9] rounded-sm resize-none p-4" rows={12}></textarea>
{/if}
		<div class="flex flex-row justify-center gap-8 bg-red-500">
			<button
					type="submit" class="border-[1px] px-4 py-3 border-[#19231A] rounded-[5px] flex 
			hover:text-white
			flex-row items-center gap-4 hover:bg-secondary">
				Generate
			</button>
{#if form?.result}
		<button
			on:click={handleSend}
			type="submit" class="border-[1px] px-4 py-3 border-[#19231A] rounded-[5px] flex 
			hover:text-white
			flex-row items-center gap-4 hover:bg-secondary">
				Send mail
		</button>
{/if}
		</div>
	</form>

</div>

{#if isLoading}
		<Loading/>
{/if}

{#if form?.error}
	<p in:slide={{duration:500}} class="text-red-500 text-center">{form?.error}</p>
{/if}
{/if}
