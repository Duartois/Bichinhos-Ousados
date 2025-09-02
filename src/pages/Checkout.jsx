const Checkout = () => {
  return (
    <section className="checkout__container grid md:grid-cols-2 gap-8 container mx-auto py-16 px-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Informações de Entrega</h2>
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Nome Completo" className="border p-3 rounded" />
          <input type="text" placeholder="Endereço" className="border p-3 rounded" />
          <input type="text" placeholder="Cidade" className="border p-3 rounded" />
          <input type="text" placeholder="CEP" className="border p-3 rounded" />
        </form>
      </div>
      <div className="border p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
        <p>Total: <span className="text-blue-600 font-bold">R$ 0,00</span></p>
        <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full">
          Finalizar Compra
        </button>
      </div>
    </section>
  );
};
export default Checkout;
