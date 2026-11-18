"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 text-stone-900 font-sans">
      {/* Header / Navegación */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold text-xl shadow-sm">
              🍽️
            </span>
            <div>
              <span className="text-xl font-bold tracking-tight text-emerald-950 font-display">
                restora
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                v1.0 • Calidad de Software
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <a
              id="nav-frontend-app"
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              Abrir Aplicación Frontend ↗
            </a>
            <a
              id="nav-api-health"
              href="/api/health"
              className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              Estado API
            </a>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Hero Section */}
        <section className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block text-xs uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Plataforma de Gestión Integral
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              Gestión inteligente de residuos para restaurantes turísticos de Arequipa
            </h1>
            <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
              Centraliza la medición, análisis predictivo y valorización de mermas gastronómicas.
              Diseñado para reducir costos operativos y promover la economía circular.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                id="btn-acceder-app"
                href="http://localhost:5173/auth"
                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-all shadow hover:shadow-md"
              >
                Iniciar Sesión / Registro
              </a>
              <a
                id="btn-ver-dashboard"
                href="http://localhost:5173/dashboard"
                className="px-5 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium text-sm transition-all"
              >
                Panel de Control (Dashboard)
              </a>
            </div>
          </div>
        </section>

        {/* Panel Interactivo de Pruebas y Operaciones RESTORA */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Tarjeta 1: Registro Rápido y Selectores */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>📋</span> Control Rápido de Residuos
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Formulario de simulación operativa para pruebas automatizadas Selenium.
              </p>
            </div>

            <form id="form-registro-residuo" className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="busqueda-restora" className="block text-xs font-semibold text-stone-700 mb-1">
                  Buscar producto o residuo
                </label>
                <input
                  id="busqueda-restora"
                  name="q"
                  type="text"
                  placeholder="Ej. Lomo saltado, cáscaras, aceite..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label htmlFor="select-tipo-residuo" className="block text-xs font-semibold text-stone-700 mb-1">
                  Categoría de Residuo (Dropdown Select)
                </label>
                <select
                  id="select-tipo-residuo"
                  name="tipoResiduo"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  <option value="">-- Seleccionar categoría --</option>
                  <option value="ORGANICO_COCINA">Materia Orgánica de Cocina</option>
                  <option value="ACEITE_USADO">Aceite Vegetal Usado</option>
                  <option value="PLASTICO_RECICLABLE">Plástico y Embalaje Reciclable</option>
                  <option value="MERMA_SERVICIO">Merma de Salón y Sobrantes</option>
                </select>
              </div>

              <div>
                <label htmlFor="input-cantidad-kg" className="block text-xs font-semibold text-stone-700 mb-1">
                  Peso Estimado (Kilogramos)
                </label>
                <input
                  id="input-cantidad-kg"
                  name="cantidadKg"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200">
                <div>
                  <span className="block text-xs font-semibold text-stone-800">
                    Alertas de Desperdicio Crítico
                  </span>
                  <span className="block text-[11px] text-stone-500">
                    Notificar al administrador si excede el umbral diario
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="toggle-alertas-criticas"
                    role="switch"
                    aria-checked="true"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <button
                type="button"
                id="btn-guardar-registro"
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
              >
                Registrar Operación en Restora
              </button>
            </form>
          </div>

          {/* Tarjeta 2: Módulos del Sistema y Estado */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>⚙️</span> Servicios y Módulos Activos
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Arquitectura de endpoints y componentes de calidad de software.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg border border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-stone-800">Backend API REST</h3>
                  <p className="text-[11px] text-stone-500">Endpoints Next.js App Router (Puerto 3000)</p>
                </div>
                <span id="badge-api-status" className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Activo (200 OK)
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-stone-800">Frontend SPA (TanStack)</h3>
                  <p className="text-[11px] text-stone-500">Vite + TanStack Router (Puerto 5173)</p>
                </div>
                <span id="badge-frontend-status" className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                  Activo (5173)
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-stone-800">Base de Datos Local</h3>
                  <p className="text-[11px] text-stone-500">SQLite + Prisma ORM (dev.db)</p>
                </div>
                <span id="badge-db-status" className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Sincronizado
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-stone-800">Motor Predictivo ML</h3>
                  <p className="text-[11px] text-stone-500">Python 3.14 + Scikit-Learn (Predictor)</p>
                </div>
                <span id="badge-ml-status" className="px-2.5 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                  Disponible
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <span className="block text-xs font-semibold text-stone-700 mb-2">
                Accesos directos de prueba:
              </span>
              <div className="flex flex-wrap gap-2">
                <Link
                  id="link-acceso-catalogo"
                  href="http://localhost:5173/catalogo"
                  className="text-xs px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                >
                  Catálogo
                </Link>
                <Link
                  id="link-acceso-reportes"
                  href="http://localhost:5173/reports"
                  className="text-xs px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                >
                  Reportes
                </Link>
                <Link
                  id="link-acceso-predicciones"
                  href="http://localhost:5173/predict"
                  className="text-xs px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                >
                  Predicciones
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-stone-500 space-y-1">
          <p>© 2026 RESTORA — Sistema de Gestión Inteligente de Residuos Orgánicos para Arequipa</p>
          <p>Universidad Nacional de San Agustín • Escuela Profesional de Ingeniería de Sistemas</p>
        </div>
      </footer>
    </div>
  );
}
