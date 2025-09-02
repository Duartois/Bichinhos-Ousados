import { Link } from "react-router-dom";

/**
 * ProductCard
 * Props:
 * - id: string|number
 * - to: string (rota de detalhes, ex: `/product/123`)
 * - title: string
 * - category: string
 * - image: { default: string, hover?: string }
 * - badge?: { text: string, tone?: "light-pink"|"light-green"|"light-orange"|"light-blue" }
 * - rating?: { value: number, count?: number } // value 0..5
 * - price?: { new: number|string, old?: number|string, currency?: string } // ex: "R$"
 * - onAddToCart?: (payload) => void
 */
const ProductCard = ({
  id,
  to = "#",
  title,
  category,
  image = { default: "/assets/img/product.png", hover: "" },
  badge,
  rating = { value: 0, count: 0 },
  price = { new: "", old: "", currency: "R$" },
  onAddToCart,
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating.value));

  const handleAdd = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart({ id, title, priceNew: price.new });
    }
    // Mantém compat com scripts legados que escutam .add-cart
    const btn = e.currentTarget;
    btn.dispatchEvent(new CustomEvent("add-cart-click", { bubbles: true }));
  };

  return (
    <article className="product__item group" data-id={id}>
      {/* Banner / Imagens */}
      <div className="product__banner">
        <Link to={to} className="product__images">
          <img
            src={image.default}
            alt={title}
            className="product__img default"
            loading="lazy"
          />
          {image.hover ? (
            <img
              src={image.hover}
              alt={`${title} (hover)`}
              className="product__img hover"
              loading="lazy"
            />
          ) : null}
        </Link>

        {/* Badge opcional */}
        {badge?.text ? (
          <span className={`product__badge ${badge?.tone || ""}`}>{badge.text}</span>
        ) : null}

        {/* Ações sobrepostas */}
        <div className="product__actions">
          <button className="action__btn" aria-label="Visualizar">
            <i className="bx bx-show" />
          </button>
          <button className="action__btn" aria-label="Favoritar">
            <i className="bx bx-heart" />
          </button>
          <button className="action__btn" aria-label="Comparar">
            <i className="bx bx-git-compare" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="product__content">
        <span className="product__category">{category}</span>

        <h3 className="product__title">
          <Link to={to} className="line-clamp-2">
            {title}
          </Link>
        </h3>

        {/* Rating */}
        <div className="product__rating flex items-center gap-1">
          {stars.map((filled, i) => (
            <i
              key={i}
              className={`bx ${filled ? "bxs-star" : "bx-star"}`}
              aria-hidden
            />
          ))}
          {typeof rating.count === "number" && (
            <span className="text-gray-500 text-xs ml-1">({rating.count})</span>
          )}
        </div>

        {/* Preço */}
        <div className="product__price flex items-center gap-2">
          <span className="new__price">
            {price.currency}{price.new}
          </span>
          {price.old ? (
            <span className="old__price">
              {price.currency}{price.old}
            </span>
          ) : null}
        </div>

        {/* Add to cart (compat com scripts: classe add-cart + data-id) */}
        <button
          className="cart__btn btn btn--sm add-cart"
          data-id={id}
          onClick={handleAdd}
        >
          Adicionar
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
