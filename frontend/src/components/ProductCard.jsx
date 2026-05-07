import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Resolve image URL for both local dev and Vercel production
const resolveImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  // On Vercel, /uploads/* are served via the Python API or a CDN.
  // In dev they come from localhost:5000. We use a relative path for prod.
  const base = import.meta.env.PROD ? '' : 'http://localhost:5000';
  return `${base}/${image}`;
};

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x500?text=Thrifty+Store';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const imageUrl = resolveImageUrl(product.image) || FALLBACK_IMAGE;

  return (
    <div className="product-card animate-fade-in">
      {product.badge && <div className={`product-badge ${product.badge === 'Vintage' ? 'badge-vintage' : 'badge-new'}`}>{product.badge}</div>}
      <div className="product-img-wrapper" onClick={() => window.location.href = `/product/${product._id || product.id}`} style={{cursor: 'pointer'}}>
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
        />
        <button
          className="btn btn-primary add-to-cart-quick"
          onClick={(e) => { e.stopPropagation(); addToCart(product); alert('Added to cart!'); }}
        >
          Add to Cart
        </button>
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.title}</h3>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="product-price">₹{Number(product.price).toFixed(2)}</span>
          <span className="product-size">Size: {product.size}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
