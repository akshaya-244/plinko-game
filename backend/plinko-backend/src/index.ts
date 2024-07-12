import { Hono } from 'hono'
import { gameRouter } from './routes/game'
import { usersRouter } from './routes/users'
import { cors } from 'hono/cors'
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }

}>()

// CORS middleware
app.use('/*', cors())

app.route('/api/user', usersRouter)
app.route('/api/game',gameRouter);



export default app
