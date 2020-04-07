const request = require("request")

const forecast = (lattitude, longitude, callback) => {
	const url =
		"https://api.darksky.net/forecast/ba6342eed929ad56765b492147d9dfb5/" +
		lattitude +
		"," +
		longitude

	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback("Unable to connect to weather service.", undefined)
		} else if (error) {
			callback("Unable to find location.", undefined)
		} else {
			const temperature = body.currently.temperature
			const chanceRain = body.currently.precipProbability
			const summary = body.daily.data[0].summary

			callback(
				undefined,
				summary +
					" It is currently " +
					temperature +
					" degrees out. There is a " +
					chanceRain +
					"% chance of rain."
			)
		}
	})
}

module.exports = forecast
