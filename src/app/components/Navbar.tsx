import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const Navbar = async () => {
  return (
    <nav className="fixed bottom-0 md:bottom-auto md:top-0 left-0 min-h-14 md:min-w-14 w-full md:w-max h-max md:h-full px-0 md:px-3 z-[1000] bg-slate-700 border-r-2 border border-slate-800">
      <h1 className="hidden md:block text-xl text-slate-100 py-10">Nurse Planner</h1>
      <ul className="text-white text-lg h-full text-[2.5rem] flex md:flex-col justify-around md:justify-start items-start">
        <li className="outline-none focus:outline-none">
          <Link
            href="/"
            className="flex items-center outline-none focus:outline-none py-4 md:py-10"
          >
            <span className="material-symbols-outlined mx-2">home</span> <p className="hidden md:block">Inicio</p>
          </Link>
        </li>
        <li className="outline-none focus:outline-none">
          <Link
            href="/patients"
            className="flex items-center outline-none focus:outline-none py-4 md:py-10"
          >
            <span className="material-symbols-outlined mx-2">groups</span>
            <p className="hidden md:block">Pacientes</p>
          </Link>
        </li>
        <li className="outline-none focus:outline-none">
          <Link
            href="/add-new-patient"
            className="flex items-center outline-none focus:outline-none py-4 md:py-10"
          >
            <span className="material-symbols-outlined mx-2">groupAdd</span>
            <p className="hidden md:block">Nuevo Paciente</p>
          </Link>
        </li>
        <li className="flex items-center outline-none focus:outline-none py-4 md:py-10">
          <div className="mx-2">
            <UserButton afterSignOutUrl="/" />
          </div>
          <p className="hidden md:block">Mi Perfil</p>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
