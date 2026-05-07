import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000/${product.image}`) : 'http://localhost:5000/uploads/hero_image.png';
  
  return (
    <div className="product-card animate-fade-in">
      {product.badge && <div className={`product-badge ${product.badge === 'Vintage' ? 'badge-vintage' : 'badge-new'}`}>{product.badge}</div>}
      <div className="product-img-wrapper" onClick={() => window.location.href = `/product/${product._id}`} style={{cursor: 'pointer'}}>
        <img src={imageUrl} alt={product.title} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:5000/uploads/hero_image.png'; }} />
        <button className="btn btn-primary add-to-cart-quick" onClick={(e) => { e.stopPropagation(); addToCart(product); alert('Added to cart!'); }}>Add to Cart</button>
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.title}</h3>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="product-price">₹{product.price.toFixed(2)}</span>
          <span className="product-size">Size: {product.size}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
