import { useEffect, useState } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("new");

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
        const resNew = await api.post("/get-products", { badge: "new" });
        setNewProducts(resNew.data || []);

        const resFeatured = await api.post("/get-products", { badge: "featured" });
        setFeaturedProducts(resFeatured.data || []);

        const resPopular = await api.post("/get-products", { badge: "popular" });
        setPopularProducts(resPopular.data || []);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err.message);
      }
    };

    fetchProducts();
  }, []);

  const getActiveProducts = () => {
    if (activeTab === "new") return newProducts;
    if (activeTab === "featured") return featuredProducts;
    if (activeTab === "popular") return popularProducts;
    return [];
  };

  return (
    <main className="main">
      {/* Loader */}
      <img src="/assets/img/loading.gif" className="loader mx-auto" alt="Carregando" />

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
            <a href="/category" className="add-cart btn btn-sm">Compre Agora</a>
          </div>
          <img src="/assets/img/home-img.png" alt="home" className="home-img" />
        </div>
      </section>

      {/* ======= PRODUCTS TABS ======= */}
      <section className="products section container">
        <div className="tab__btns flex gap-4">
          <span
            className={`tab__btn ${activeTab === "new" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("new")}
          >
            Novos
          </span>
          <span
            className={`tab__btn ${activeTab === "featured" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("featured")}
          >
            Destaque
          </span>
          <span
            className={`tab__btn ${activeTab === "popular" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("popular")}
          >
            Popular
          </span>
        </div>

        <div className="tab__items mt-6">
          <div className="products__container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getActiveProducts().map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ======= SHOWCASE ======= */}
      <section className="showcase section">
        <div className="showcase__container container grid md:grid-cols-3 gap-6">
          <div className="showcase__wrapper">
            <h3 className="section__title">Chegou, Bombou!</h3>
            <div className="grid gap-4">
              {newProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          <div className="showcase__wrapper">
            <h3 className="section__title">Outlet & Ofertas</h3>
            <div className="grid gap-4">
              {featuredProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          <div className="showcase__wrapper">
            <h3 className="section__title">Mais Vendidos</h3>
            <div className="grid gap-4">
              {popularProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======= NEWSLETTER ======= */}
      <section className="newsletter section home__newsletter">
        <div className="newsletter__container container grid">
          <h3 className="newsletter__title flex">
            <img src="/assets/img/icon-email.svg" alt="email" className="newsletter__icon" />
            Faça parte da nossa Comunidade!
          </h3>
          <p className="newsletter__description">
            ... e receba ofertas imperdiveis!
          </p>
          <form className="newsletter__form">
            <input
              type="text"
              placeholder="Digite seu melhor email"
              className="newsletter__input"
            />
            <button type="submit" className="newsletter__btn">inscrever</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;
