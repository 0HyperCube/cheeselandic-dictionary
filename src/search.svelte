<script>
	export let onPreview;
	let value = "";
	let selected = 0;

	async function updatePreview() {
		searchResults = await onPreview(value) || [];
		selected = 0;
	}

	async function submit() {
		const value = searchResults[selected]?.link;
		if (value) {
			window.location.href = value;
		}
	}

	async function press(event){
		console.info(event.key)
		if (event.key == "ArrowUp"){
			event.preventDefault();
			selected -= 1;
			selected %= searchResults.length;
		}
		if (event.key == "ArrowDown"){
			event.preventDefault();
			selected += 1;
			selected %= searchResults.length;
		}
		if (event.key == "Enter" || event.key == "Return"){
			submit();
		}
	}

	let searchResults = [];
</script>

<div class="search" class:expanded={searchResults.length}>
	<input on:keydown={press} bind:value={value} on:submit={submit} on:input={updatePreview} autofocus><button on:click={submit}>Search</button>
	{#if searchResults.length}
	<ul class="hints">
		{#each searchResults as {text, link}, index}
			<li class:selected={index == selected}><a href={link}>{text}</a></li>
		{/each }
	</ul>
	
	{/if}
	
</div>

<style>
.search {
	position: relative;
	display: flex;
}
input {
	border-radius: 6px 0 0 6px;
	flex-grow: 1;
	padding: 5px;
	font-size: large;
}
.expanded > input {
	border-bottom-left-radius: 0;
}
button {
	border-radius: 0 6px 6px 0;
}
.expanded > button{
	border-bottom-right-radius: 0;
}
.hints {
	position: absolute;
	width: 100%;
	margin: 0;
	padding: 0;
	list-style-type: none;
	top: 100%;
}
.hints > li {
	width: 100%;
}
.hints > li > a {
	display: block;
	width: 100%;
	padding: 3px;
	color: white;
	text-decoration: none;
}
.hints > li {
	background-color: grey;	
}
.hints > li.selected {
	background-color: yellow;
}
.hints > li:hover {
	background-color: green;
}
.hints > li.selected:hover{
	background-color: yellowgreen;
}
.hints > li.selected > a {
	color: black;
}
.hints > li:last-of-type {
	border-radius: 0 0 6px 6px;
}
</style>