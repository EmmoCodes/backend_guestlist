import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import multer from 'multer'
import { body, validationResult } from 'express-validator'

const PORT = 9898
const app = express()

app.use(cors())
app.use(express.json())

const upload = multer()

let guestComments = []
const historyPath = new URL('./public/history.json', import.meta.url)

app.post(
  '/api/comments',
  upload.none(),
  body('firstname').notEmpty(),
  body('lastname').notEmpty(),
  body('email').notEmpty(),
  body('message').notEmpty(),
  (req, res) => {
    const result = validationResult(req)
    if (result.errors.length > 0) {
      res.status(401).end()
      return
    }
    const comment = req.body

    guestComments.push(comment)
    fs.writeFile(historyPath, JSON.stringify(guestComments, null, 2), { encoding: 'utf-8' })
    res.end()
  },
)

app.get('/api/comments', async (_, res) => {
  if (existsSync(historyPath)) {
    await fs
      .readFile(historyPath, { encoding: 'utf-8' })
      .then(response => JSON.parse(response))
      .then(data => (guestComments = data))
  }
  res.json(guestComments)
})

app.listen(PORT, () => console.log('Iam on:', PORT))
