from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import razorpay
import jwt
import datetime
from functools import wraps
import hashlib
import bcrypt
import re
import os

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

# Use environment variables for production
SECRET_KEY = os.environ.get("JWT_SECRET", "your_super_secret_jwt_key_here")
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "rzp_test_SkOaBP9BFrAoaF")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "b8bzfgnzfxF4JQVJHjLffYH3")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

app = Flask(__name__)
CORS(app)

def get_db_path():
    """On Vercel, /tmp is the only writable directory in serverless functions.
    Locally, use the project root database.sqlite."""
    if os.environ.get('VERCEL') or os.environ.get('VERCEL_ENV'):
        return '/tmp/database.sqlite'
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend', 'database.sqlite')

def get_db_connection():
    # Priority 1: Vercel Postgres (Production)
    postgres_url = os.environ.get('POSTGRES_URL')
    if postgres_url and HAS_POSTGRES:
        conn = psycopg2.connect(postgres_url)
        return conn

    # Priority 2: SQLite — uses /tmp on Vercel, local file in dev
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn

SEED_PRODUCTS = [
    ("Vintage Wool Trench Coat", "Thrifted", 85.00, "L", "Excellent", "Outerwear",
     "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600", "New Arrival",
     "A beautiful vintage wool trench coat in excellent condition.", "In Stock"),
    ("Retro Anorak Jacket", "Vintage Finds", 599.00, "One Size", "Good", "Men",
     "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600", "New Arrival",
     "Unique vintage anorak — a true statement piece.", "In Stock"),
    ("Classic Checkered Button-Down", "Vintage", 299.00, "M", "Good", "Men",
     "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600", "Vintage",
     "Classic plaid button-down shirt, timeless style.", "In Stock"),
    ("High-Waisted Corduroy Pants", "Vintage", 399.00, "28", "Good", "Women",
     "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600", "Trending",
     "Warm corduroy high-waisted pants for any season.", "In Stock"),
    ("Chunky Platform Loafers", "Vintage", 499.00, "8", "Good", "Accessories",
     "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600", "Rare Find",
     "Bold chunky platform loafers — the perfect statement shoe.", "In Stock"),
    ("Pastel Knit Cardigan", "Vintage", 349.00, "S", "Good", "Women",
     "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600", "New Arrival",
     "Soft pastel knit cardigan, cozy and chic.", "In Stock"),
    ("Oversized Flannel Shirt", "Vintage", 299.00, "L", "Good", "Men",
     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600", "New Arrival",
     "Oversized flannel shirt — perfect layering piece.", "In Stock"),
    ("Graphic Band Tee", "Vintage", 199.00, "M", "Good", "Men",
     "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", "Trending",
     "Authentic vintage band tee with original graphics.", "In Stock"),
    ("Floral Midi Dress", "Vintage", 449.00, "S", "Excellent", "Women",
     "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600", "New Arrival",
     "Beautiful floral midi dress, perfect for any occasion.", "In Stock"),
    ("Leather Crossbody Bag", "Vintage", 699.00, "One Size", "Good", "Accessories",
     "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600", "Rare Find",
     "Genuine leather crossbody bag with vintage hardware.", "In Stock"),
    ("Denim Jacket", "Levi's Vintage", 799.00, "M", "Good", "Outerwear",
     "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600", "Trending",
     "Classic denim jacket — a wardrobe essential.", "In Stock"),
    ("Silk Slip Dress", "Vintage", 529.00, "S", "Excellent", "Women",
     "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600", "Vintage",
     "Elegant silk slip dress in ivory — effortlessly chic.", "In Stock"),
]

def init_db():
    """Initialize the database: create tables and seed products if empty.
    Called once at module load. On Vercel, writes to /tmp."""
    postgres_url = os.environ.get('POSTGRES_URL')
    if postgres_url and HAS_POSTGRES:
        # Postgres: create tables if not exist
        try:
            conn = psycopg2.connect(postgres_url)
            cur = conn.cursor()
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY, name TEXT, email TEXT UNIQUE,
                    password TEXT, is_admin INTEGER DEFAULT 0, is_blocked INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW()
                )''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS products (
                    id SERIAL PRIMARY KEY, title TEXT, brand TEXT, price REAL,
                    size TEXT, condition TEXT, category TEXT, image TEXT,
                    badge TEXT, description TEXT, stock_status TEXT DEFAULT \'In Stock\'
                )''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS product_images (
                    id SERIAL PRIMARY KEY, product_id INTEGER, image_url TEXT
                )''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY, user_id INTEGER, customer_name TEXT,
                    customer_email TEXT, customer_phone TEXT, total_amount REAL,
                    shipping_cost REAL DEFAULT 0, status TEXT DEFAULT \'Pending\',
                    payment_id TEXT, created_at TIMESTAMP DEFAULT NOW()
                )''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS order_items (
                    id SERIAL PRIMARY KEY, order_id TEXT, product_id INTEGER,
                    title TEXT, size TEXT, price REAL, quantity INTEGER
                )''')
            cur.execute('SELECT COUNT(*) FROM products')
            count = cur.fetchone()[0]
            if count == 0:
                cur.executemany(
                    'INSERT INTO products (title,brand,price,size,condition,category,image,badge,description,stock_status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',
                    SEED_PRODUCTS
                )
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            print(f'Postgres init error: {e}')
        return

    # SQLite path
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE,
            password TEXT, is_admin INTEGER DEFAULT 0, is_blocked INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, brand TEXT, price REAL,
            size TEXT, condition TEXT, category TEXT, image TEXT,
            badge TEXT, description TEXT, stock_status TEXT DEFAULT 'In Stock'
        )''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, image_url TEXT
        )''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY, user_id INTEGER, customer_name TEXT,
            customer_email TEXT, customer_phone TEXT, total_amount REAL,
            shipping_cost REAL DEFAULT 0, status TEXT DEFAULT 'Pending',
            payment_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT, product_id INTEGER,
            title TEXT, size TEXT, price REAL, quantity INTEGER
        )''')
    count = conn.execute('SELECT COUNT(*) FROM products').fetchone()[0]
    if count == 0:
        conn.executemany(
            'INSERT INTO products (title,brand,price,size,condition,category,image,badge,description,stock_status) VALUES (?,?,?,?,?,?,?,?,?,?)',
            SEED_PRODUCTS
        )
        print(f'Seeded {len(SEED_PRODUCTS)} products into SQLite.')
    conn.commit()
    conn.close()

# Initialize DB on every cold start
init_db()

# Helper to fetch one/all from both types of connections
def fetch_one(conn, query, params=()):
    if hasattr(conn, 'cursor') and not hasattr(conn, 'row_factory'): # Postgres
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, params)
            return cur.fetchone()
    else: # SQLite
        return conn.execute(query, params).fetchone()

def fetch_all(conn, query, params=()):
    if hasattr(conn, 'cursor') and not hasattr(conn, 'row_factory'): # Postgres
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, params)
            return cur.fetchall()
    else: # SQLite
        return conn.execute(query, params).fetchall()

def execute_query(conn, query, params=()):
    if hasattr(conn, 'cursor') and not hasattr(conn, 'row_factory'): # Postgres
        with conn.cursor() as cur:
            cur.execute(query, params)
            conn.commit()
            if 'INSERT' in query.upper():
                try:
                    cur.execute("SELECT lastval()")
                    return cur.fetchone()[0]
                except: return None
    else: # SQLite
        cur = conn.cursor()
        cur.execute(query, params)
        conn.commit()
        return cur.lastrowid

# JWT Middleware
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            conn = get_db_connection()
            current_user = fetch_one(conn, 'SELECT * FROM users WHERE id = ?', (data['user_id'],))
            conn.close()
            
            if not current_user or not current_user['is_admin']:
                return jsonify({'message': 'Not authorized!'}), 403
                
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        
        if not token:
            return jsonify({'message': 'Please login to continue.'}), 401
            
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            conn = get_db_connection()
            current_user = fetch_one(conn, 'SELECT * FROM users WHERE id = ?', (data['user_id'],))
            conn.close()
            
            if not current_user:
                return jsonify({'message': 'User not found!'}), 404
            if current_user['is_blocked']:
                return jsonify({'message': 'Your account is suspended.'}), 403
                
        except Exception as e:
            return jsonify({'message': 'Session expired. Please login again.'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# --- AUTH ROUTES ---
@app.route('/api/admin/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    conn = get_db_connection()
    user = fetch_one(conn, 'SELECT * FROM users WHERE email = ? AND password = ?', (email, hashed_pw))
    conn.close()
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401
    if not user['is_admin']:
        return jsonify({'message': 'Not an admin'}), 403
    if user['is_blocked']:
        return jsonify({'message': 'Account is blocked'}), 403
    token = jwt.encode({
        'user_id': user['id'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")
    return jsonify({'token': token, 'name': user['name']})

@app.route('/api/auth/signup', methods=['POST'])
def user_signup():
    data = request.json
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    if not name or not email or not password:
        return jsonify({'message': 'All fields are required.'}), 400
    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        return jsonify({'message': 'Invalid email format.'}), 400
    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters.'}), 400
    conn = get_db_connection()
    existing = fetch_one(conn, 'SELECT id FROM users WHERE email = ?', (email,))
    if existing:
        conn.close()
        return jsonify({'message': 'An account with this email already exists.'}), 409
    hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    
    user_id = execute_query(conn, 'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, 0)', (name, email, hashed_pw))
    conn.close()
    token = jwt.encode({'user_id': user_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)}, SECRET_KEY, algorithm='HS256')
    return jsonify({'token': token, 'name': name, 'email': email}), 201

@app.route('/api/auth/login', methods=['POST'])
def user_login():
    data = request.json
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400
    conn = get_db_connection()
    user = fetch_one(conn, 'SELECT * FROM users WHERE email = ?', (email,))
    conn.close()
    if not user:
        return jsonify({'message': 'Invalid email or password.'}), 401
    if user['is_blocked']:
        return jsonify({'message': 'Your account has been suspended.'}), 403
    pw_match = False
    stored_pw = user['password']
    if stored_pw.startswith('$2b$') or stored_pw.startswith('$2a$'):
        pw_match = bcrypt.checkpw(password.encode(), stored_pw.encode())
    else:
        pw_match = (stored_pw == hashlib.sha256(password.encode()).hexdigest())
    if not pw_match:
        return jsonify({'message': 'Invalid email or password.'}), 401
    token = jwt.encode({'user_id': user['id'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)}, SECRET_KEY, algorithm='HS256')
    return jsonify({'token': token, 'name': user['name'], 'email': user['email'], 'is_admin': user['is_admin']})

@app.route('/api/auth/me', methods=['GET'])
def get_me():
    token = None
    if 'Authorization' in request.headers:
        parts = request.headers['Authorization'].split()
        if len(parts) == 2 and parts[0] == 'Bearer':
            token = parts[1]
    if not token:
        return jsonify({'message': 'Not authenticated'}), 401
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        conn = get_db_connection()
        user = fetch_one(conn, 'SELECT id, name, email, is_admin, created_at FROM users WHERE id = ?', (data['user_id'],))
        conn.close()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return jsonify(dict(user))
    except Exception:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/api/admin/analytics', methods=['GET'])
@token_required
def get_analytics(current_user):
    conn = get_db_connection()
    total_sales = fetch_one(conn, "SELECT SUM(total_amount) as sum FROM orders WHERE status != 'Cancelled'").get('sum') or 0
    total_orders = fetch_one(conn, "SELECT COUNT(*) as count FROM orders").get('count')
    total_users = fetch_one(conn, "SELECT COUNT(*) as count FROM users WHERE is_admin = 0").get('count')
    total_products = fetch_one(conn, "SELECT COUNT(*) as count FROM products").get('count')
    conn.close()
    return jsonify({'total_sales': float(total_sales), 'total_orders': total_orders, 'total_users': total_users, 'total_products': total_products})

@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    limit = request.args.get('limit', type=int)
    conn = get_db_connection()
    query = 'SELECT * FROM products'
    params = []
    if category:
        query += ' WHERE category = %s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else ' WHERE category = ?'
        params.append(category)
    query += ' ORDER BY id DESC'
    if limit:
        query += ' LIMIT %s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else ' LIMIT ?'
        params.append(limit)
    
    # Fix for Postgres placeholder
    if HAS_POSTGRES and os.environ.get('POSTGRES_URL'):
        query = query.replace('?', '%s')

    products = fetch_all(conn, query, params)
    result = []
    for p in products:
        p_dict = dict(p)
        images = fetch_all(conn, 'SELECT image_url FROM product_images WHERE product_id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?'), (p['id'],))
        p_dict['images'] = [img['image_url'] for img in images]
        if not p_dict.get('image') and p_dict['images']:
            p_dict['image'] = p_dict['images'][0]
        result.append(p_dict)
    conn.close()
    return jsonify(result)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = get_db_connection()
    q = 'SELECT * FROM products WHERE id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    product = fetch_one(conn, q, (product_id,))
    if product is None:
        conn.close()
        return jsonify({'error': 'Product not found'}), 404
    p_dict = dict(product)
    q_img = 'SELECT image_url FROM product_images WHERE product_id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    images = fetch_all(conn, q_img, (product_id,))
    p_dict['images'] = [img['image_url'] for img in images]
    conn.close()
    return jsonify(p_dict)

@app.route('/api/products', methods=['POST'])
@token_required
def add_product(current_user):
    data = request.json
    conn = get_db_connection()
    q = '''INSERT INTO products (title, brand, price, size, condition, category, image, badge, description, stock_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'''.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    new_id = execute_query(conn, q, (data.get('title'), data.get('brand'), data.get('price'), data.get('size'), data.get('condition'), data.get('category'), data.get('image'), data.get('badge'), data.get('description'), data.get('stock_status', 'In Stock')))
    
    images = data.get('images', [])
    q_img = 'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    for img_url in images:
        execute_query(conn, q_img, (new_id, img_url))
    conn.close()
    return jsonify({'success': True, 'id': new_id}), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@token_required
def update_product(current_user, product_id):
    data = request.json
    conn = get_db_connection()
    q = '''UPDATE products SET title=?, brand=?, price=?, size=?, condition=?, category=?, image=?, badge=?, description=?, stock_status=? WHERE id=?'''.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    execute_query(conn, q, (data.get('title'), data.get('brand'), data.get('price'), data.get('size'), data.get('condition'), data.get('category'), data.get('image'), data.get('badge'), data.get('description'), data.get('stock_status', 'In Stock'), product_id))
    
    q_del = 'DELETE FROM product_images WHERE product_id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    execute_query(conn, q_del, (product_id,))
    
    q_img = 'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    for img_url in data.get('images', []):
        execute_query(conn, q_img, (product_id, img_url))
    conn.close()
    return jsonify({'success': True})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(current_user, product_id):
    conn = get_db_connection()
    q = 'DELETE FROM products WHERE id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    execute_query(conn, q, (product_id,))
    conn.close()
    return jsonify({'success': True}), 200

@app.route('/api/create-order', methods=['POST'])
@login_required
def create_order(current_user):
    data = request.json
    try:
        amount = int(float(data.get('amount', 0)) * 100)
        order = razorpay_client.order.create({"amount": amount, "currency": "INR", "receipt": "receipt_" + str(amount), "notes": {"shipping": data.get('shipping', 0)}})
        conn = get_db_connection()
        q = '''INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone, total_amount, shipping_cost, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'''.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
        execute_query(conn, q, (order['id'], current_user['id'], current_user['name'], current_user['email'], data.get('customer_phone', ''), float(data.get('amount', 0)), float(data.get('shipping', 0)), 'Pending'))
        
        q_item = '''INSERT INTO order_items (order_id, product_id, title, size, price, quantity) VALUES (?, ?, ?, ?, ?, ?)'''.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
        for item in data.get('items', []):
            execute_query(conn, q_item, (order['id'], item.get('id'), item.get('title'), item.get('size'), float(item.get('price')), int(item.get('quantity', 1))))
        conn.close()
        return jsonify(order)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/save-payment', methods=['POST'])
@login_required
def save_payment(current_user):
    data = request.json
    order_id = data.get('order_id')
    payment_id = data.get('payment_id')
    conn = get_db_connection()
    q = 'SELECT * FROM orders WHERE id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    order = fetch_one(conn, q, (order_id,))
    if not order:
        conn.close()
        return jsonify({'error': 'Order not found'}), 404
    if not current_user['is_admin'] and order['user_id'] != current_user['id']:
        conn.close()
        return jsonify({'error': 'Unauthorized'}), 403
    q_upd = 'UPDATE orders SET status = ?, payment_id = ? WHERE id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    execute_query(conn, q_upd, ('Paid', payment_id, order_id))
    conn.close()
    return jsonify({'success': True})

@app.route('/api/admin/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    conn = get_db_connection()
    orders = fetch_all(conn, 'SELECT * FROM orders ORDER BY created_at DESC')
    result = []
    for o in orders:
        o_dict = dict(o)
        q_item = 'SELECT * FROM order_items WHERE order_id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
        items = fetch_all(conn, q_item, (o['id'],))
        o_dict['items'] = [dict(i) for i in items]
        result.append(o_dict)
    conn.close()
    return jsonify(result)

@app.route('/api/admin/orders/<order_id>/status', methods=['PUT'])
@token_required
def update_order_status(current_user, order_id):
    data = request.json
    status = data.get('status')
    conn = get_db_connection()
    q = 'UPDATE orders SET status = ? WHERE id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    execute_query(conn, q, (status, order_id))
    conn.close()
    return jsonify({'success': True})

@app.route('/api/admin/users', methods=['GET'])
@token_required
def get_users(current_user):
    conn = get_db_connection()
    users = fetch_all(conn, 'SELECT id, name, email, is_admin, is_blocked, created_at FROM users')
    conn.close()
    return jsonify([dict(u) for u in users])

@app.route('/api/admin/users/<int:user_id>/block', methods=['PUT'])
@token_required
def toggle_user_block(current_user, user_id):
    data = request.json
    is_blocked = 1 if data.get('block') else 0
    conn = get_db_connection()
    q = 'UPDATE users SET is_blocked = ? WHERE id = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    execute_query(conn, q, (is_blocked, user_id))
    conn.close()
    return jsonify({'success': True})

@app.route('/api/admin/content', methods=['GET'])
def get_content():
    conn = get_db_connection()
    content = fetch_all(conn, 'SELECT key, value FROM content')
    conn.close()
    return jsonify({c['key']: c['value'] for c in content})

@app.route('/api/admin/content', methods=['PUT'])
@token_required
def update_content(current_user):
    data = request.json
    conn = get_db_connection()
    q = 'UPDATE content SET value = ? WHERE key = ?'.replace('?', '%s' if HAS_POSTGRES and os.environ.get('POSTGRES_URL') else '?')
    for key, value in data.items():
        execute_query(conn, q, (str(value), key))
    conn.close()
    return jsonify({'success': True})

# No app.run() needed for Vercel, but exporting 'app' is critical.
