import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="h-screen flex justify-center pt-28">
      <div className="bg-green-200 w-10/12 h-3/6 rounded-2xl flex items-center">
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <h1 className="px-12 font-bold text-6xl mb-4">
              Un espacio para sanar y compartir
            </h1>
            <p className="ps-12 text-xl">
              Porque nadie debería enfrentar esto en soledad: este es un espacio
              pensado para pacientes y familias que buscan compartir
              experiencias, encontrar comprensión mutua y apoyarse entre quienes
              viven la misma realidad.
            </p>
            <div className="py-12 ps-12">
                <Link to="/login" className="px-12 py-2 bg-purple-600 text-white hover:bg-purple-700 transition">Iniciar Sesión</Link>
                <Link to="/register" className="ms-5 px-12 py-2 bg-purple-600 text-white hover:bg-purple-700 transition">Registrarse</Link>
            </div>
          </div>
          <div className="col-span-1">
            <h2>hola</h2>
            <img src="" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};
