let apiKey = '8eee76fe0c7536fe5dfad9a4df7257ab'
let dates = []
let descriptions = []
let icons = []
let temps = []
let humidities = []
let windSpeeds = []
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []

currentForecast = () => {
  let city = $('#searchInput').val()

  $.ajax({
    async: true,
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`,
    method: 'GET',
    headers: {},
  })

    .done(response => {
      let today = new Date()
      let currentDay = String(today.getDate()).padStart(2, '0')
      let currentMonth = String(today.getMonth() + 1).padStart(2, '0')
      let currentYear = today.getFullYear()
      let currentDate = `${currentYear}-${currentMonth}-${currentDay}`
      let currentTemp = Math.round(response.main.temp)
      let currentWeatherIcon = response.weather[0].icon
      let currentWeatherIconDescription = response.weather[0].main
      let currentIconUrl = `http://openweathermap.org/img/w/${currentWeatherIcon}.png`
      let currentHumidity = response.main.humidity
      let currentWindSpeed = response.wind.speed

      $('#icon')
        .text(currentWeatherIconDescription)
        .append(
          `<img src=${currentIconUrl} alt=${currentWeatherIconDescription}>`
        )
      $('#city-name').text(city)
      $('#date').text(currentDate)
      $('#current-temp').text(`${currentTemp}℉`)
      $('#current-humidity').text(`${currentHumidity}% humidity`)
      $('#current-wind').text(`Wind Speed: ${currentWindSpeed} mph`)

      recentSearches(city)
      fiveDayForecast(city)
    })

    .fail(response => {
      alert(`Error: ${response.responseJSON.message}.`)
    })
}

fiveDayForecast = city => {
  $.ajax({
    async: true,
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`,
    method: 'GET',
    headers: {},
  })

    .done(response => {
      $('#five-day-forecast').removeClass('hidden')
      $('#five-day-forecast-container').removeClass('hidden')

      $(response.list).each(index => {
        let date = response.list[index].dt_txt
        if (date.includes('09:00:00')) {
          calendarDate = date.substr(0, 10) // remove time from date
          dates.push(calendarDate)
          descriptions.push(response.list[index].weather[0].main)
          icons.push(response.list[index].weather[0].icon)
          temps.push(Math.round(response.list[index].main.temp))
          humidities.push(response.list[index].main.humidity)
          windSpeeds.push(response.list[index].wind.speed)
        }
      })

      for (let i = 0; i < 5; i++) {
        let forecastWeatherIconDescription = descriptions[i]
        let forecastWeatherIcon = icons[i]
        let forecastIconUrl = `http://openweathermap.org/img/w/${forecastWeatherIcon}.png`
        let forecastTemp = temps[i]
        let forecastHumidity = humidities[i]
        let forecastWindSpeed = windSpeeds[i]
        $(`#date-${[i]}`).text(dates[i])
        $(`#icon-${[i]}`)
          .text(forecastWeatherIconDescription)
          .append(
            `<img src=${forecastIconUrl} alt=${forecastWeatherIconDescription}>`
          )
        $(`#forecast-temp-${[i]}`).text(`${forecastTemp}℉`)
        $(`#forecast-humidity-${[i]}`).text(`${forecastHumidity}% humidity`)
        $(`#forecast-wind-${[i]}`).text(`Wind Speed: ${forecastWindSpeed} mph`)
      }
    })

    .fail(response => {
      alert(`Error: ${response.responseJSON.message}`)
    })
}

recentSearches = city => {
  $('#recent-searches-card').removeClass('hidden')
  $('#recent-searches-list').append(`<button
              type="button"
              class="btn btn-dark btn-lg btn-block recent-search-button"
            > ${city}
            </button>`)
}

$('#searchButton').on('click', function () {
  currentForecast()
  fiveDayForecast()
})
$('#searchInput').on('keypress', function (e) {
  if (e.which == 13) {
    currentForecast()
  }
})
