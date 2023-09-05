// Global variables ;)
let valuesList = [];
let value = "";
let selected = 0;
let searchResults = [];

let searchContainer;
let hintsContainer;
let input;

addEventListener("DOMContentLoaded", () => {
	searchContainer = document.getElementById("search-container");
	hintsContainer = document.getElementById("hints-container");
	input = document.getElementById("search-input");
	document.getElementById("submit-button").onclick = submit;
	input.onkeydown = keyPress;
	input.oninput = processInput;
});


async function loadFromGoogleSheets() {
	const spreadsheet = "1dbhdgr5Ww1f4of3AfJwBvDMe2zQM6l4_5Z9BVoOJNF8";
	const key = "AIzaSyCEtrGstZkKNC6w7fTm6V6B4Av0F2wwNys";

	const range = "Sheet1";
	const values = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet}/values/${range}?key=${key}`)
	const valuesJson = await values.json();
	// Get the first row (should be 1)
	let currentRow = Number(valuesJson.range.split("!")[1].split(":")[0].replace(/\D/g, "")) || 1;

	valuesList = valuesJson.values.map((values) => {
		// Add one to the row (before filtering)
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

loadFromGoogleSheets();

// State of the art search algorithm
function processSearch(term){
	if (!term.length) {
		return []
	}

	let results = [];
	for (let index in valuesList){
		const value = valuesList[index];
		if (value.english.toLowerCase().includes(term.toLowerCase())){
			results.push({text:`${value.english} (en) -> ${value.cheeselandic} (chz)`, link: value.link})
		}
	}
	for (let index in valuesList){
		const value = valuesList[index];
		if (value.cheeselandic.toLowerCase().includes(term.toLowerCase())){
			results.push({text:`${value.cheeselandic} (chz) -> ${value.english} (en)`, link: value.link})
		}
	}
	for (let index in valuesList){
		const value = valuesList[index];
		if (value.alternatives.find((alternative) => alternative.toLowerCase().includes(term.toLowerCase()))){
			results.push({text:`${value.cheeselandic} (chz) -> ${value.english} (en)`, link: value.link})
		}
	}
	return results;
}

// When the input event is called on the search bar, update the search hints
function processInput(e) {
	value = e.target.value;

	searchResults = processSearch(value) || [];

	if (searchResults.length > 0) {
		searchContainer.classList.add("expanded");
	} else {
		searchContainer.classList.remove("expanded");
	}

	// Hyper efficiant dom manipulations
	hintsContainer.innerHTML = '';
	searchResults.forEach(element => {
		hintsContainer.innerHTML += `<li><a href=${element.link}>${element.text}</a></li>`;
	});

	selected = 0;
	updateSelected();
}

// Make the selected class only apply to the right result
function updateSelected() {
	let childNodes = hintsContainer.childNodes;
	for (let x = 0; x < childNodes.length; x++) {
		if (x == selected)
			childNodes[x].classList.add("selected");
		else
		childNodes[x].classList.remove("selected");
	}
}

// Go to a link!
async function submit() {
	const value = searchResults[selected]?.link;
	if (value) {
		window.location.href = value;
	}
}

// The key has been pressed!
async function keyPress(event){
	console.info(event.key);

	if (event.key == "ArrowUp"){
		event.preventDefault();
		selected -= 1;
		if (selected < 0)
			selected += searchResults.length;
		updateSelected()
	}

	if (event.key == "ArrowDown"){
		event.preventDefault();
		selected += 1;
		selected %= searchResults.length;
		if (selected >= searchResults.length)
			selected -= searchResults.length;
		updateSelected()
	}

	if (event.key == "Enter" || event.key == "Return"){
		submit();
	}
}
