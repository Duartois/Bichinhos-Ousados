import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, isCatalog }) => {
  const hasDiscount =
    product.oldPrice && Number(product.oldPrice) > Number(product.price);

  const hasExtraImage =
    Array.isArray(product.images) && product.images.length > 1;
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl overflow-hidden flex flex-col group max-h-[420px]"
    >
      {/* LINK ENVOLVENDO A IMAGEM */}
      <Link
        to={`/product/${product.id}`}
        className="relative w-full aspect-square bg-gray-50 overflow-hidden block"
      >
        <img
          src={product.image || "/assets/img/placeholder.png"}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${hasExtraImage
            ? "transition-opacity duration-500 group-hover:opacity-0"
            : "group-hover:scale-105"
            }`}
        />
        {hasExtraImage && (
          <img
            src={product.images[1]}
            alt={`${product.name} alt`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </Link>

      {/* INFOS */}
      <div className="flex-1 flex flex-col p-3 sm:p-4">
        {/* Categoria */}
        <p className="text-[11px] text-gray-500 mb-1 capitalize">
          {product.category}
        </p>

        {/* Nome */}
        <Link
          to={`/product/${product.id}`}
          className={`capitalize mt-1 line-clamp-2 transition ${isCatalog
            ? "text-sm font-medium text-gray-800 hover:text-cyan-600"
            : "text-xs sm:text-sm md:text-base font-semibold text-gray-800 hover:text-cyan-600"
            }`}
        >
          {product.name}
        </Link>

        {/* Preço */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`${isCatalog
              ? "text-base font-semibold text-cyan-600"
              : "text-sm sm:text-base font-bold text-cyan-600"
              }`}
          >
            R${product.price}
          </span>
          {hasDiscount && (
            <span
              className={`${isCatalog
                ? "text-sm text-gray-400 line-through"
                : "text-xs sm:text-sm text-gray-400 line-through"
                }`}
            >
              R${product.oldPrice}
            </span>
          )}
        </div>
      </div>

      {/* BOTÃO FLUTUANTE */}
      <motion.button
        whileTap={{ scale: 0.9, rotate: -15 }}
        whileHover={{ scale: 1.1 }}
        className="absolute bottom-2 right-2 md:bottom-6 md:right-5 bg-cyan-500 text-white rounded-full p-2 transition-all duration-300 shadow-md
             hover:bg-cyan-600 hover:brightness-110 
             opacity-100 translate-y-0 group-hover:scale-110 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2"
        aria-label="Adicionar ao carrinho"
        onClick={() =>
          addToCart({
            id: product.id,
            title: product.name,
            price: Number(product.price),
            productImg: product.image,
            quantity: 1,
          })
        }
      >
        <ShoppingCart className="w-4 h-4 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] transition" />
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;
