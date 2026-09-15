import HeaderHome from "../../components/headers/HeaderHome";

function Home() {
  return (
    <>
      <HeaderHome />
      <div className="p-25  flex items-center justify-between">
        <div className="w-[60%]">
          <h1 className="text-5xl  font-semibold">
            Bem Vindo ao IndigenusPet, o Melhor Gerenciador de PetShop da Via
            Lactea
          </h1>
          <p className="text-2xl">
            O IndigenusPet é o melhor gerenciador de PetShop da Via Láctea,
            desenvolvido para tornar a gestão do seu negócio mais simples,
            organizada e eficiente. Centralize informações de clientes, pets,
            serviços e atendimentos em um único lugar, facilite o controle da su
            rotina e tenha tudo o que precisa na palma da mão.
          </p>
        </div>
        <img src="teste.webp" className="h-[550px] w-[350px] rounded-4xl"  alt=""/>
      </div>
    </>
  );
}

export default Home;
