const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, quality TEXT)");
});

app.post('/api/products/total', (req, res) => {
    const products = req.body.products;

    if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid input. Please provide an array of products.' });
    }

    let totalValue = 0;

    products.forEach(product => {
        if (product.price && typeof product.price === 'number') {
            totalValue += product.price;
        } else {
            return res.status(400).json({ error: `Invalid product price for ${product.name}` });
        }
    });

    res.json({ totalValue });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
