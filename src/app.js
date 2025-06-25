import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'

// routes
import testimonialRoutes from '../src/routes/v1/testimonials.routes.js'
import subscriptionRoutes from '../src/routes/v1/subscription.routes.js'
import userRoutes from '../src/routes/v1/user.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// logging middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// cors
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// testimonials
app.use('/api/v1/testimonials', testimonialRoutes)
app.use('/api/v1/subscriptions', subscriptionRoutes)
app.use('/api/v1/users', userRoutes)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})