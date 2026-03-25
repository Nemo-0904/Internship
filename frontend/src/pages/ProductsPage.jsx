import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { useCart } from '../context/cartContext.jsx';

// ─────────────────────────────────────────
// Reusable Product Card Component
// ─────────────────────────────────────────
const ProductItem = React.memo(({ product, onAdd }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="masonry-item">
      <div className="category-label">{product.category}</div>

      {!imgError ? (
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="image-not-found">IMAGE</div>
      )}

      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <span className="price">
        ₹{product.price.toLocaleString('en-IN')}
      </span>
      <button onClick={() => onAdd(product._id)}>Add to Cart</button>
    </div>
  );
});

function ProductsPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [message, setMessage] = useState({ type: '', text: '' });

  const { addToCart } = useCart();

  // ───────── Fetch Products from MongoDB ─────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError('Could not load products. Please try again later.');
        console.error('Products fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ───────── Flash Message ─────────
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // ───────── URL Category Filter ─────────
  const allCategories = useMemo(() => {
    return ['All Products', ...new Set(products.map((p) => p.category))];
  }, [products]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categorySlug = params.get('category');
    if (categorySlug) {
      const found = allCategories.find(
        (cat) => cat.toLowerCase().replace(/\s/g, '-') === categorySlug
      );
      if (found) setSelectedCategory(found);
    } else {
      setSelectedCategory('All Products');
    }
  }, [location.search, allCategories]);

  // ───────── Optimized Filtering ─────────
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All Products') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  // ───────── Add to Cart ─────────
  const handleAddToCart = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    addToCart({ ...product, id: product._id, name: product.title });
    showMessage('success', `${product.title} added to cart!`);
  };

  // ───────── Render ─────────
  return (
    <div className="products-page-wrapper">

      <section className="products-page-intro">
        <h2>Explore Our Robotic Solutions</h2>
        <p>
          Find the perfect robot for your industrial, educational,
          or autonomous needs.
        </p>
      </section>

      {message.text && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading && <p className="no-products-found">Loading products...</p>}
      {error && <p className="no-products-found" style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <section className="category-filter-section">
            <h3>Filter by Category:</h3>
            <div className="category-buttons">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section className="masonry-products">
            <div className="masonry-grid">
              {filteredProducts.length === 0 ? (
                <p className="no-products-found">No products found for this category.</p>
              ) : (
                filteredProducts.map((p) => (
                  <ProductItem key={p._id} product={p} onAdd={handleAddToCart} />
                ))
              )}
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}

export default ProductsPage;