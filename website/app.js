/* Global Variables */

// The URL root if user searches by zip code
const API_ROOT = 'http://api.openweathermap.org/data/2.5/weather?zip=';

// The URL for units parameter
const API_UNITS = '&units=metric';

// The URL for api key parameter
const API_KEY = `&appid=9923883d921a94a6c54b3d682d380493`;

// Locate Zip input
const zipInput = document.getElementById('zip');

// Find the Generate button and add the listener event
const goButton = document.getElementById('generate');
goButton.addEventListener('click', clickRespond);

// Main function of the program
// Grabs the user's input, creates URL, calls API, POSTS, updates UI
function clickRespond() {

    // Grabs user's input
    const zip = zipInput.value;
    const feelingsInput = document.getElementById('feelings');

    // Forms URL
    let url = API_ROOT + zip + API_UNITS + API_KEY;

    // Call the API
    getWeather(url)

        // Prepares data and calls the POST
        .then(function (weatherData) {
                const icon = weatherData.weather[0].icon;
                const date = dateTime();
                const temperature = weatherData.main.temp.toFixed(0);
                const feelings = feelingsInput.value;
                postJournal('/add', { icon, date, temperature, feelings });
                // Updates app with the latest journal entry
                updateUI();
        });
}

// Async function calls the API, converts to JSON
async function getWeather(url) {
    const response = await fetch(url);
    const weatherData = await response.json();
    return weatherData;
}

// POSTs the feelings and journal data (icon, date/time, temperature, feelings)
async function postJournal(url, data) {
    await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },   
        body: JSON.stringify(data)
    });
}

// Updates the DOM
async function updateUI() {
    const response = await fetch('/retrieve');
    const latestEntry = await response.json();
    document.getElementById('title').innerHTML = `This is how you're feeling:`;
    document.getElementById('icon').innerHTML = `<img class="icon" src="http://openweathermap.org/img/wn/${latestEntry.icon}@2x.png" alt="Weather icon">`
    document.getElementById('date').innerHTML = `Today is ${latestEntry.date}`;
    document.getElementById('temp').innerHTML = `It's currently ${latestEntry.temperature}°C in ${zipInput.value}`;
    document.getElementById('content').innerHTML = `Feelings: ${latestEntry.feelings}`;
}

// Gets the user's date and time
// returns date and time in string
function dateTime() {
    const d = new Date();
    let minutes = d.getMinutes();
    if (d.getMinutes() <= 9) {
        minutes = `0${minutes}`;
    }
    const date = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()} at time ${d.getHours()}:${minutes}`;
    return date;
}