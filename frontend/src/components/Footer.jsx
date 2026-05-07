function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Thrift Store</h4>
                        <p>Sustainable, affordable, trendy fashion for the modern soul.</p>
                        <p>Thrift Smart, Dress Better.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <a href="/shop">Shop All</a>
                        <a href="/about">Our Story</a>
                        <a href="/contact">Contact Us</a>
                        <a href="#">FAQ</a>
                    </div>
                    <div className="footer-col">
                        <h4>Follow Us</h4>
                        <a href="#">Instagram</a>
                        <a href="#">TikTok</a>
                        <a href="#">Pinterest</a>
                        <a href="#">Twitter</a>
                    </div>
                    <div className="footer-col">
                        <h4>Newsletter</h4>
                        <p>Get 10% off your first order!</p>
                        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
                            <input type="email" placeholder="Email address" required />
                            <button type="submit">→</button>
                        </form>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} Thrift Store. All rights reserved. Built for sustainability.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
