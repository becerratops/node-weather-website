const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require("./utils/geocode.js")
const forecast = require("./utils/forecast.js")

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine, views location, and partials location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
// we'll look at this later
app.use(express.static(publicDirectoryPath))

// reuse
const name = 'Adam Becerra'

// index.hbs
app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather',
		name: 'Adam Becerra',
	})
})
// about.hbs
app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name,
	})
})
// help.hbs
app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Need help?',
		name,
		message: "You've come to the right place.",
	})
})

// app.com/weather
app.get('/weather', (req, res) => {
	
	const address = req.query.address
	
	if (!address) {
		return res.send({
			error: 'You must provide an address.'
		})
	}
	geocode(address, (error, { latitude, longitude, location } = {}) => {
		if (error) {
			return res.send({ error })
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error })
			}

			res.send({
				forecast: forecastData,
				location,
				address,
			})
		})
	})
})

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term.'
		})
	}
	
	console.log(req.query.search)
	res.send({
		products: []
	})
})

// catch all for help 404 errors
app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name,
		error: 'Help article not found',
	})
})

// 404, must come last
app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name,
		error: 'Page not found.',
	})
})

app.listen(3000, () => {
	console.log('Server is up on port 3000.')
})
