const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                isAdmin INTEGER DEFAULT 0,
                isBlocked INTEGER DEFAULT 0
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS products (
                _id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                brand TEXT,
                price REAL,
                size TEXT,
                condition TEXT,
                category TEXT,
                image TEXT,
                badge TEXT,
                description TEXT,
                stock_status TEXT DEFAULT 'In Stock'
            )`);
            db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
                if (row && row.count === 0) {
                    const stmt = db.prepare(`INSERT INTO products (title, brand, price, size, condition, category, image, badge, description) VALUES (?,?,?,?,?,?,?,?,?)`);
                    stmt.run("Vintage Wool Trench Coat", "Thrifted", 85.00, "L", "Excellent", "Outerwear", "images/hero_image.png", "New Arrival", "A beautiful vintage wool trench coat.");
                    stmt.run("Retro Anorak Jacket", "Vintage", 599.00, "One Size", "Good", "Unisex", "images/hero_image.png", "New Arrival", "Unique vintage piece.");
                    stmt.run("Classic Checkered Button-Down Shirt", "Vintage", 299.00, "M", "Good", "Men", "images/checkered_shirt.jpg", "Vintage", "Classic button-down.");
                    stmt.run("High-Waisted Corduroy Pants", "Vintage", 399.00, "28", "Good", "Women", "images/cargo_pants.png", "Trending", "Corduroy pants.");
                    stmt.run("Chunky Platform Loafers", "Vintage", 499.00, "8", "Good", "Accessories", "images/chunky_loafers.png", "Rare Find", "Chunky loafers.");
                    stmt.run("Pastel Knit Cardigan", "Vintage", 349.00, "S", "Good", "Women", "images/pastel_cardigan.png", "New Arrival", "Pastel cardigan.");
                    stmt.run("Oversized Flannel Shirt", "Vintage", 299.00, "L", "Good", "Unisex", "images/jacket.jpg", "New Arrival", "Oversized flannel.");
                    stmt.run("Graphic Band Tee", "Vintage", 199.00, "M", "Good", "Men", "images/graphic_tee.png", "Trending", "Band tee.");
                    stmt.finalize();
                    console.log('Seeded products.');
                }
            });
        });
    }
});

const dbRun = (query, params = []) => new Promise((res, rej) => db.run(query, params, function (err) { if(err) rej(err); else res(this); }));
const dbGet = (query, params = []) => new Promise((res, rej) => db.get(query, params, (err, row) => { if(err) rej(err); else res(row); }));
const dbAll = (query, params = []) => new Promise((res, rej) => db.all(query, params, (err, rows) => { if(err) rej(err); else res(rows); }));

module.exports = { db, dbRun, dbGet, dbAll };
