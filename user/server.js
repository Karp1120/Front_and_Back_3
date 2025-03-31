const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

const productsPath = path.join(__dirname, '../data/products.json');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/main', (req, res) => {
    console.log("Читаем из файла:", productsPath);
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Ошибка чтения данных');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`User frontend server is running at http://localhost:${PORT}`);
});
