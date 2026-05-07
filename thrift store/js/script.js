// Inject Header and Footer
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectFooter();
  updateCartCount();

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
});

function injectHeader() {
  const headerHtml = `
    <div class="container nav-container">
      <a href="index.html" class="logo">
        <span class="logo-icon">➰</span> Thrift
      </a>
      <nav class="nav-links">
        <a href="index.html" class="${window.location.pathname.includes('index') || window.location.pathname === '/' ? 'active' : ''}">Home</a>
        <a href="shop.html" class="${window.location.pathname.includes('shop') ? 'active' : ''}">Shop</a>
        <a href="about.html" class="${window.location.pathname.includes('about') ? 'active' : ''}">About Us</a>
        <a href="contact.html" class="${window.location.pathname.includes('contact') ? 'active' : ''}">Contact</a>
      </nav>
      <div class="nav-icons">
        <a href="cart.html" class="cart-icon-container">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="cart-count">0</span>
        </a>
        <button class="mobile-menu-btn">☰</button>
      </div>
    </div>
  `;
  const header = document.querySelector('header');
  if (header) header.innerHTML = headerHtml;
}

function injectFooter() {
  const footerHtml = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>Thrift Store</h4>
          <p>Sustainable, affordable, trendy fashion for the modern soul.</p>
          <p>Thrift Smart, Dress Better.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="shop.html">Shop All</a>
          <a href="about.html">Our Story</a>
          <a href="contact.html">Contact Us</a>
          <a href="#">FAQ</a>
        </div>
        <div class="footer-col">
          <h4>Follow Us</h4>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
          <a href="#">Pinterest</a>
          <a href="#">Twitter</a>
        </div>
        <div class="footer-col">
          <h4>Newsletter</h4>
          <p>Get 10% off your first order!</p>
          <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed!');">
            <input type="email" placeholder="Email address" required>
            <button type="submit">→</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; ${new Date().getFullYear()} Thrift Store. All rights reserved. Built for sustainability.
      </div>
    </div>
  `;
  const footer = document.querySelector('footer');
  if (footer) footer.innerHTML = footerHtml;
}

// Render Product Card
function createProductCard(product) {
  return `
    <div class="product-card animate-fade-in" onclick="window.location.href='product.html?id=${product.id}'" style="cursor: pointer;">
      ${product.badge ? `<div class="product-badge ${product.badge === 'Vintage' ? 'badge-vintage' : 'badge-new'}">${product.badge}</div>` : ''}
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <button class="btn btn-primary add-to-cart-quick" onclick="event.stopPropagation(); CartService.addToCart(${product.id})">Add to Cart</button>
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <h3 class="product-title">${product.title}</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="product-price">₹${product.price.toFixed(2)}</span>
          <span class="product-size">Size: ${product.size}</span>
        </div>
      </div>
    </div>
  `;
}
