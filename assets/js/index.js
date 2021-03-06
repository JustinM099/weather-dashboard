//targeting html elements and adding historyStorage as a global
let contentArea = $('#content-area')
let todayContent = $('#today-content')
let searchHistoryArea = $('#search-history')
let historyStorage = []

//submit button onclick
$('#submit-button').click(function (event) {
    event.preventDefault()
    todayContent.text('')
    contentArea.text('')
    getCity()

})

//enter key keypress
$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        todayContent.text('')
        contentArea.text('')
        getCity() 
    }
});

//search history onclick
searchHistoryArea.on('click', '.history-button', function () {
    document.getElementById("search-input").value = $(this).text()
    todayContent.text('')
    contentArea.text('')
    getCity()


})

//the heavy lifting. calls both APIs, gets data, puts it on the page.
function getCity() {
    let url = "https://api.openweathermap.org/data/2.5/forecast?q=" + $('#search-input').val() + "&appid=abb217f1783beff98446899f849fdebe&units=imperial" //gets lat & lon for city name
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else if (response.status === 404) {
                todayContent.text('Error: 404. City not found. Please try again.')
                $('#search-input').val('')
                return Promise.reject('error 404')
                
            } else {
                todayContent.text('Error. City not found. Please try again.')
                $('#search-input').val('')
                return Promise.reject('some other error: ' + response.status)
            }
        })
        .then(function (data) {

            let oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.city.coord.lat + "&lon=" + data.city.coord.lon + "&appid=abb217f1783beff98446899f849fdebe&units=imperial" //main API we use

            fetch(oneCallUrl)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else if (response.status === 404) {
                        return Promise.reject('error 404')
                    } else {
                        return Promise.reject('some other error: ' + response.status) //catching errors
                    }
                })
                .then(function (data) { //promise

                    let cityCapitalized = capitalize($('#search-input').val())
                    let today = moment().format('MMMM Do YYYY')
                    let todayTemp = data.current.temp
                    let todayWind = data.current.wind_speed
                    let todayHumidity = data.current.humidity
                    let todayUvi = data.current.uvi
                    let todayIcon = data.current.weather[0].icon //gets today's data from API


                    let todayObject = $('<h2>')
                    let todayTempObject = $('<p>')
                    let todayWindObject = $('<p>')
                    let todayHumidityObject = $('<p>')
                    let todayUviObject = $('<p>')
                    let cityObject = $('<p>')
                    let todayIconObject = $('<img>')
                    let todayCard = $('<div>') //creates elements for today's data

                    if (todayUvi >= 8) {
                        todayUviObject.addClass('very-high')
                    } else if (todayUvi >= 6) {
                        todayUviObject.addClass('high')
                    } else if (todayUvi >= 3) {
                        todayUviObject.addClass('moderate')
                    } else if (todayUvi == 0) {
                        todayUviObject.addClass('low')
                    } else {
                        todayUviObject.addClass('low') //UV colors
                    }

                    todayObject.text(cityCapitalized + ' (' + today + ')')
                    todayTempObject.text('Temp: ' + todayTemp + '?? F')
                    todayWindObject.text('Wind: ' + todayWind + ' MPH')
                    todayHumidityObject.text('Humidity: ' + todayHumidity + '%')
                    todayUviObject.text('UVI Index: ' + todayUvi)
                    todayUviObject.addClass('uvi-display')
                    cityObject.text(cityCapitalized)
                    cityObject.addClass('history-button')
                    cityObject.addClass('card')
                    $(todayIconObject).attr('src', 'https://openweathermap.org/img/wn/' + todayIcon + '.png')
                    $(todayIconObject).attr('height', '50px')
                    $(todayIconObject).attr('width', '50px')
                    todayCard.addClass('card') //puts content on elements


                    todayCard.append(todayObject, todayIconObject, todayTempObject, todayWindObject, todayHumidityObject, todayUviObject) //adds elements to page
                    todayContent.append(todayCard)
                    searchHistoryArea.prepend(cityObject)
                    historyStorage.push(cityObject.text())
                    localStorage.setItem('searchHistory', JSON.stringify(historyStorage))  //puts searches into local storage


                    $('#search-input').val('') //clears search field

                    for (i = 0; i < 5; i++) {
                        let date = moment().add(i + 1, 'days').format('MMM Do YYYY')
                        let temp = data.daily[i].temp.day
                        let wind = data.daily[i].wind_speed
                        let humidity = data.daily[i].humidity
                        let uvi = data.daily[i].uvi
                        let icon = data.daily[i].weather[0].icon //gets data for forecast

                        let dateObject = $('<h3>')
                        let tempObject = $('<p>')
                        let windObject = $('<p>')
                        let humidityObject = $('<p>')
                        let uviObject = $('<p>')
                        let dailyCard = $('<div>')
                        let iconObject = $('<img>') //creates forecast elements

                        dateObject.text(date)
                        tempObject.text('Temp: ' + temp + '??F')
                        windObject.text('Wind: ' + wind + ' MPH')
                        humidityObject.text('Humidity: ' + humidity + '%')
                        uviObject.text('UVI Index: ' + uvi)
                        dailyCard.addClass('card')
                        dailyCard.addClass('col-md')
                        dailyCard.addClass('col-xl')
                        dailyCard.addClass('col-sm-12')
                        $(iconObject).attr('src', 'https://openweathermap.org/img/wn/' + icon + '.png')
                        $(iconObject).attr('height', '50px')
                        $(iconObject).attr('width', '50px') //adds forecast element content

                        if (uvi >= 8) {
                            uviObject.addClass('very-high')
                        } else if (uvi >= 6) {
                            uviObject.addClass('high')
                        } else if (uvi >= 3) {
                            uviObject.addClass('moderate')
                        } else if (uvi == 0) {
                            uviObject.addClass('low')
                        } else {
                            uviObject.addClass('low') 
                        } //uvi colors



                        dailyCard.append(dateObject, iconObject, tempObject, windObject, humidityObject, uviObject) //puts into card
                        contentArea.append(dailyCard) //puts card on page


                    }
                })

        })
}

function capitalize(word) {
    let lower = word.toLowerCase()
    return word.charAt(0).toUpperCase() + lower.slice(1) //capitalizes city names
}

function fillSearchHistory() {
    let historyFromStorage = JSON.parse(localStorage.getItem('searchHistory'))
    for (i = 0; i < historyFromStorage.length; i++) {
        let historyObject = $('<p>')
        historyObject.text(historyFromStorage[i])
        historyObject.addClass('history-button')
        historyObject.addClass('card')
        searchHistoryArea.prepend(historyObject)//fills search history from local storage
    }
}

fillSearchHistory()

