

let oneCallUrl
let oneCallData
let historyContent
let contentArea = $('#content-area')
let searchInput = $('#search-input')
let todayContent = $('#today-content')
let currentUrl
let searchHistoryArea = $('#search-history')

$('#submit-button').click(function (event) {
    event.preventDefault()
    // console.log('submit button clicked')
    todayContent.text('')
    contentArea.text('')
    getCity()  

    console.log(currentUrl)
 
})

searchHistoryArea.on('click', '.history-button', function(event) {
    // console.log('submit button clicked')
    document.getElementById("search-input").value = $(this).text()
    todayContent.text('')
    contentArea.text('')
    getCity()
    console.log('clicked ', currentUrl)
    
 
})

function getCity() {
    currentUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + $('#search-input').val() + "&appid=abb217f1783beff98446899f849fdebe&units=imperial"

    fetch(currentUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.city.coord.lat + "&lon=" + data.city.coord.lon + "&appid=abb217f1783beff98446899f849fdebe&units=imperial"
            console.log(oneCallUrl)

            fetch(oneCallUrl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    console.log(data)
                    
                    
                    let cityCapitalized = capitalize($('#search-input').val())
                    let today = moment().format('MMMM Do YYYY')
                    let todayTemp = data.current.temp
                    let todayWind = data.current.wind_speed
                    let todayHumidity = data.current.humidity
                    let todayUvi = data.current.uvi
                    let historyStorage = []

                    let todayObject = $('<p>')
                    let todayTempObject = $('<p>')
                    let todayWindObject = $('<p>')
                    let todayHumidityObject = $('<p>')
                    let todayUviObject = $('<p>')
                    let cityObject = $('<p>')


                    if(todayUvi >= 8){
                        todayUviObject.addClass('very-high')
                    }else if(todayUvi >= 6){
                        todayUviObject.addClass('high')
                    }else if(todayUvi >= 3){
                        todayUviObject.addClass('moderate')
                    }else if(todayUvi == 0){
                        todayUviObject.addClass('low')
                    }else{
                        todayUviObject.addClass('low')
                    }

                    todayObject.text(cityCapitalized + ' (' + today + ')')
                    todayTempObject.text('Temp: ' + todayTemp + '° F')
                    todayWindObject.text('Wind: ' + todayWind + ' MPH')
                    todayHumidityObject.text('Humidity: ' + todayHumidity + '%')
                    todayUviObject.text('UVI Index: ' + todayUvi)
                    cityObject.text(cityCapitalized)
                    cityObject.addClass('history-button')

                    todayContent.append(todayObject, todayTempObject, todayWindObject, todayHumidityObject, todayUviObject)
                    searchHistoryArea.prepend(cityObject)
                    historyStorage.push(cityObject.text())
                    localStorage.setItem('searchHistory', JSON.stringify(historyStorage))
                    console.log(localStorage.getItem('searchHistory'))

                    $('#search-input').val('')

                    for(i = 0; i < 5; i++){
                        let date = moment().add(i+1, 'days').format('MMM Do YYYY')
                        let temp = data.daily[i].temp.day
                        let wind = data.daily[i].wind_speed
                        let humidity = data.daily[i].humidity
                        let uvi = data.daily[i].uvi
                        console.log(uvi)

                        let dateObject = $('<p>')
                        let tempObject = $('<p>')
                        let windObject = $('<p>')
                        let humidityObject = $('<p>')
                        let uviObject = $('<p>')
                        let dailyCard = $('<div>')

                        dateObject.text(date)
                        tempObject.text('Temp: ' + temp + '°F')
                        windObject.text('Wind: ' + wind + ' MPH')
                        humidityObject.text('Humidity: ' + humidity + '%')
                        uviObject.text('UVI Index: ' + uvi)
                        dailyCard.addClass('card')
                        dailyCard.addClass('col')

                        if(uvi >= 8){
                            uviObject.addClass('very-high')
                        }else if(uvi >= 6){
                            uviObject.addClass('high')
                        }else if(uvi >= 3){
                            uviObject.addClass('moderate')
                        }else if(uvi == 0){
                            uviObject.addClass('low')
                        }else{
                            uviObject.addClass('low')
                        }
                    
                        

                        dailyCard.append(dateObject, tempObject, windObject, humidityObject, uviObject)
                        contentArea.append(dailyCard)
                        

                }})

})}

function capitalize(word){
    let lower = word.toLowerCase()
    return word.charAt(0).toUpperCase() + lower.slice(1)
}

function fillSearchHistory(){
    // if(!historyFromStorage){
    //     console.log('no dice, bud')
    //     return
    // }else{
        let historyFromStorage = JSON.parse(localStorage.getItem('searchHistory'))
        console.log(historyFromStorage)
        for(i = 0; i < historyFromStorage.length; i++){
            let historyObject = $('<p>')
            historyObject.text(historyFromStorage[i])
            historyObject.addClass('history-button')
            searchHistoryArea.prepend(historyObject)
            console.log(historyObject)
    
    }

}

fillSearchHistory()