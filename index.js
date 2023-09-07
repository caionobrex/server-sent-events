const { join } = require('path')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;

const clients = [];
const items = []

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) => response.sendFile(join(__dirname, 'index.html')));

app.get('/events', (_, response) => {
  response.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  })
  const data = `data: ${JSON.stringify(items)}\n\n`
  response.write(data)
  clients.push(response)
})

app.post('/item', (_, res) => {
  items.push({
    name: 'test',
  })
  res.json({ name: 'test' })
  return clients.forEach((client) => client.write(`data: ${JSON.stringify(items)}\n\n`))
})

app.listen(PORT, () => {
  console.log(`SSE service listening at http://localhost:${PORT}`)
})