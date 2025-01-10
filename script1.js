let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
let weatherContainer = document.querySelector("#weather");
let weatherInfo = document.querySelector("#weather-info");
let detailedWeather = document.querySelector("#detailed-weather-info");

let recognitionInProgress = false; // A flag to track if recognition is in progress

// Function to speak text
function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;

    // Fetch available voices
    let voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => voice.gender === "female");

    // Use the selected voice or fallback to the first available voice
    text_speak.voice = selectedVoice || voices[0];

    window.speechSynthesis.speak(text_speak);
}

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

// On result of speech recognition
recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

// When speech recognition ends
recognition.onend = () => {
    recognitionInProgress = false; // Reset the flag when recognition ends
    voice.style.display = "none";  // Hide the voice icon when recognition is done
    btn.style.display = "flex";    // Show the button again after recognition ends
};

// When button is clicked to start recognition
btn.addEventListener("click", () => {
    if (!recognitionInProgress) {
        recognitionInProgress = true; // Prevent further clicks during recognition
        recognition.start();
        voice.style.display = "block";
        btn.style.display = "none";  // Hide the button while recognition is in progress
    }
});

// Function to process the command based on message input
function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";  // Keep the button visible after processing the command

    // Greeting
    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello Sir, What can I help you with?");
    } 
    // Assistant info
    else if (message.includes("who are you")) {
        speak("I am a virtual assistant, created by Mikhil Sai.");
    } 
    // Open YouTube
    else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } 
    // Open Google
    else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com/", "_blank");
    } 
    // Open Facebook
    else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://facebook.com/", "_blank");
    } 
    // Open Instagram
    else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    } 
    // Open Calculator
    else if (message.includes("open calculator")) {
        speak("Opening Calculator...");
        window.open("calculator://");
    } 
    // Open WhatsApp
    else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("https://web.whatsapp.com/");
    }
    else if (message.includes("open chatgpt")) {
        speak("Opening Chat GPT...");
        window.open("https://chat.openai.com/");
    } 
    // Get time
    else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(time);
    } 
    // Get date
    else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(date);
    } 
    // Weather info
    else if (message.includes("weather")) {
        fetchWeather();
    } 
    // Reminder functionality
    else if (message.includes("reminder")) {
        speak("What should I remind you about?");
        // Wait for additional input to set the reminder
    } 
    // Play music
    else if (message.includes("play music")) {
        speak("Playing music...");
        window.open("https://www.youtube.com/results?search_query=relaxing+music", "_blank");
    } 
    // Calculator functionality
    else if (message.includes("calculate")) {
        let expression = message.replace("calculate", "").trim();
        try {
            let result = eval(expression);  // Caution: eval can be dangerous in production code
            speak(`The result is ${result}`);
        } catch (error) {
            speak("Sorry, I couldn't calculate that.");
        }
    }
    else if (message.includes("light mode")) {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";
        speak("Light mode activated.");
    } else if (message.includes("dark mode")) {
        document.body.style.backgroundColor = "black";
        document.body.style.color = "white";
        speak("Dark mode activated.");
    }
    else if (message.includes("increase brightness")) {
        document.body.style.filter = "brightness(120%)";
        speak("Brightness increased.");
    } else if (message.includes("decrease brightness")) {
        document.body.style.filter = "brightness(80%)";
        speak("Brightness decreased.");
    }
    else if (message.includes("generate password")) {
        let password = Math.random().toString(36).slice(-8);
        speak(`Your random password is ${password}`);
    }
    else if (message.includes("horoscope")) {
        fetch("https://aztro.sameerkumar.website?sign=aries&day=today", { method: "POST" })
            .then(response => response.json())
            .then(data => {
                speak(`Your horoscope for today is: ${data.description}`);
            })
            .catch(err => speak("Sorry, I couldn't fetch your horoscope."));
    }
    else if (message.includes("nearest restaurant")) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=1000&type=restaurant&key=97c78979b82a50a5563a0578e6c832a0`)
                .then(response => response.json())
                .then(data => {
                    let nearest = data.results[0].name;
                    speak(`The nearest restaurant is ${nearest}.`);
                })
                .catch(err => speak("Sorry, I couldn't find any nearby restaurants."));
        });
    }
    // Jokes functionality
    else if (message.includes("tell me a joke")) {
        let jokes = [
            "Why don't skeletons fight each other? They don't have the guts.",
            "What do you call fake spaghetti? An impasta.",
            "Why don't programmers like nature? It has too many bugs."
        ];
        let randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(randomJoke);
    } 
    // Wikipedia search
    else if (message.includes("search for")) {
        let query = message.replace("search for", "").trim();
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`)
            .then(response => response.json())
            .then(data => {
                let summary = data.extract;
                speak(summary);
            })
            .catch(error => {
                speak("Sorry, I couldn't find any information on that.");
            });
    } 
    // Currency conversion
    else if (message.includes("convert currency")) {
        let amount = parseFloat(message.match(/\d+/)[0]);
        let fromCurrency = message.match(/from (\w+)/)[1].toUpperCase();
        let toCurrency = message.match(/to (\w+)/)[1].toUpperCase();
        
        fetch(`https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/${fromCurrency}`)
            .then(response => response.json())
            .then(data => {
                let conversionRate = data.conversion_rates[toCurrency];
                let result = amount * conversionRate;
                speak(`${amount} ${fromCurrency} is equal to ${result.toFixed(2)} ${toCurrency}`);
            })
            .catch(err => {
                speak("Sorry, I couldn't fetch the conversion rate.");
            });
    } 
    // Fetch news headlines
    else if (message.includes("news")) {
        fetchNews();
    } 
    // Handle unknown commands
    else {
        let finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
        window.open(`https://www.google.com/search?q=${message}`, "_blank");
    }

    recognitionInProgress = false;  // Reset the flag when recognition is finished
    voice.style.display = "none";    // Optionally hide the voice icon after completing the task
}

// Fetch weather details
function fetchWeather() {
    // Get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            
            const apiKey = "97c78979b82a50a5563a0578e6c832a0";  // Use your OpenWeatherMap API key here
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    const weather = `The weather in your location is ${data.weather[0].description} with a temperature of ${(data.main.temp - 273.15).toFixed(2)}°C.`;
                    speak(weather);

                    // Display weather data
                    weatherContainer.style.display = "block"; // Show weather container
                    weatherInfo.innerText = weather; // Display summary of weather
                    document.getElementById("temperature").innerText = `Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C`;
                    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
                    document.getElementById("precipitation").innerText = `Precipitation: ${data.weather[0].main}`;
                    document.getElementById("wind").innerText = `Wind: ${data.wind.speed} m/s`;
                })
                .catch(err => {
                    speak("Sorry, I couldn't fetch the weather information.");
                });
        }, (error) => {
            speak("Sorry, I couldn't retrieve your location.");
        });
    } else {
        speak("Geolocation is not supported by your browser.");
    }
}

function fetchNews() {
    const apiKey = "40e5f487c9504b768c1883a6dd9beb11"; // Replace with a valid News API key
    fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const headlines = data.articles.slice(0, 5).map(article => article.title).join(', ');
            speak(`Here are the top news headlines: ${headlines}`);
        })
        .catch(err => {
            speak("Sorry, I couldn't fetch the news.");
        });
}