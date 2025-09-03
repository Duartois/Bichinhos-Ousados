import ProductCardMini from "./ProductCardMini";

const Showcase = ({ title, products, fallback }) => {
  const items = products.length ? products : fallback;
  if (!items.length) return null;

  return (
    <div className="showcase__wrapper bg-white rounded-xl shadow-sm p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <h3 className="section__title text-base font-semibold mb-4 text-gray-800 border-b pb-2">
        {title}
      </h3>
      <div className="flex flex-col gap-4">
        {items.slice(0, 3).map((p) => (
          <ProductCardMini key={p.id} product={p} />
        ))}
      </div>
    </div>

  );
};

export default Showcase;