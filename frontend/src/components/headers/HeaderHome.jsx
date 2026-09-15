

function HeaderHome() {
    return (
        <>
        <header className="flex justify-between items-center h-30 bg-[#2563EB] text-white font-medium">
            <h1 className="text-6xl ml-20">IndigenusPet</h1>

            <nav className="flex items-center justify-center">
                <ul className="flex items-center justify-center gap-15">
                    <li><a href="">Contato</a></li>
                    <li><a href="">Produto</a></li>
                </ul>
            </nav>
            <div className="mr-10 flex gap-5">
                <button className="bg-white p-3 rounded-4xl flex items-center justify-center  h-10 w-25 text-black">Login</button>
                <button className="bg-white p-3 rounded-4xl flex items-center justify-center  h-10 w-25 text-black">Cadastro</button>
            </div>
        </header>
        
        </>
    )
}
export default HeaderHome