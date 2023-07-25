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

$('#searchButton').on('click', function () {
  let city = $('#searchInput').val()
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&limit=1&appid=${apiKey}&units=imperial`
  )
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data)
      let cityName = data.name
      let date = data.dt * 1000 // convert to milliseconds
      let convertedDate = new Date(date).toLocaleDateString('en-US')
      let currentTemp = data.main.temp
      let weatherIcon = data.weather[0].icon
      let weatherIconDescription = data.weather[0].main
      let iconurl = 'http://openweathermap.org/img/w/' + weatherIcon + '.png'
      let currentHumidity = data.main.humidity
      let currentWindSpeed = data.wind.speed

      $('#icon')
        .text(weatherIconDescription)
        .append(`<img src=${iconurl} alt=${weatherIconDescription}>`)
      $('#city-name').text(cityName)
      $('#date').text(convertedDate)
      $('#current-temp').text(`${currentTemp}℉`)
      $('#current-humidity').text(`${currentHumidity}% humidity`)
      $('#current-wind').text(`currentWindSpeed: ${currentWindSpeed}`)
    })
})
