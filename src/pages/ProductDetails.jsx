const ProductDetails = () => {
  return (
    <section className="details__container grid md:grid-cols-2 gap-8 container mx-auto py-16 px-4">
      <div>
        <img src="/assets/img/product-1.png" alt="Produto" className="rounded-lg mb-4" />
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-2">Nome do Produto</h2>
        <p className="text-gray-500 mb-4">Marca / Categoria</p>
        <div className="flex items-center gap-4 border-y py-4 mb-6">
          <span className="text-3xl font-bold text-blue-600">R$199</span>
          <span className="line-through text-gray-400">R$299</span>
        </div>
        <p className="mb-6">
          Descrição curta do produto aqui, destacando suas principais qualidades.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
          Adicionar ao Carrinho
        </button>
      </div>
    </section>
  );
};
export default ProductDetails;
