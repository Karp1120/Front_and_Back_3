const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const pathToHtml = path.join(__dirname, 'admin.html');

app.get('/', (req, res) => {
  res.sendFile(pathToHtml);
});

const PORT = 3000;

const productsPath = path.join(__dirname, '../data/products.json');

app.use(express.json());


app.get('/products', (req, res) => {
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Ошибка чтения данных');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});


app.post('/products', (req, res) => {
  const newProducts = req.body;

  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Ошибка чтения файла');

    let products = JSON.parse(data);

    const items = Array.isArray(newProducts) ? newProducts : [newProducts];

    
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    items.forEach((item, index) => {
      item.id = maxId + index + 1;
      products.push(item);
    });

    fs.writeFile(productsPath, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).send('Ошибка записи');
      res.send({ message: 'Товары добавлены' });
    });
  });
});

app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedProduct = req.body;

  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Ошибка чтения');

    let products = JSON.parse(data);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).send('Товар не найден');

    products[index] = { ...products[index], ...updatedProduct, id };

    fs.writeFile(productsPath, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).send('Ошибка записи');
      res.send({ message: 'Товар обновлён' });
    });
  });
});


app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Ошибка чтения');

    let products = JSON.parse(data);
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length)
      return res.status(404).send('Товар не найден');

    fs.writeFile(productsPath, JSON.stringify(filtered, null, 2), err => {
      if (err) return res.status(500).send('Ошибка записи');
      res.send({ message: 'Товар удалён' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Admin API server is running at http://localhost:${PORT}`);
});
