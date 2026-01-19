function ProductCard({ product, onBuy }) {
  return (
    <div className="product-card">
      <img src={product.ImageURL} alt={product.ProductName} />
      <h3>{product.ProductName}</h3>
      <p>{product.Description}</p>
      <p>Precio: ${product.Price}</p>
      <p>Stock: {product.Stock}</p>
      <button onClick={() => onBuy(product)} disabled={product.Stock === 0}>
        {product.Stock === 0 ? "Agotado" : "Comprar"}
      </button>
    </div>
  );
}

export default ProductCard;
