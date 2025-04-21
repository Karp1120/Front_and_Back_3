const express = require('express');
const fs = require('fs');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const PORT = 8080;

const productsPath = path.join(__dirname, '../data/products.json');

const loadProducts = () => {
  const data = fs.readFileSync(productsPath, 'utf8');
  return JSON.parse(data);
};

const schema = buildSchema(`
  type Product {
    id: Int
    name: String
    price: Int
    description: String
    categories: [String]
  }

  type Query {
    products: [Product]
    productNames: [String]
    productsShort: [Product]
  }
`);


const root = {
  products: () => loadProducts(),
  productNames: () => loadProducts().map(p => p.name),
  productsShort: () => loadProducts().map(({ name, price }) => ({ name, price }))
};

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true, 
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`User frontend + GraphQL сервер запущен: http://localhost:${PORT}`);
  console.log(`GraphQL Playground: http://localhost:${PORT}/graphql`);
});
