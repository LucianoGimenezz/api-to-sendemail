import express from 'express'
import nodemailer from 'nodemailer'
import path from 'node:path'
import hbs from 'nodemailer-express-handlebars'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT ?? 3001
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/email', async (req, res) => {
    const { name, email, message } = req.body
    
    if (!name || !email) return res.status(400).json({ message: 'Missing required fields' })
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASS,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN
        }
      })
    
      const handlerBarOptions = {
        viewEngine: {
          partialsDir: path.resolve(__dirname, './views/'),
          defaultLayout: false
        },
        viewPath: path.resolve(__dirname, './views/')
      }
    
       transporter.use('compile', hbs(handlerBarOptions))
    
      const mailOptions = {
        from: 'Luciano Gimenez Portafolio',
        to: process.env.MAIL_USERNAME,
        subject: 'Contacto Portafolio',
        template: 'email',
        context: {
          name,
          email,
          message
        }
    
      }
    
     transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.error({ err })
        } else {
            console.log({ data })
        }
     })
      return res.status(201).json({ message: 'Email send' })
})



app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
})