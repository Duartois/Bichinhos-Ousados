const Category = () => {
  return (
    <section className="section">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">Catálogo</h2>

        <div className="total__products mb-10 pt-5">
          <p>
            Mostrando <span className="text-sky-600 font-semibold" id="total-products">0</span> produtos
          </p>
        </div>

        <div
          id="category-products"
          className="products__container"
        ></div>

        <div className="pagination flex gap-2 justify-center mt-11">
          <a href="#" className="pagination__link active">1</a>
          <a href="#" className="pagination__link">2</a>
          <a href="#" className="pagination__link">3</a>
        </div>
      </div>
    </section>
  );
};
export default Category;
