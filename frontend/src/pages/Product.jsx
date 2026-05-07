import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const FALLBACK = 'https://via.placeholder.com/600x750?text=Thrifty+Store';
const imgBase = import.meta.env.PROD ? '' : 'http://localhost:5000';

function resolveImg(image) {
    if (!image) return FALLBACK;
    if (image.startsWith('http')) return image;
    return `${imgBase}/${image}`;
}

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        api.get(`/products/${id}`)
           .then(res => setProduct(res.data))
           .catch(err => console.error(err))
           .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="container" style={{padding: '150px 0', textAlign: 'center', fontSize: '1.2rem'}}>Loading product...</div>;
    if (!product) return <div className="container" style={{padding: '150px 0', textAlign: 'center', fontSize: '1.2rem'}}>Product not found</div>;

    const imageUrl = resolveImg(product.image);

    return (
        <div className="container" style={{paddingTop: '120px'}}>
            <div className="product-details-container animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center' }}>
                <div className="product-gallery" style={{position: 'relative'}}>
                    {product.badge && <div className={`product-badge ${product.badge === 'Vintage' ? 'badge-vintage' : 'badge-new'}`} style={{fontSize: '0.9rem', padding: '10px 20px', top: '20px', left: '20px'}}>{product.badge}</div>}
                    <img
                        src={imageUrl}
                        alt={product.title}
                        style={{width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-subtle)', objectFit: 'cover', aspectRatio: '4/5'}}
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                    />
                </div>
                <div className="product-info-section">
                    <div className="p-brand" style={{color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', marginBottom: '15px'}}>{product.brand}</div>
                    <h1 className="p-title" style={{fontSize: '3rem', margin: '0 0 15px 0', lineHeight: '1.1'}}>{product.title}</h1>
                    <div className="p-price" style={{fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '30px'}}>₹{Number(product.price).toFixed(2)}</div>

                    <div className="p-meta" style={{display: 'flex', gap: '40px', margin: '40px 0', padding: '30px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)'}}>
                        <div><strong style={{color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px'}}>Size</strong> <span style={{fontSize: '1.2rem', fontWeight: '500'}}>{product.size}</span></div>
                        <div><strong style={{color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px'}}>Condition</strong> <span style={{fontSize: '1.2rem', fontWeight: '500'}}>{product.condition}</span></div>
                        <div><strong style={{color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px'}}>Category</strong> <span style={{fontSize: '1.2rem', fontWeight: '500'}}>{product.category}</span></div>
                    </div>

                    <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '40px'}}>{product.description}</p>

                    <button
                        className="btn btn-primary"
                        style={{width: '100%', padding: '18px', fontSize: '1.2rem', borderRadius: 'var(--radius-md)'}}
                        onClick={() => { addToCart(product); alert('Added to Cart!'); }}
                    >
                        Add to Cart — ₹{Number(product.price).toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Product;
