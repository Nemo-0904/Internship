import React, { useState, useEffect, useMemo } from 'react';
import products from '../../src/data/products_prioritized_with_ids.json';
import stlData from '../../src/data/stlfiles_with_price.json';

import ProductCard from '../components/ProductCard';
import '../styles/ThreeDPrintingHub.css';
import Footer from '../components/Footer';

const ITEMS_PER_PAGE = 16;

const ThreeDPrintingHub = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔹 Debounced search using setTimeout (safer than lodash here)
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 🔹 Filter products only when debouncedQuery changes
  const filteredProducts = useMemo(() => {
    const trimmedQuery = debouncedQuery.trim().toLowerCase();

    if (!trimmedQuery) return products;

    return products.filter((product) =>
      product.name?.toLowerCase().includes(trimmedQuery) ||
      product.description?.toLowerCase().includes(trimmedQuery)
    );
  }, [debouncedQuery]);

  // 🔹 Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  // 🔹 Scroll to top on page change (instant, no glitchy smooth scroll)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const visiblePages = () => {
    const maxVisible = 10;
    let start = Math.max(1, currentPage - 4);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="hub-page-wrapper">
      <div className="container">
        <header className="hub-header">
          <h1>Welcome to the 3D Library</h1>
        </header>

        <div className="search-controls">
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search models by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hub-search-input"
            />
            <div className="models-count">
              {debouncedQuery.trim() === ''
                ? `All Models: ${products.length}`
                : `Found: ${filteredProducts.length}`}
            </div>
          </div>
        </div>

        <div className="product-grid">
          {currentItems.length === 0 ? (
            <p className="no-results">No models match your search.</p>
          ) : (
            currentItems.map((product) => (
              <ProductCard
                key={product.id || product.name}
                product={product}
                stlData={stlData}
              />
            ))
          )}
        </div>

        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {visiblePages().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={currentPage === pageNum ? 'active' : ''}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ThreeDPrintingHub;