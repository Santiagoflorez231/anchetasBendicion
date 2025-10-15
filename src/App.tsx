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
  const [showAllProducts, setShowAllProducts] = useState(false)

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

  const filteredAnchetas = selectedCategory === 'Todas' 
    ? anchetas 
    : anchetas.filter(ancheta => ancheta.Categoria === selectedCategory)

  const displayedAnchetas = showAllProducts 
    ? filteredAnchetas 
    : filteredAnchetas.slice(0, 6)

  const hasMoreProducts = filteredAnchetas.length > 6

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
              
              <path
                d="M0,30 Q100,12 200,30 T400,30 Q500,48 600,30 T800,30 Q900,15 1000,30 T1200,30 L1200,60 L0,60 Z"
                className="fill-pink-200/60"
              />
              
              <path
                d="M0,38 Q60,28 120,38 T240,38 Q300,50 360,38 T480,38 Q540,32 600,38 T720,38 Q780,52 840,38 T960,38 Q1020,35 1080,38 T1200,38 L1200,60 L0,60 Z"
                className="fill-rose-100/50"
              />
            </svg>
          </div>
        </header>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {categories.length > 1 && (
          <div className="mb-8">
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-3 justify-start sm:justify-center min-w-max sm:min-w-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setShowAllProducts(false) 
                    }}
                    className={`px-4 sm:px-6 py-2.5 rounded-full font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 flex-shrink-0 ${
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
          </div>
        )}

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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {displayedAnchetas.map((ancheta) => (
                <AnchetaCard key={ancheta["Columna 1"]} ancheta={ancheta} />
              ))}
            </div>

            {hasMoreProducts && !showAllProducts && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setShowAllProducts(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-base sm:text-lg"
                >
                  <span>Ver todos los productos</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-sm font-bold">
                    {filteredAnchetas.length}
                  </span>
                </button>
              </div>
            )}

            {showAllProducts && hasMoreProducts && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setShowAllProducts(false)}
                  className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 hover:text-rose-500 font-bold py-3.5 px-7 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md border-2 border-rose-200 text-base"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                  <span>Ver menos</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-16 sm:mt-20 relative">
        <div className="absolute top-0 left-0 right-0 h-16 overflow-visible -mt-16">
          <svg
            className="absolute top-0 w-full h-20"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
         
            
            <path
              d="M0,18 Q75,40 150,18 T300,18 Q400,52 500,18 T700,18 Q800,42 900,18 T1100,18 Q1150,35 1200,18 L1200,80 L0,80 Z"
              className="fill-pink-200/70"
            />
            
            <path
              d="M0,25 Q120,50 240,25 T480,25 Q600,55 720,25 T960,25 Q1080,48 1200,25 L1200,80 L0,80 Z"
              className="fill-rose-100/60"
            />

            <path
              d="M0,35 Q150,60 300,35 T600,35 Q750,65 900,35 T1200,35 L1200,80 L0,80 Z"
              className="fill-white"
            />
          </svg>
        </div>

        <div className="bg-white pt-10 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <div className="bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 rounded-full p-4 shadow-md">
                  <span className="text-5xl">💬</span>
                </div>
              </div>
              
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                ¿Tienes alguna duda?
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                Estamos aquí para ayudarte a elegir el regalo perfecto. 
                Escríbenos por WhatsApp y con gusto resolveremos todas tus preguntas.
              </p>

              <a
                href="https://wa.me/573104418272?text=Hola!%20Tengo%20una%20consulta%20sobre%20las%20anchetas%20%F0%9F%8E%81"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-base sm:text-lg"
              >
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Escríbenos por WhatsApp
              </a>
            </div>

            <div className="flex items-center justify-center my-8">
              <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent w-full max-w-md"></div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs sm:text-sm text-gray-500">
                <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                  Anchetas Bendición
                </span>
                {' '}- Detalles especiales para cada ocasión
              </p>
              <p className="text-xs text-gray-400">
                Hecho con 💖
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
