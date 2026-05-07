const { dbAll, dbGet, dbRun } = require('../config/db');

const getProducts = async (req, res) => {
    try {
        let query = 'SELECT * FROM products ORDER BY _id DESC';
        let params = [];
        
        if (req.query.category) {
            query = 'SELECT * FROM products WHERE category = ? ORDER BY _id DESC';
            params.push(req.query.category);
        }
        
        const products = await dbAll(query, params);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await dbGet('SELECT * FROM products WHERE _id = ?', [req.params.id]);
        if (product) res.json(product);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { title, brand, price, size, condition, category, image, badge, description } = req.body;
        const result = await dbRun(
            'INSERT INTO products (title, brand, price, size, condition, category, image, badge, description) VALUES (?,?,?,?,?,?,?,?,?)',
            [title, brand, price, size, condition, category, image, badge, description]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct };
