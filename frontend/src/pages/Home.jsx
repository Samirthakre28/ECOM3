import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

// Resolve image URL for dev vs production
const imgBase = import.meta.env.PROD ? '' : 'http://localhost:5000';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/products?limit=4')
           .then(res => setProducts(res.data))
           .catch(err => console.error(err))
           .finally(() => setLoading(false));
    }, []);

    const FALLBACK = 'https://via.placeholder.com/600x400?text=Thrifty+Store';

    return (
        <>
        <section className="hero">
            <div className="container hero-content animate-fade-in">
                <h1>Thrift Smart, Dress Better</h1>
                <p>Curated second-hand fashion for the modern soul. Sustainable, affordable, and undeniably aesthetic.</p>
                <Link to="/shop" className="btn btn-accent">Shop New Drop</Link>
            </div>
        </section>

        <section className="section container">
            <h2 className="section-title text-center">Shop by Category</h2>
            <div className="categories-grid">
                <div className="category-card" onClick={() => window.location.href='/shop?category=Women'}>
                    <img src={`${imgBase}/uploads/pastel_cardigan.png`} alt="Women" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                    <div className="category-content"><h3>Women</h3></div>
                </div>
                <div className="category-card" onClick={() => window.location.href='/shop?category=Men'}>
                    <img src={`${imgBase}/uploads/black_pullover.jpg`} alt="Men" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                    <div className="category-content"><h3>Men</h3></div>
                </div>
                <div className="category-card" onClick={() => window.location.href='/shop?category=Vintage'}>
                    <img src={`${imgBase}/uploads/vintage_jacket.png`} alt="Vintage" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                    <div className="category-content"><h3>Vintage</h3></div>
                </div>
                <div className="category-card" onClick={() => window.location.href='/shop?category=Accessories'}>
                    <img src={`${imgBase}/uploads/chunky_loafers.png`} alt="Accessories" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                    <div className="category-content"><h3>Accessories</h3></div>
                </div>
            </div>
        </section>

        <section className="section container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>New Arrivals</h2>
                <Link to="/shop" style={{ textDecoration: 'underline', fontWeight: 500 }}>View All</Link>
            </div>
            <div className="product-grid" id="new-arrivals-container">
                {loading ? <p>Loading...</p> : products.map(p => <ProductCard key={p._id || p.id} product={p} />)}
            </div>
        </section>

        <section className="container">
            <div className="promo-banner">
                <h2>Circular Fashion Movement</h2>
                <p style={{ marginBottom: '25px', maxWidth: '600px', marginInline: 'auto' }}>
                    Join us in reducing fashion waste. Every piece has a story, continue it. 10% of all profits go towards ocean cleanup initiatives.
                </p>
                <Link to="/shop" className="btn btn-primary">Our Mission</Link>
            </div>
        </section>
        </>
    );
}

export default Home;
