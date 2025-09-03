const ProductCardMini = ({ product }) => {
  return (
    <a
      href={`/product/${product.id}`}
      className="flex items-center gap-4 group hover:bg-gray-50 p-2 rounded-lg transition"
    >
      {/* Imagem pequena */}
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={product.image || "/assets/img/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
          {product.name}
        </h4>
        <p className="text-xs text-gray-500">{product.category}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-cyan-600">
            R$ {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              R$ {product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default ProductCardMini;
