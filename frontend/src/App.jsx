import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "https://codevector-c03r.onrender.com/api/products";

const CATEGORIES = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Sports",
  "Toys",
  "Beauty",
  "Automotive",
  "Grocery",
  "Office Supplies",
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [cursor, setCursor] = useState(null);
  const [cursorId, setCursorId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchProducts = useCallback(async (cat, cur, curId, reset = false) => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (cat !== "All") params.category = cat;
      if (cur) params.cursor = cur;
      if (curId) params.cursorId = curId;

      const res = await axios.get(API_URL, { params });
      const { data, nextCursor, nextCursorId, hasMore } = res.data;

      setProducts((prev) => (reset ? data : [...prev, ...data]));
      setCursor(nextCursor);
      setCursorId(nextCursorId);
      setHasMore(hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  // initial fetch
  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProducts(category, null, null, true);
    });
  }, [category, fetchProducts]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCursor(null);
    setCursorId(null);
    setProducts([]);
    setInitialLoad(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(category, cursor, cursorId, false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 16px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        Product Listing
      </h1>
      <p style={{ color: "#666", marginBottom: 24 }}>Browse 200,000 products</p>

      {/* Category Filter */}
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid #ddd",
              background: category === cat ? "#000" : "#fff",
              color: category === cat ? "#fff" : "#333",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {initialLoad ? (
        <p>Loading...</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
                  {p.category}
                </div>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  ₹{p.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            {hasMore ? (
              <button
                onClick={loadMore}
                disabled={loading}
                style={{
                  padding: "10px 32px",
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: 14,
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            ) : (
              <p style={{ color: "#888" }}>No more products</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
