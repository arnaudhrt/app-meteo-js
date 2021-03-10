
// Keys API
const keyApiWeather = '4e8ba8cfa821fbf4e5ebe847a668499b'
const keyApiMap = 'ec63c7ca667b9ce45c01c6a75a84709d'
let resultApiWeather
let resultApiMap

// DOM Elements
const state = document.querySelector('.state')
const degree = document.querySelector('.degree')
const city = document.querySelector('.city')
const country = document.querySelector('.country')
const continent = document.querySelector('.continent')
const humidity = document.querySelector('.humidity')
const wind = document.querySelector('.wind')
const cloud = document.querySelector('.cloud')
const inputCity = document.querySelector('.find input')
const submitCity = document.querySelector('.find')
const iconLeft = document.querySelector('.box-img img')
const bg = document.querySelector('#bg')
let valueInputCity = 'Paris'

// Day week section
const dayDiv = document.querySelectorAll('.days p')
const tempP = document.querySelectorAll('.days-tempeture p')
const tempDiv = document.querySelectorAll('.temp-max')
const firstIcon = document.querySelector('.first-icon img')
const restIcon = document.querySelectorAll('.rest-icon img')
const dayWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
let today = new Date()
let option = {weekday: 'long'}
let todayDay = today.toLocaleDateString('en-EN', option)
todayDay = todayDay.charAt(0).toUpperCase() + todayDay.slice(1)
let orderedArr = dayWeek.slice(dayWeek.indexOf(todayDay)).concat(dayWeek.slice(0, dayWeek.indexOf(todayDay)))

// First call API
callApiMap();

//Call every 10 minutes
setInterval(callApiMap, 600000);

// Call API when new city
submitCity.addEventListener('submit', (e) => {
    e.preventDefault();
    valueInputCity = inputCity.value ; 
    callApiMap();
})

// Function call API to convert city in coords
function callApiMap () {
    fetch(`http://api.positionstack.com/v1/forward?access_key=${keyApiMap}&query=${valueInputCity}`)
    .then((answer) => {
        return answer.json();
    })
    .then((data) => {

        resultApiMap = data;
        //console.log(resultApiMap);
        long = resultApiMap.data[0].longitude;
        lat = resultApiMap.data[0].latitude;
        city.innerText = resultApiMap.data[0].name;
        country.innerText = `${resultApiMap.data[0].country} - ${resultApiMap.data[0].continent}`;
        callApiWeather(long,lat);

    })
}

// Function call API to get weather info
function callApiWeather (long, lat) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&appid=${keyApiWeather}`)
    .then((answer) => {
        return answer.json();
    })
    .then((data) => {

        resultApiWeather = data
        //console.log(resultApiWeather)
        state.innerText = resultApiWeather.current.weather[0].main
        degree.innerText = `${Math.trunc(resultApiWeather.current.temp)}°`
        humidity.innerText = `${resultApiWeather.current.humidity}%`
        wind.innerText = `${Math.trunc(resultApiWeather.current.wind_speed * 3.6)}km/h`
        cloud.innerText = `${resultApiWeather.current.clouds}%`
        iconLeft.src = `ressources/icon/${resultApiWeather.current.weather[0].main}.svg`
        bg.style.backgroundImage = `url(ressources/bg/${resultApiWeather.current.weather[0].main}.jpg)`
        firstIcon.src = `ressources/icon/${resultApiWeather.daily[0].weather[0].main}.svg`
        
        // Display ordered days 
        for(let i = 0; i < 7; i++) {
            dayDiv[i].innerText = orderedArr[i];
            dayDiv[0].innerText = 'Today'
            dayDiv[1].innerText = 'Tomorrow'
        }

        // Display tempeture
        for(let i = 0; i < 7; i++) {
            let min = Math.trunc(resultApiWeather.daily[i].temp.min)
            let max = Math.trunc(resultApiWeather.daily[i].temp.max)
            tempP[i].innerText = `${min}/`
            tempDiv[i].innerText = `${max}`
        }
        console.log(restIcon);
        // Display icons grey
        for(let i = 0; i < 6; i++) {
            let iconGrey = resultApiWeather.daily[i+1].weather[0].main
            console.log(i);
            restIcon[i].src = `ressources/icon/${iconGrey}-grey.svg`
        }
        
    })
}

