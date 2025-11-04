import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  const STATIC_IMG =
    "https://images.unsplash.com/photo-1649433911119-7cf48b3e8f50?auto=format&fit=crop&w=600&q=60";

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({ title: "", price: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    if (editingId) {
      setProducts((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
      );
      setEditingId(null);
    } else {
      const newProduct = {
        id: Date.now(),
        ...formData,
        image: STATIC_IMG,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setFormData({ title: "", price: "", description: "" });
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    setFormData({
      title: product.title,
      price: product.price,
      description: product.description,
    });
    setEditingId(id);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find((w) => w.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((w) => w.id !== product.id));
    } else {
      setWishlist((prev) => [...prev, product]);
    }
  };

  return (
    <div className="app">
      <h1>🛍️ Product Manager</h1>

      <div className="wishlist-top">
        <h2>My Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="empty-text">No items in wishlist.</p>
        ) : (
          <div className="wishlist-list">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-item">
                <img src={item.image} alt={item.title} />
                <div>
                  <h4>{item.title}</h4>
                  <p>₹{item.price}</p>
                </div>
                <button onClick={() => toggleWishlist(item)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAddOrEdit} className="form">
        <input
          type="text"
          name="title"
          placeholder="Product title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <div className="product-section">
        <h2>All Products</h2>
        <div className="product-list">
          {products.map((item) => (
            <div key={item.id} className="product">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>₹{item.price}</p>
              <p>{item.description}</p>
              <div className="btn-group">
                <button onClick={() => handleEdit(item.id)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
                <button
                  className={
                    wishlist.find((w) => w.id === item.id)
                      ? "wish-btn active"
                      : "wish-btn"
                  }
                  onClick={() => toggleWishlist(item)}
                >
                  WishList
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
