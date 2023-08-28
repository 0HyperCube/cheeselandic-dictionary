<script>
import Search from "../search.svelte";

let valuesList = [];

async function load() {
	const spreadsheet = "1dbhdgr5Ww1f4of3AfJwBvDMe2zQM6l4_5Z9BVoOJNF8";
	const key = "AIzaSyCEtrGstZkKNC6w7fTm6V6B4Av0F2wwNys";
	// let spreadsheetData = await fetch(
	// 	`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet}?key=${key}`,
	// 	{ method: "GET" }
	// );
	// const json = await spreadsheetData.json();
	// const rangeId = json.sheets[0].basicFilter.range;
	// console.info(json)

	const range = "Sheet1";
	const values = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet}/values/${range}?key=${key}`)
	const valuesJson = await values.json();
	console.info(valuesJson)
	let currentRow = Number(valuesJson.range.split("!")[1].split(":")[0].replace(/\D/g, "")) || 1;
	console.info(currentRow);

	valuesList = valuesJson.values.map((values) => {
		currentRow += 1;
		return [currentRow-1, values]
	}).slice(1).filter(([_row, x]) => x[0] && x[1]).map(([row, x]) => {
		return {
			link: `https://docs.google.com/spreadsheets/d/1dbhdgr5Ww1f4of3AfJwBvDMe2zQM6l4_5Z9BVoOJNF8/view#gid=0&range=B${row}:A${row}`,
			english: x[0],
			cheeselandic: x[1],
			alternatives: x.slice(2)
		};
	});
	console.info(valuesList);
	
}

function preview(search){
	if (!search.length) {
		return []
	}

	let results = [];
	for (let index in valuesList){
		const value = valuesList[index];
		if (value.english.toLowerCase().includes(search.toLowerCase())){
			results.push({text:`${value.english} (en) -> ${value.cheeselandic} (chz)`, link: value.link})
		}
	}
	for (let index in valuesList){
		const value = valuesList[index];
		if (value.cheeselandic.toLowerCase().includes(search.toLowerCase())){
			results.push({text:`${value.cheeselandic} (chz) -> ${value.english} (en)`, link: value.link})
		}
	}
	for (let index in valuesList){
		const value = valuesList[index];
		if (value.alternatives.find((alternative) => alternative.toLowerCase().includes(search.toLowerCase()))){
			results.push({text:`${value.cheeselandic} (chz) -> ${value.english} (en)`, link: value.link})
		}
	}
	return results;
}
load()
</script>

<div class="column">
		<img id="logo" src="favicon.png" alt="" />
	<div class="row">
		<h1>Cheeselandic Dictionary</h1>
		<Search onPreview={preview}/>
		
	</div>
</div>

<style>
#logo {
	max-width:300px;
	flex-shrink: 144;
}
.column {
	display: flex;flex-wrap: wrap;
	flex-direction: row;
	width: 100%;
	/* height: 100%; */
	align-items: center;
	justify-content: center;
	
}
.row {
	display: flex;
	align-items: stretch;
	flex-direction: column;
	justify-content: center;
}
</style>

