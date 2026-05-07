import { Link } from 'react-router-dom';

function Success() {
    return (
        <div className="container" style={{paddingTop: '150px', paddingBottom: '100px', textAlign: 'center', minHeight: '65vh'}}>
            <div className="animate-fade-in" style={{maxWidth: '600px', margin: '0 auto', background: 'var(--surface-color)', padding: '60px 40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-glow)'}}>
                <div style={{width: '80px', height: '80px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', color: 'white'}}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h1 style={{fontSize: '2.5rem', marginBottom: '20px', color: 'var(--text-main)'}}>Order Confirmed!</h1>
                <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.8'}}>
                    Thank you for shopping with Thrifty. We've received your order and will begin processing it right away. 
                    Your sustainable fashion choices are making a difference!
                </p>
                <Link to="/shop" className="btn btn-primary" style={{padding: '16px 40px', fontSize: '1.1rem'}}>Continue Shopping</Link>
            </div>
        </div>
    );
}

export default Success;
