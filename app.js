const express = require('express')
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const bodyParser = require('body-parser')
const exhbs = require('express-handlebars')

const app = express()

app.use(express.json({ extended : true }))

// handlebars middlewares
app.engine('handlebars', exhbs({ defaultLayout : 'main' }))
app.set('view engine', 'handlebars')

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))

// set static folder
app.use(express.static(`${__dirname}/public`))

// route config
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey : keys.stripePublishableKey
    })
})


app.post('/charge', (req, res) => {
    const amount = 2500

    stripe.customers.create({
        email : req.body.stripeEmail,
        source : req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description : 'web Development Ebook',
        currency : 'usd',
        customer : customer.id
    }))
    .then(charge => res.render('success'))
})

// server config
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
})