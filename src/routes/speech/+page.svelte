<script lang="ts">
	export let form;

	import { BrowserClient, BrowserMicrophone } from '@speechly/browser-client';
  import { slide} from "svelte/transition";
	import {onMount} from "svelte";
	import Loading from "../../components/Loading.svelte";
	import { enhance } from '$app/forms';

	const microphone = new BrowserMicrophone();

	let formRef: HTMLFormElement;
	let transcripts: HTMLTextAreaElement;
	let segmantsHolder: HTMLDivElement;

	let blocking = false;
	let isLoading = false;
  let ready = false;
	let is_recording = false;
	let result:string | null | undefined;
	let context = localStorage.getItem("context") ?? "This is a business email. I am the head of HR of the company ABC";
	$: result= form?.result;

	const onSaveContext = (val: string) => {
		localStorage.setItem("context", val);
	}

	const client = new BrowserClient({
		appId: '60a83715-9ecc-406c-aad1-eb2a603b47b2',
		logSegments: true,
		debug: true,
	})

	client.onStop(() => is_recording = false)
	client.onStart(() => is_recording = true)

	client.onSegmentChange((segment) => {
		const text = segment.words.map((word) => word.value).join(' ');
		segmantsHolder.innerHTML = `${text}`;
		if (segment.isFinal) {
			transcripts.value += `${text},`;
			segmantsHolder.innerHTML = ``;
		}
	});

	const attachMicrophone = async () => {
		if (microphone.mediaStream) return;
		await microphone.initialize();
		await client.attach(microphone.mediaStream!);
	};

	const toggleRecording = async () => {
		if(blocking) return
		if (client.isActive()) {
			await client.stop();
		} else {
			await attachMicrophone();
			await client.start();
		}
		blocking = true
		setTimeout(() => blocking = false, 1000)
	};


	onMount(() => {
		ready = true;
	});

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
	<div class="flex flex-col justify-center items-center ">

	<div class={`flex flex-col rounded-full border-2 p-2 cursor-pointer transition-all border-secondary hover:bg-secondary group relative
			${is_recording ? 'bg-secondary ' : 'border-secondary'}
	`}>
		<svg 
		on:click={toggleRecording}
		class={`fill-secondary group-hover:fill-white transition-all group-hover:animate-pulse ${is_recording ? 'animate-pulse fill-white' : ''}`}
		 height="34px" width="34px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z"></path> <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z"></path> </g> </g> </g></svg>

	</div>

{#if is_recording}
	<span in:slide={{duration:500}} out:slide={{duration:500}} class="text-center animate-pulse">Recording...</span>
{/if}

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
				<div 
					bind:this={segmantsHolder}
					 class="w-full"></div>
				<textarea 
					bind:value={context}
					on:blur={(e) => onSaveContext(e.currentTarget.value)}
					name="context" class="bg-[#D9D9D9] rounded-sm resize-none p-4" rows={2}></textarea>
			</div>

		<span class="text-lg">Prompt:</span>
		<textarea 
				bind:this={transcripts}
				name="prompt" class="bg-[#D9D9D9] rounded-sm resize-none p-4" rows={6}></textarea>
{#if form?.result}
			<span class="text-lg">Response:</span>
		<textarea 
					in:slide={{duration:500}} 
					value={result}
					on:change={e => result = e.currentTarget.value}
					name="response" class="bg-[#D9D9D9] rounded-sm p-4" rows={12}
				></textarea>
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
