import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";




const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    user: "",
    rating: 0,
    title: "",
    comment: "",
  });
  const { addToCart } = useCart();
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/get-reviews?productId=${id}`);
        const data = res.data || [];
        setReviews(data);

        if (data.length > 0) {
          const sum = data.reduce((acc, r) => acc + r.rating, 0);
          setAvgRating(sum / data.length);
        } else {
          setAvgRating(0);
        }
      } catch (err) {
        console.error("Erro ao buscar avaliações:", err.message);
      }
    };
    if (id) fetchReviews();
  }, [id]);

  // Buscar produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product-data?id=${id}`);
        setProduct(res.data);
        setMainImage(res.data.image || "/assets/img/noImage.png");
      } catch (err) {
        console.error("Erro ao buscar produto:", err.message);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Buscar reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/get-reviews?productId=${id}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Erro ao buscar avaliações:", err.message);
      }
    };
    if (id) fetchReviews();
  }, [id]);

  // Buscar relacionados
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        if (product?.category) {
          const res = await api.post("/get-products", { category: product.category });
          const items = res.data.filter((p) => p.id !== product.id);
          setRelated(items.slice(0, 4));
        }
      } catch (err) {
        console.error("Erro ao buscar relacionados:", err.message);
      }
    };
    if (product) fetchRelated();
  }, [product]);

  // Submeter nova review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/add-review", {
        productId: id,
        ...reviewForm,
      });
      setReviewForm({ user: "", rating: 0, title: "", comment: "" });
      const res = await api.get(`/get-reviews?productId=${id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Erro ao enviar review:", err.message);
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-gray-600">Carregando produto...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-12 items-start">
        {/* Galeria */}
        <div className="flex gap-4">
          {/* Miniaturas */}
          {product.images?.length > 1 && (
            <div className="flex flex-col gap-3">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Thumbnail"
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border transition-transform duration-200 hover:scale-105 ${mainImage === img ? "border-cyan-600" : "border-gray-200"
                    }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}

          {/* Imagem principal */}
          <motion.div
            layoutId={`product-${id}`}
            className="flex-1 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center"
          >
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-auto object-contain max-h-[600px] transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Infos */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
            <p className="text-gray-500 mt-2">{product.category}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[...Array(Math.max(5, Math.round(avgRating || 0)))].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
          </div>

          {/* Preços */}
          <div className="flex items-center gap-4 border-y py-4">
            <span className="text-3xl font-bold text-cyan-600">
              R$ {product.price}
            </span>
            {product.oldPrice && (
              <span className="line-through text-gray-400 text-lg">
                R$ {product.oldPrice}
              </span>
            )}
            {product.savePrice && (
              <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium">
                -R$ {product.savePrice}
              </span>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed tracking-wide">
            {product.shortDes || "Descrição não disponível"}
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart({
              id: product.id,
              title: product.name,
              price: Number(product.price),
              productImg: product.image,
              quantity: 1,
            })}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-cyan-600 text-white py-3 px-8 rounded-lg font-medium text-lg shadow hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-600 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            Adicionar ao Carrinho
          </motion.button>


          <ul className="text-sm text-gray-500 mt-4 space-y-1">
            <li><span className="font-medium">SKU:</span> {product.id}</li>
            <li><span className="font-medium">Disponibilidade:</span> Em estoque</li>
          </ul>
        </div>
      </section>

      {/* Detalhes longos */}
      <section className="mt-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Detalhes do Produto</h2>
        <p
          className="text-gray-700 leading-relaxed tracking-wide"
          dangerouslySetInnerHTML={{
            __html: product.detail || "Detalhes indisponíveis.",
          }}
        />
      </section>

      {/* Avaliações */}
      <section className="mt-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Avaliações</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">Ainda não há avaliações para este produto.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="border p-5 rounded-lg shadow-sm bg-white flex gap-4">
                {/* Avatar / Placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                    {review.user?.charAt(0) || "A"}
                  </div>
                </div>

                {/* Conteúdo da review */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{review.user || "Anônimo"}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{review.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form de nova review */}
        <form
          onSubmit={handleReviewSubmit}
          className="mt-10 p-6 border rounded-lg shadow-sm bg-gray-50 space-y-4"
        >
          <h3 className="text-lg font-semibold">Deixe sua avaliação</h3>
          <input
            type="text"
            placeholder="Seu nome"
            value={reviewForm.user}
            onChange={(e) => setReviewForm({ ...reviewForm, user: e.target.value })}
            className="w-full border rounded px-4 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Título"
            value={reviewForm.title}
            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
            className="w-full border rounded px-4 py-2 text-sm"
          />
          <textarea
            placeholder="Comentário"
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            className="w-full border rounded px-4 py-2 text-sm h-28 resize-none"
          />
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${reviewForm.rating >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
                  }`}
                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-cyan-600 text-white py-2 px-6 rounded-lg hover:bg-cyan-700 transition"
          >
            Enviar Avaliação
          </button>
        </form>
      </section>

      {/* Relacionados */}
      <section className="mt-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Você também pode gostar</h2>
        {related.length === 0 ? (
          <p className="text-gray-500">Nenhum produto relacionado encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductDetails;
