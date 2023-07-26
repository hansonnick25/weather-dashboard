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
      let cityName = response.name
      let today = new Date()
      let day = String(today.getDate()).padStart(2, '0')
      let month = String(today.getMonth() + 1).padStart(2, '0')
      let year = today.getFullYear()
      let currentDate = `${year}-${month}-${day}`
      let currentTemp = response.main.temp
      let weatherIcon = response.weather[0].icon
      let weatherIconDescription = response.weather[0].main
      let iconurl = 'http://openweathermap.org/img/w/' + weatherIcon + '.png'
      let currentHumidity = response.main.humidity
      let currentWindSpeed = response.wind.speed

      $('#icon')
        .text(weatherIconDescription)
        .append(`<img src=${iconurl} alt=${weatherIconDescription}>`)
      $('#city-name').text(cityName)
      $('#date').text(currentDate)
      $('#current-temp').text(`${currentTemp}℉`)
      $('#current-humidity').text(`${currentHumidity}% humidity`)
      $('#current-wind').text(`Wind Speed: ${currentWindSpeed} mph`)

      recentSearches(cityName)
      fiveDayForecast(cityName)
    })

    .fail(function (response) {
      alert(`Error: ${response.responseJSON.message}.`)
    })
}

fiveDayForecast = cityName => {
  $.ajax({
    async: true,
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`,
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
        let weatherIconDescription = response.list[i].weather[0].main
        let weatherIcon = response.list[i].weather[0].icon
        let iconurl = 'http://openweathermap.org/img/w/' + weatherIcon + '.png'
        let currentTemp = response.list[i].main.temp
        let currentHumidity = response.list[i].main.humidity
        let currentWindSpeed = response.list[i].wind.speed
        $(`#date-${[i]}`).text(dates[i])
        $(`#icon-${[i]}`)
          .text(weatherIconDescription)
          .append(`<img src=${iconurl} alt=${weatherIconDescription}>`)
        $(`#forecast-temp-${[i]}`).text(`${currentTemp}℉`)
        $(`#forecast-humidity-${[i]}`).text(`${currentHumidity}% humidity`)
        $(`#forecast-wind-${[i]}`).text(`Wind Speed: ${currentWindSpeed} mph`)
      }
    })

    .fail(function (response) {
      alert(`Error: ${response.responseJSON.message}.`)
    })
}

recentSearches = cityName => {
  $('#recent-searches-card').removeClass('hidden')
  $('#recent-searches-list').append(
    `<li class="list-group-item">${cityName}</li>`
  )
}

// const recentSearches = function (cityName) {
//   $('#recent-searches-card').removeClass('hidden')
//   $('#recent-searches-list').append(
//     `<li class="list-group-item">${cityName}</li>`
//   )
// }

$('#searchButton').on('click', currentForecast)
