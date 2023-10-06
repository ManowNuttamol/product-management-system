const express = require("express");
const products = require("./db.json");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const app = express();
const port = 5000;

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/products", (req, res) => {
  /* #swagger.tags = ['Product']
   #swagger.description = 'Show all product information' */

  /* #swagger.responses[200] = { 
    schema: { $ref: "#/definitions/Products" },
    description: 'Product information' 
  } */

  res.status(200).json(products);
  /* #swagger.responses[404] = { 
    description: 'Product not found' 
  } */
});

app.get("/products/:id", (req, res) => {
  /* #swagger.tags = ['Product']
   #swagger.description = 'Show product information' */

  const product = products.find(product => product.id === parseInt(req.params.id));
  
  if(!product) return res.status(404).send("Product not found");
  
  /* #swagger.responses[200] = { 
    schema: { $ref: "#/definitions/Products" },
    description: 'Product information' 
  } */

  res.status(200).json(product);
  /* #swagger.responses[404] = { 
    description: 'Product not found' 
  } */
})

app.post("/products", (req, res) => {
  /* #swagger.tags = ['Product']
    #swagger.description = 'Add product information to the system' */

  /* #swagger.parameters['newProduct'] = {
    in: 'body',
    description: 'New product information',
    required: true,
    schema: { $ref: "#/definitions/AddProduct" }
  }
  */

  if(!req.body.name && !req.body.category && !req.body.price && !req.body.stock) {
    res.status(500).send("Please fill in the product information");
  }
  else {
    if(!req.body.name) {
      req.body.name = null;
    }
    if(!req.body.category) {
      req.body.category = null;
    }

    const newProduct = {
      id: products.length + 1,
      name: req.body.name,
      category: req.body.category,
      price: parseInt(req.body.price),
      stock: parseInt(req.body.stock)
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  }
  // #swagger.responses[500]
});

app.put("/products/:id", (req, res) => {
  /* #swagger.tags = ['Product']
   #swagger.description = 'Update product information in the system' */

  /* #swagger.parameters['id'] = { in: 'path', description: 'Product id to be updated' } */

  const product = products.find(
    product => product.id === parseInt(req.params.id)
  );

  if(!product) return res.status(404).send("Product not found");

  if(req.body.name) {
    product.name = req.body.name;
  }
  if(req.body.category) {
    product.category = req.body.category;
  }
  if(req.body.price) {
    product.price = req.body.price;
  }
  if(req.body.stock) {
    product.stock = req.body.stock;
  }

  /* #swagger.parameters['editProduct'] = { 
    in: 'body',
    description: 'Edit product information',
    schema: { $ref: "#/definitions/AddProduct" }
  } */

  res.json(Object.assign(products[(product.id) - 1], product));
  /* #swagger.responses[404] = { 
    description: 'Product not found' 
  } */
});

app.delete("/products/:id", (req, res) => {
  /* #swagger.tags = ['Product']
    #swagger.description = 'Delete product information from the system' */

  /* #swagger.parameters['id'] = { in: 'path', description: 'Product id to be deleted' } */

  const deleteIndex = products.findIndex(
    product => product.id === parseInt(req.params.id)
  );

  if(deleteIndex === -1) return res.status(404).send("Product not found");

  products.splice(deleteIndex, 1);
  res.status(204).send();
  /* #swagger.responses[404]= { 
    description: 'Product not found' 
  } */
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
