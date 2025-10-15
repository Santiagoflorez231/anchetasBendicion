import './App.css'
import { useEffect, useState } from 'react'
import type { Ancheta } from './types/Ancheta'
import AnchetaCard from './components/AnchetaCard'

function App() {
  const [anchetas, setAnchetas] = useState<Ancheta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchAnchetas = async () => {
      try {
        const response = await fetch(
          'https://opensheet.elk.sh/1IIWnjXd0TCBAmIBZXFe6oxr9YqsKUkG328_Zq78QkWY/Hoja 1'
        )
        
        if (!response.ok) {
          throw new Error('Error al cargar las anchetas')
        }

        const data = await response.json()
        setAnchetas(data)
        
        // Extraer categorías únicas
        const uniqueCategories = Array.from(
          new Set(data.map((ancheta: Ancheta) => ancheta.Categoria).filter(Boolean))
        ) as string[]
        setCategories(['Todas', ...uniqueCategories])
        
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setLoading(false)
      }
    }

    fetchAnchetas()
  }, [])

  // Filtrar anchetas por categoría
  const filteredAnchetas = selectedCategory === 'Todas' 
    ? anchetas 
    : anchetas.filter(ancheta => ancheta.Categoria === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-rose-400 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Cargando anchetas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-lg p-8 max-w-md w-full text-center border border-rose-100">
          <span className="text-6xl mb-4 block">❌</span>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Oops...</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      {/* Header con efecto derretimiento */}
      <div className="sticky top-0 z-10">
        <header className="relative bg-white shadow-sm">
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-4 sm:py-5">
            <div className="text-center">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 mb-1 tracking-tight">
                🎁 Anchetas Bendición
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-light tracking-wide">
                Detalles especiales para cada ocasión
              </p>
            </div>
          </div>
          
          {/* Borde inferior con efecto derretimiento - ONDAS SUPER PRONUNCIADAS */}
          <div className="absolute bottom-0 left-0 right-0 h-10 overflow-visible -mb-1 z-0">
            <svg
              className="absolute bottom-0 w-full h-12"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 
                CÓMO CONTROLAR LA ALTURA DE LAS ONDAS:
                - Los números en las coordenadas Y (segundo valor) controlan la altura
                - Número MENOR = onda MÁS ALTA (sube más)
                - Número MAYOR = onda MÁS BAJA (baja más)
                - Diferencia entre valores = amplitud de la onda
              */}
              
              {/* Primera capa - ROSADO FUERTE - ondas grandes */}
              <path
                d="M0,25 Q75,5 150,25 T300,25 Q375,40 450,25 T600,25 Q675,8 750,25 T900,25 Q975,45 1050,25 T1200,25 L1200,60 L0,60 Z"
                className="fill-rose-200/70"
              />
              
              {/* Segunda capa - ROSA MEDIO - ondas medianas */}
              <path
                d="M0,30 Q100,12 200,30 T400,30 Q500,48 600,30 T800,30 Q900,15 1000,30 T1200,30 L1200,60 L0,60 Z"
                className="fill-pink-200/60"
              />
              
              {/* Tercera capa - ROSA CLARO - ondas pequeñas para profundidad */}
              <path
                d="M0,38 Q60,28 120,38 T240,38 Q300,50 360,38 T480,38 Q540,32 600,38 T720,38 Q780,52 840,38 T960,38 Q1020,35 1080,38 T1200,38 L1200,60 L0,60 Z"
                className="fill-rose-100/50"
              />
            </svg>
          </div>
        </header>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Filtros de categoría */}
        {categories.length > 1 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2.5 rounded-full font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md'
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-rose-400 border border-rose-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid de anchetas */}
        {filteredAnchetas.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🎁</span>
            <p className="text-lg text-gray-500">
              {selectedCategory === 'Todas' 
                ? 'No hay anchetas disponibles en este momento.' 
                : `No hay anchetas en la categoría "${selectedCategory}".`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredAnchetas.map((ancheta) => (
              <AnchetaCard key={ancheta["Columna 1"]} ancheta={ancheta} />
            ))}
          </div>
        )}
      </main>

      {/* Footer suave */}
      <footer className="mt-16 py-8 text-center">
        <p className="text-sm text-gray-400">
          Hecho con 💖 para Anchetas Bendición
        </p>
      </footer>
    </div>
  )
}

export default App
