"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { User, Lock, Mail, ChevronRight, Github } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-[#121212] relative overflow-hidden transition-colors duration-300">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-10 rounded-4xl bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block group mb-6">
              <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none">
                Papantla
              </span>
              <div className="h-[2px] w-0 group-hover:w-full bg-primary transition-all duration-300" />
            </Link>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isLogin ? "Â¡Hola de nuevo!" : "Crea tu cuenta"}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              {isLogin ? "Accede a tu perfil de viajero" : "Empieza tu aventura en la ciudad sagrada"}
            </p>
          </div>

          <form className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-black/20 outline-none transition-all text-sm"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-black/20 outline-none transition-all text-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-black/20 outline-none transition-all text-sm"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] dark:text-gray-400 hover:text-primary transition-colors">
                  Â¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-[0.2em] shadow-[0_10px_20px_rgba(241,107,36,0.2)] hover:shadow-[0_15px_30px_rgba(241,107,36,0.3)] transition-all flex items-center justify-center gap-2 group"
            >
              {isLogin ? "ENTRAR" : "REGISTRARME"}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <span className="flex-1 h-[1px] bg-gray-100 dark:bg-white/5" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">O continúa con</span>
            <span className="flex-1 h-[1px] bg-gray-100 dark:bg-white/5" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 rounded-2xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-gray-600 dark:text-gray-300">
              <Github className="w-5 h-5 text-black dark:text-white" />
              GitHub
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500 font-medium">
            {isLogin ? "Â¿No tienes cuenta? " : "Â¿Ya tienes cuenta? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-black hover:underline underline-offset-4"
            >
              {isLogin ? "Crea una aquí" : "Inicia sesión"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
