

import { Link } from "react-router-dom";
function HeaderHome() {
    return (
        <>
        <header className="flex justify-between items-center h-30 bg-[#2563EB] text-white font-medium">
            <h1 className="text-6xl ml-20">IndigenusPet</h1>

            
            <div className="mr-10 flex gap-5">
                <Link to="/login" className="bg-white p-3 m rounded-4xl flex items-center justify-center h-10 w-25 text-black">Login</Link>
                <Link to="/register" className="bg-blue-500 text-white p-3 border-white border-1 rounded-4xl flex items-center justify-center h-10 w-25 text-black">Cadastro</Link>
            </div>
        </header>
        
        </>
    )
}
export default HeaderHome