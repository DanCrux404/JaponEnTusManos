import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/products";
import "../../styles/ProductsSection.css";

function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    ProductName: "",
    Description: "",
    Price: "",
    Stock: "",
    ImageURL: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar productos");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await updateProduct({ ...form, ProductID: editingProduct.ProductID });
      } else {
        await createProduct(form);
      }
      setForm({ ProductName: "", Description: "", Price: "", Stock: "", ImageURL: "" });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error al guardar producto");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      ProductName: product.ProductName,
      Description: product.Description,
      Price: product.Price,
      Stock: product.Stock,
      ImageURL: product.ImageURL,
    });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("¿Seguro quieres eliminar este producto?")) return;
    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto");
    }
  };

  return (
    <div className="products-section">
      <h2>Productos</h2>

      <div className="product-form">
        <input name="ProductName" placeholder="Nombre" value={form.ProductName} onChange={handleChange} />
        <input name="Description" placeholder="Descripción" value={form.Description} onChange={handleChange} />
        <input name="Price" type="number" placeholder="Precio" value={form.Price} onChange={handleChange} />
        <input name="Stock" type="number" placeholder="Stock" value={form.Stock} onChange={handleChange} />
        <input name="ImageURL" placeholder="URL Imagen" value={form.ImageURL} onChange={handleChange} />
        <button onClick={handleSave}>{editingProduct ? "Actualizar" : "Crear"}</button>
      </div>

      <div className="products-list">
        {products.map(product => (
          <div key={product.ProductID} className="product-card">
            <img src={product.ImageURL} alt={product.ProductName} />
            <h3>{product.ProductName}</h3>
            <p>{product.Description}</p>
            <p>Precio: ${product.Price}</p>
            <p>Stock: {product.Stock}</p>
            <div className="card-buttons">
              <button onClick={() => handleEdit(product)}>Editar</button>
              <button onClick={() => handleDelete(product.ProductID)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsSection;
