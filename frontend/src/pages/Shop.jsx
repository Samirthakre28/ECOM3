import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const search = params.get('search');

    useEffect(() => {
        const endpoint = category ? `/products?category=${category}` : '/products';
        setLoading(true);
        api.get(endpoint)
           .then(res => {
               let data = res.data;
               if (search) {
                   data = data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
               }
               setProducts(data);
           })
           .catch(err => console.error(err))
           .finally(() => setLoading(false));
    }, [category, search]);

    return (
        <section className="section container" style={{ paddingTop: '120px' }}>
            <div className="shop-layout">
                <aside className="shop-sidebar animate-fade-in">
                    <h3 style={{ marginBottom: '20px', fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Filters</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <a href="/shop" style={{ color: !category ? 'var(--accent)' : 'var(--text-muted)' }}>All Products</a>
                        <a href="/shop?category=Women" style={{ color: category === 'Women' ? 'var(--accent)' : 'var(--text-muted)' }}>Women</a>
                        <a href="/shop?category=Men" style={{ color: category === 'Men' ? 'var(--accent)' : 'var(--text-muted)' }}>Men</a>
                        <a href="/shop?category=Vintage" style={{ color: category === 'Vintage' ? 'var(--accent)' : 'var(--text-muted)' }}>Vintage</a>
                        <a href="/shop?category=Accessories" style={{ color: category === 'Accessories' ? 'var(--accent)' : 'var(--text-muted)' }}>Accessories</a>
                        <a href="/shop?category=Outerwear" style={{ color: category === 'Outerwear' ? 'var(--accent)' : 'var(--text-muted)' }}>Outerwear</a>
                    </div>
                    <p style={{ marginTop: '40px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Showing {products.length} products</p>
                </aside>
                
                <div className="shop-main">
                    <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '30px' }}>
                        {search ? `Search Results for "${search}"` : (category ? `${category} Collection` : 'Shop All')}
                    </h1>
                    
                    {loading ? (
                        <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading collection...</div>
                    ) : (
                        <div className="product-grid">
                            {products.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No products found in this category.</p>
                            ) : (
                                products.map(p => <ProductCard key={p._id} product={p} />)
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Shop;
