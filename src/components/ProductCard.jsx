import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Badge: Novo / Destaque / Popular
  let badgeLabel = "";
  const createdAt = new Date(product.createdAt);
  const diffDays = Math.ceil(Math.abs(new Date() - createdAt) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) {
    badgeLabel = "Novo";
  } else if (Number(product.savePrice) >= 50) {
    badgeLabel = "Destaque";
  } else if (product.salesCount > 10) {
    badgeLabel = "Popular";
  }

  return (
    <div className="product__item border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <div className="relative product__banner">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 object-cover cursor-pointer"
        />
        {badgeLabel && (
          <div className="product__badge absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
            {badgeLabel}
          </div>
        )}
      </div>
      <div className="product__content p-4">
        <span className="text-xs text-gray-500">{product.tags}</span>
        <h3 className="font-semibold">{product.name}</h3>
        <div className="product__price flex gap-2 items-center">
          <span className="new__price font-bold text-[var(--first-color)]">
            R${product.price}
          </span>
          {product.oldPrice && (
            <span className="old__price">R${product.oldPrice}</span>
          )}
        </div>
        <button
          className="add-cart mt-2 px-3 py-2 bg-[var(--first-color)] text-white rounded text-sm hover:opacity-90"
          onClick={() => addToCart(product)}
        >
          + Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

