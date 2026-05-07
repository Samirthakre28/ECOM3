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

def get_db_connection():
    # Priority 1: Vercel Postgres (Production)
    postgres_url = os.environ.get('POSTGRES_URL')
    if postgres_url and HAS_POSTGRES:
        conn = psycopg2.connect(postgres_url)
        return conn

    # Priority 2: SQLite (Local/Fallback)
    db_path = os.path.join(os.getcwd(), 'database.sqlite')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

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
