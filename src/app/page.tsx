export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-koara-bg">
      <div className="p-8 rounded-2xl bg-white shadow-md text-center border border-koara-primary/30">
        <h1 className="text-3xl font-bold text-koara-dark mb-2">
          Koara Skincare 🌸
        </h1>
        <p className="text-gray-600 max-w-sm">
          El frontend se ha inicializado con éxito usando Tailwind v4. ¡El lienzo está listo para maquetar el back-office!
        </p>
        <button className="mt-6 px-6 py-2 rounded-xl bg-koara-dark text-white font-semibold hover:bg-koara-accent transition-colors shadow-sm">
          Iniciar Sistema
        </button>
      </div>
    </div>
  );
}