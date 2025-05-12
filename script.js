const form = document.querySelector('form');
const resultdiv = document.querySelector('.result');

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = form[0].value.trim();
  if (word) {
    getWordInfo(word);
} else {
    resultdiv.style.display = "none";
    resultdiv.innerHTML = "<p>Please enter a word.</p>";
}
});

const getWordInfo = async (word) => {
    try {
        resultdiv.innerHTML = "Fetching Data...";
        resultdiv.style.display = "block";
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (!Array.isArray(data) || !data.length || !data[0].meanings.length) {
            throw new Error("Invalid word or no definitions found.");
        }

        const wordData = data[0];
        const meaning = wordData.meanings[0];
        const definitions = meaning.definitions[0];

        resultdiv.innerHTML = `
            <h2><strong>Word:</strong> ${wordData.word}</h2>
            <p class="partOfSpeech">${meaning.partOfSpeech || "N/A"}</p>
            <p><strong>Meaning:</strong> ${definitions.definition || "Not Found"}</p>
            <p><strong>Example:</strong> ${definitions.example || "Not Found"}</p>
        `;

        // Synonyms
        resultdiv.innerHTML += `<p><strong>Synonyms:</strong></p>`;
        if (definitions.synonyms && definitions.synonyms.length > 0) {
            resultdiv.innerHTML += `<ul>${definitions.synonyms.map(syn => `<li>${syn}</li>`).join('')}</ul>`;
        } else {
            resultdiv.innerHTML += `<span>Not Found</span>`;
        }

        // Antonyms
        resultdiv.innerHTML += `<p><strong>Antonyms:</strong></p>`;
        if (definitions.antonyms && definitions.antonyms.length > 0) {
            resultdiv.innerHTML += `<ul>${definitions.antonyms.map(ant => `<li>${ant}</li>`).join('')}</ul>`;
        } else {
            resultdiv.innerHTML += `<span>Not Found</span>`;
        }

        // Read more link
        resultdiv.innerHTML += `
            <div>
                <a href="${wordData.sourceUrls?.[0] || '#'}" target="_blank">Read More</a>
            </div>
        `;
    } catch (error) {
        resultdiv.innerHTML = `<p>Sorry, the word could not be found or an error occurred.</p>`;
        resultdiv.style.display = "block";
        console.error(error);

    }
};
