const Newsletter = ({
  title = "Faça parte da nossa Comunidade!",
  description = "... e receba ofertas imperdíveis!",
  icon = "/assets/img/icon-email.svg",
  placeholder = "Digite seu melhor email",
  cta = "Inscrever",
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email")?.toString().trim();
    if (onSubmit) onSubmit(email);
  };

  return (
    <section className="newsletter section">
      <div className="newsletter__container container grid">
        <h3 className="newsletter__title flex">
          <img src={icon} alt="email" className="newsletter__icon" />
          {title}
        </h3>

        <p className="newsletter__description">{description}</p>

        <form className="newsletter__form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder={placeholder}
            className="newsletter__input"
            required
          />
          <button
            type="submit"
            className="newsletter__btn bg-cyan-600 text-white px-6 h-12 rounded sm:rounded-r text-sm font-medium
             hover:bg-cyan-700 hover:scale-105 hover:brightness-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]
             transition-all duration-300 ease-in-out"
          >
            ✨ Inscrever-se
          </button>

        </form>
      </div>
    </section>
  );
};

export default Newsletter;
