<script lang="ts">
  import { slide} from "svelte/transition";
  import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import Loading from "../../components/Loading.svelte";

	export let form
	let isLoading = false;
	let result:string | null | undefined;
	$: result= form?.result;

  let ready = false;
  onMount(() => ready = true);

	let formRef: HTMLFormElement;

	let context = localStorage.getItem("context") ?? "This is a business email. I am the head of HR of the company ABC";

	const onSaveContext = (val: string) => {
		localStorage.setItem("context", val);
	}

</script>

{#if ready}

<div 
		in:slide={{duration:500}} out:slide={{duration:500}}
		on:keypress={e => {
			if (e.key === "Enter" && e.ctrlKey) {
				formRef.requestSubmit()
			}
		}}
		class="flex flex-col gap-4">
	<div class="flex flex-row justify-center gap-8 items-center">
		<h1 class="text-2xl font-bold capitalize">Write an email prompt</h1>
	</div>
	<form 
			bind:this={formRef}
			method="POST" class="flex flex-col gap-4" use:enhance={() => {
				isLoading = true
				return async ({ update }) => {
				await update({ reset: false });
				isLoading = false
			};
	}}>
			<div class="flex flex-col gap-1">
				<label class="text-lg " for="context">Context</label>
				<textarea 
					bind:value={context}
					on:blur={(e) => onSaveContext(e.currentTarget.value)}
					name="context" class="bg-[#D9D9D9] rounded-sm resize-none p-4" rows={2}></textarea>
			</div>

		<span class="text-lg">Prompt:</span>
		<textarea name="prompt" class="bg-[#D9D9D9] rounded-sm resize-none p-4" rows={6}></textarea>
{#if form?.result}
			<span class="text-lg">Response:</span>
		<textarea 
					in:slide={{duration:500}} 
					value={result}
					on:change={e => result = e.currentTarget.value}
					name="response" class="bg-[#D9D9D9] rounded-sm resize-none p-4" rows={12}></textarea>
{/if}
		<div class="flex flex-row justify-center gap-8 ">
			<button
					type="submit" class="border-[1px] px-4 py-3 border-[#19231A] rounded-[5px] flex 
			hover:text-white
			flex-row items-center gap-4 hover:bg-secondary">
					{form?.result ? "Regenerate" : "Generate"}
			</button>
{#if form?.result}
		<a
			href={`mailto:?subject=&body=${encodeURIComponent(result??"")}`}
			class="border-[1px] px-4 py-3 border-[#19231A] rounded-[5px] flex 
			hover:text-white
			flex-row items-center gap-4 hover:bg-secondary">
				Send mail
		</a>
{/if}
		</div>
	</form>

</div>

{#if isLoading}
		<Loading t="Generating your email..."/>
{/if}

{#if form?.error}
	<p in:slide={{duration:500}} class="text-red-500 text-center">{form?.error}</p>
{/if}
{/if}
