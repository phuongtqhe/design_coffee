import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Container from "../components/Container";
import { useLocation } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 100 });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [location.search]);

  useEffect(() => {
    // Fetch products and categories from the mock API
    const fetchData = async () => {
      try {
        const productsRes = await axios.get("http://localhost:9999/products");
        const categoriesRes = await axios.get("http://localhost:9999/categories");
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let tempProducts = [...products];

    // 1. Search
    if (searchTerm) {
      tempProducts = tempProducts.filter((p) =>
        (p.title || p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter by Price
    tempProducts = tempProducts.filter(
      (p) => p.price >= priceFilter.min && p.price <= priceFilter.max
    );

    // 3. Sort
    switch (sortOption) {
      case "name-asc":
        tempProducts.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
        break;
      case "name-desc":
        tempProducts.sort((a, b) => (b.title || b.name || "").localeCompare(a.title || a.name || ""));
        break;
      case "price-asc":
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(tempProducts);
  }, [products, searchTerm, sortOption, priceFilter]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceFilter((prev) => ({ ...prev, [name]: Number(value) }));
  };

  return (
    <Container class1="all-products-wrapper py-5 home-wrapper-2">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-center mb-4">All Products</h2>
        </div>
        {/* Controls */}
        <div className="col-md-4 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-3">
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
            <option value="price-asc">Sort by Price (Low to High)</option>
            <option value="price-desc">Sort by Price (High to Low)</option>
          </select>
        </div>
        <div className="col-md-5 mb-3">
          <div className="d-flex align-items-center gap-2">
            <label>Price:</label>
            <input
              type="number"
              name="min"
              className="form-control"
              placeholder="Min"
              value={priceFilter.min}
              onChange={handlePriceChange}
            />
            <span>-</span>
            <input
              type="number"
              name="max"
              className="form-control"
              placeholder="Max"
              value={priceFilter.max}
              onChange={handlePriceChange}
            />
          </div>
        </div>
      </div>

      {/* Products by Category */}
      {categories.map((category) => {
        const categoryProducts = filteredProducts.filter(
          (p) => p.categoryId == category.id
        );
        if (categoryProducts.length == 0) return null;
          
        return (
          <div key={category.id} className="mb-5">
            <h3 className="section-heading">{category.name}</h3>
            <div className="row">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} grid={3} />
              ))}
            </div>
          </div>
        );
      })}
      {filteredProducts.length === 0 && (
        <div className="text-center">
          <h4>No products found.</h4>
        </div>
      )}
    </Container>
  );
};

export default AllProducts;
