const Newsletter = ({
  title = "Faça parte da nossa Comunidade!",
  description = "Receba novidades, descontos exclusivos e conteúdos inspiradores direto no seu e-mail.",
  icon = "/assets/img/icon-email.svg",
  placeholder = "Digite seu melhor e-mail",
  cta = "Inscrever-se",
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email")?.toString().trim();
    if (onSubmit) onSubmit(email);
  };

  return (
    <section className="relative py-16 px-6 bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 overflow-hidden">
      {/* fundo decorativo */}
      <div className="absolute inset-0 opacity-10 bg-[url('/assets/img/pattern.svg')] bg-repeat" />

      <div className="relative container mx-auto max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 grid gap-6 md:grid-cols-[1.5fr_2fr] items-center">
          {/* Texto */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="flex items-center justify-center md:justify-start text-2xl font-bold text-gray-900 gap-2">
              <img src={icon} alt="email" className="h-8 w-8 animate-bounce-slow" />
              {title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base">{description}</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              name="email"
              placeholder={placeholder}
              required
              className="flex-1 h-12 px-5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none transition text-sm"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-lg bg-cyan-600 text-white text-sm font-semibold shadow-md 
                hover:bg-cyan-700 hover:scale-105 hover:shadow-lg 
                active:scale-95 transition-all duration-300"
            >
              {cta} ✨
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
