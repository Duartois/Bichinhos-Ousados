const Dashboard = () => {
  return (
    <div className="accounts__container grid md:grid-cols-[1fr_3fr] gap-6 container mx-auto py-16 px-4">
      <div className="account__tabs border rounded">
        <div className="account__tab active-tab">Meu Perfil</div>
        <div className="account__tab">Pedidos</div>
        <div className="account__tab">Endereços</div>
        <div className="account__tab">Configurações</div>
      </div>
      <div className="tab__content p-6 border rounded">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo à sua conta!</h2>
        <p>Aqui você pode gerenciar seus dados e pedidos.</p>
      </div>
    </div>
  );
};
export default Dashboard;
