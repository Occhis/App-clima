// script.js
const apiKey = '1e9f28443d4acd8b0b5d9a8c52aef00a';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const cityTitle = document.getElementById('cityTitle');
    const tempElement = document.querySelector('.temp');
    const descriptionElement = document.querySelector('.description');
    const weatherIcon = document.querySelector('.datosclima .icono-clima');
    
    // Ejemplo: buscar una ciudad por defecto al cargar
    fetchWeather('Merlo,AR');
    
    // Evento para buscar al presionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            fetchWeather(searchInput.value);
        }
    });
});

function fetchWeather(city) {
    // URL para clima actual (métrico para Celsius)
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=es`;
    
    fetch(apiUrl)
        .then(response => {
            if(!response.ok) throw new Error('Ciudad no encontrada');
            return response.json();
        })
        .then(data => {
            updateWeatherUI(data);
        })
        .catch(error => {
            alert(error.message);
            console.error('Error:', error);
        });
}

function updateWeatherUI(data) {
    document.getElementById('cityTitle').textContent = `${data.name}, ${data.sys.country}`;
    document.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.description').textContent = data.weather[0].description;

    // Solo actualiza los valores, no los labels
    document.querySelector('.valor-sensacion').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.querySelector('.valor-humedad').textContent = `${data.main.humidity}%`;
    document.querySelector('.valor-presion').textContent = `${data.main.pressure}`;
}
let cities = [];

fetch('data/city.list.json')
    .then(res => res.json())
    .then(data => {
        cities = data;
    });

const searchInput = document.querySelector('.search-bar input');
const suggestionsList = document.getElementById('suggestions');

searchInput.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    if (query.length < 3) {
        suggestionsList.innerHTML = '';
        return;
    }
    // Filtra las ciudades que empiezan con el texto ingresado
    const matches = cities.filter(city =>
        city.name.toLowerCase().startsWith(query)
    ).slice(0, 5); // Solo muestra 5 sugerencias

    suggestionsList.innerHTML = '';
    matches.forEach(city => {
        const li = document.createElement('li');
        li.textContent = `${city.name}, ${city.country}`;
        li.addEventListener('click', () => {
            searchInput.value = `${city.name},${city.country}`;
            suggestionsList.innerHTML = '';
            fetchWeather(searchInput.value);
        });
        suggestionsList.appendChild(li);
    });
});