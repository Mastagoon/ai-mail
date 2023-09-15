<script>
	import {onMount} from "svelte";
	//API ito handle audio recording
	onMount(() => {
				if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
						//feature is not supported in browser
						//return a custom error
				} else {
					navigator.mediaDevices.getUserMedia({ audio: true }/*of type MediaStreamConstraints*/)				
					.then(s => {
						console.log("WE GOT STREAM BOIS")
						const recorder = new MediaRecorder(s)
						recorder.addEventListener("dataavailable", e => {
							console.log("DATA")
							console.log(e)
						})
						recorder.start()
					setTimeout(() => {
						recorder.stop()
						},3000)
					})
				.catch(e => console.log(e))
				}
	})
	var audiorecorder = {
			start: function () {
				//feature detection
				if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
						//feature is not supported in browser
						//return a custom error
				alert("Oh uh...")
				} else {
					navigator.mediaDevices.getUserMedia({ audio: true }/*of type MediaStreamConstraints*/)				
					.then(s => {
						console.log("WE GOT STREAM BOIS")
						const recorder = new MediaRecorder(s)
						recorder.addEventListener("dataavilable", e => {
							console.log("DATA")
							console.log(e)
						})
						recorder.start()
					})
				.catch(e => console.log(e))
			}
			},
			stop: function () {
			//..k.
			},
			/** Cancel audio recording*/
			cancel: function () {
			//...
			}
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-row justify-center gap-8 items-center">
		<h1 class="text-2xl font-bold">Recording...</h1>
		<button 
			onClick={() => {
				audioRecorder.start()
			}}
			class="border-[1px] px-4 py-3 border-[#19231A] rounded-[5px] flex 
		hover:text-white
		flex-row items-center gap-4 hover:bg-secondary">
			Pause
		</button>
	</div>
	<textarea class="bg-[#D9D9D9] rounded-sm resize-none" disabled rows={25}></textarea>

	<div class="flex flex-row justify-center">
		<button class="border-[1px] px-4 py-3 border-[#19231A] rounded-[5px] flex 
		hover:text-white
		flex-row items-center gap-4 hover:bg-secondary">
			Send
		</button>
	</div>
</div>
