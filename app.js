import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'

const PORT = 9898
const app = express()

app.use(cors())
app.use(express.json())

const guestComments = []
const historyPath = new URL('./public/history.json', import.meta.url)

app.post('/api/comments', (req, res) => {
  const comment = req.body
  console.log(comment)
  guestComments.push(comment)
  fs.writeFile(historyPath, JSON.stringify(guestComments) + '\n', { encoding: 'utf-8' })
  res.end()
})

app.get('/api/comments', (_, res) => {
  res.json(guestComments)
})

app.listen(PORT, () => console.log('Iam on:', PORT))
