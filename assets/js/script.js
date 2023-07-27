// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

apiKey = '8eee76fe0c7536fe5dfad9a4df7257ab'

currentForecast = () => {
  let city = $('#searchInput').val()

  $.ajax({
    async: true,
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`,
    method: 'GET',
    headers: {},
  })

    .done(function (response) {
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

    .fail(function (response) {
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

    .done(function (response) {
      $('#five-day-forecast').removeClass('hidden')
      $('#five-day-forecast-container').removeClass('hidden')
      let dates = []
      $(response.list).each(function (index) {
        let date = response.list[index].dt_txt
        if (date.includes('12:00:00')) {
          calendarDate = date.substr(0, 10) // remove time from date
          dates.push(calendarDate)
        }
      })

      for (let i = 0; i < 5; i++) {
        let forecastWeatherIconDescription = response.list[i].weather[0].main
        let forecastWeatherIcon = response.list[i].weather[0].icon
        let forecastIconUrl = `http://openweathermap.org/img/w/${forecastWeatherIcon}.png`
        let forecastTemp = Math.round(response.list[i].main.temp)
        let forecastHumidity = response.list[i].main.humidity
        let forecastWindSpeed = response.list[i].wind.speed
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

    .fail(function (response) {
      alert(`Error: ${response.responseJSON.message}`)
    })
}

recentSearches = city => {
  $('#recent-searches-card').removeClass('hidden')
  $('#recent-searches-list').append(`<li class="list-group-item">${city}</li>`)
}

$('#searchButton').on('click', currentForecast)
$('#searchInput').on('keypress', function (e) {
  if (e.which == 13) {
    currentForecast()
  }
})
