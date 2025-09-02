import { useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

const Home = () => {
  useEffect(() => {
    // Slider do banner (mesmo comportamento do HTML original)
    // Mantém .banner-slider e .swiper-pagination para compat com CSS/JS
    new Swiper(".banner-slider", {
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
    });
  }, []);

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
        <div className="tab__btns">
          <span className="tab__btn active-tab" data-target="#new">Novos</span>
          <span className="tab__btn" data-target="#featured">Destaque</span>
          <span className="tab__btn" data-target="#popular">Popular</span>
        </div>

        <div className="tab__items">
          <div className="tab__item active-tab" id="new">
            <div className="products__container grid" id="new-products"></div>
          </div>

          <div className="tab__item" id="featured">
            <div className="products__container grid" id="featured-products"></div>
          </div>

          <div className="tab__item" id="popular">
            <div className="products__container grid" id="popular-products"></div>
          </div>
        </div>
      </section>

      {/* ======= SHOWCASE (3 colunas) ======= */}
      <section className="showcase section">
        <div className="showcase__container container grid">
          <div className="showcase__wrapper">
            <h3 className="section__title">Chegou, Bombou!</h3>
            <div id="new-showcase"></div>
          </div>

          <div className="showcase__wrapper">
            <h3 className="section__title">Outlet & Ofertas</h3>
            <div id="featured-showcase"></div>
          </div>

          <div className="showcase__wrapper">
            <h3 className="section__title">Mais Vendidos</h3>
            <div id="popular-showcase"></div>
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
