import { useEffect, useState } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Showcase from "../components/Showcase";

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("new");
  const [visibleCount, setVisibleCount] = useState(8); // quantidade visível por vez
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    new Swiper(".banner-slider", {
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const resNew = await api.post("/get-products", { badge: "new" });
        setNewProducts(resNew.data || []);

        const resFeatured = await api.post("/get-products", { badge: "featured" });
        setFeaturedProducts(resFeatured.data?.length ? resFeatured.data : []);

        const resPopular = await api.post("/get-products", { badge: "popular" });
        setPopularProducts(resPopular.data?.length ? resPopular.data : []);

      } catch (err) {
        console.error("Erro ao buscar produtos:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getActiveProducts = () => {
    if (activeTab === "new") return newProducts;

    if (activeTab === "featured") {
      if (featuredProducts.length) return featuredProducts;
      return newProducts.slice(3, 12); // fallback diferente
    }

    if (activeTab === "popular") {
      if (popularProducts.length) return popularProducts;
      return newProducts.slice(12, 20); // fallback ainda mais à frente
    }

    return [];
  };


  const activeProducts = getActiveProducts();

  return (
    <main className="main">
      {/* ======= BANNER / SLIDER ======= */}
      <section className="banner-slide section container">
        <div className="swiper banner-slider">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img src="/assets/img/banner1.png" alt="Banner 1" />
            </div>
            <div className="swiper-slide">
              <img src="/assets/img/banner2.png" alt="Banner 2" />
            </div>
            <div className="swiper-slide">
              <img src="/assets/img/banner3.png" alt="Banner 3" />
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </section>

      {/* ======= HOME HERO ======= */}
      <section className="home section--lg">
        <div className="home__container container grid">
          <div className="home__content">
            <span className="home__subtitle">Novas promoções</span>
            <h1 className="home__title">
              O Presente Perfeito! <span>Nova Coleção</span>
            </h1>
            <p className="home__description">Descontos de até 50%</p>
            <a
              href="/category"
              className="inline-block px-7 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-cyan-500 to-cyan-700 shadow-md
             hover:shadow-cyan-400/50 hover:scale-105 hover:brightness-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]
             transition-all duration-300 ease-in-out"
            >
              🧶 Compre Agora
            </a>

          </div>
          <img src="/assets/img/home-img.png" alt="home" className="home-img" />
        </div>
      </section>

      {/* ======= PRODUCTS TABS ======= */}
      <section className="products section container">
        <div className="tab__btns flex gap-4 justify-center">
          <span
            className={`tab__btn ${activeTab === "new" ? "active-tab" : ""}`}
            onClick={() => {
              setActiveTab("new");
              setVisibleCount(8);
            }}
          >
            Novos
          </span>
          <span
            className={`tab__btn ${activeTab === "featured" ? "active-tab" : ""}`}
            onClick={() => {
              setActiveTab("featured");
              setVisibleCount(8);
            }}
          >
            Destaque
          </span>
          <span
            className={`tab__btn ${activeTab === "popular" ? "active-tab" : ""}`}
            onClick={() => {
              setActiveTab("popular");
              setVisibleCount(8);
            }}
          >
            Popular
          </span>
        </div>

        <div className="tab__items mt-8">
          {loading ? (
            <p className="text-center">Carregando produtos...</p>
          ) : (
            <div className="products__container container grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {activeProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {activeProducts.length > visibleCount && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="relative group overflow-hidden px-7 py-3 rounded-full font-semibold bg-gray-200 text-cyan-600 
             transition-all duration-300 ease-in-out"
              >
                <span
                  className="relative z-10 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] group-hover:scale-105"
                >
                  Ver mais
                </span>
                <span
                  className="absolute inset-0 bg-cyan-600 scale-x-0 group-hover:scale-x-100 origin-left 
               transition-transform duration-500 ease-in-out rounded-full"
                />
              </button>
            </div>
          )}
        </div>
      </section>
      {/* ======= SHOWCASE ======= */}
      <section className="showcase section">
        <div className="showcase__container container grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Showcase
            title="Chegou, Bombou!"
            products={newProducts.slice(0, 3)}
            fallback={[]}
          />

          <Showcase
            title="Outlet & Ofertas"
            products={featuredProducts}
            fallback={newProducts.slice(3, 6)}
          />

          <Showcase
            title="Mais Vendidos"
            products={popularProducts}
            fallback={newProducts.slice(6, 9)}
          />
        </div>
      </section>
      {/* ======= NEWSLETTER ======= */}
      <section className="newsletter section home__newsletter">
        <div className="newsletter__container container grid gap-6 items-center text-center md:text-left md:grid-cols-[2fr_3fr_2fr]">
          <h3 className="newsletter__title flex">
            <img
              src="/assets/img/icon-email.svg"
              alt="email"
              className="newsletter__icon"
            />
            Faça parte da nossa Comunidade!
          </h3>
          <p className="newsletter__description">
            ... e receba ofertas imperdiveis!
          </p>
          <form className="newsletter__form flex flex-col sm:flex-row gap-2 sm:gap-0">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="newsletter__input flex-1 bg-white h-12 px-5 rounded sm:rounded-l border text-sm"
            />
            <button
              type="submit"
              className="newsletter__btn bg-cyan-600 text-white px-6 h-12 rounded sm:rounded-r text-sm hover:bg-cyan-700 transition"
            >
              Inscrever-se
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;
