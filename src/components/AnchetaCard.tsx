import { useState, useEffect } from "react";
import type { Ancheta } from "../types/Ancheta";

interface AnchetaCardProps {
  ancheta: Ancheta;
}

export default function AnchetaCard({ ancheta }: AnchetaCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bloquear/desbloquear scroll del body
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleWhatsAppClick = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Evitar que abra el modal
    const phoneNumber = "573104418272";
    const message = encodeURIComponent(ancheta.Mensaje);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  };

  // Obtener el ID del archivo de Google Drive
  const getFileId = (driveUrl: string): string | null => {
    if (!driveUrl) return null;
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  // Múltiples formatos de URL para intentar
  const getImageUrls = (driveUrl: string): string[] => {
    const fileId = getFileId(driveUrl);
    if (!fileId) return [];

    return [
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
      `https://lh3.googleusercontent.com/d/${fileId}=w1000`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,    ];
  };
  const imageUrls = getImageUrls(ancheta.URL);
  const currentImageUrl = imageUrls[currentUrlIndex] || "";

  useEffect(() => {
    setCurrentUrlIndex(0);
    setImageError(false);
    setImageLoaded(false);
  }, [ancheta.URL]);

  // Timeout de seguridad: si la imagen no carga en tiempo, intenta la siguiente
  useEffect(() => {
    if (currentImageUrl && !imageLoaded && !imageError) {
      const timeout = setTimeout(() => {
        console.warn(
          "⏰ Timeout: La imagen tardó demasiado. Intentando siguiente URL..."
        );

        if (currentUrlIndex < imageUrls.length - 1) {
          const nextIndex = currentUrlIndex + 1;
          console.log(
            `⚠️ Intentando URL alternativa ${nextIndex + 1}/${
              imageUrls.length
            }:`,
            imageUrls[nextIndex]
          );
          setCurrentUrlIndex(nextIndex);
          setImageLoaded(false);
        } else {
          console.error(
            "❌ Timeout: Todas las URLs agotadas para:",
            ancheta.Nombre
          );
          setImageError(true);
        }
      }, 8000);

      return () => clearTimeout(timeout);
    }
  }, [
    currentImageUrl,
    currentUrlIndex,
    imageLoaded,
    imageError,
    imageUrls,
    ancheta.Nombre,
  ]);

  // Intentar con la siguiente URL si falla
  const tryNextUrl = () => {
    if (currentUrlIndex < imageUrls.length - 1) {
      const nextIndex = currentUrlIndex + 1;
      console.log(
        `⚠️ Intentando URL alternativa ${nextIndex + 1}/${imageUrls.length}:`,
        imageUrls[nextIndex]
      );
      setCurrentUrlIndex(nextIndex);
      setImageError(false);
      setImageLoaded(false);
    } else {
      console.error("❌ Todas las URLs fallaron para:", ancheta.Nombre);
      setImageError(true);
      setImageLoaded(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 border border-rose-100 hover:border-rose-200 hover:-translate-y-1 cursor-pointer">
      {/* Imagen - MÁS GRANDE para mayor protagonismo */}
      <div className="relative h-72 sm:h-80 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 overflow-hidden">
        {currentImageUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50/50 via-rose-50/50 to-pink-50/50">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-rose-200 border-t-rose-400"></div>
              </div>
            )}
            <img
              key={`${ancheta["Columna 1"]}-${currentUrlIndex}`}
              src={currentImageUrl}
              alt={ancheta.Nombre}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="eager"
              onLoad={() => {
                console.log(
                  "✅ Imagen cargada correctamente:",
                  ancheta.Nombre,
                  "URL:",
                  currentImageUrl
                );
                setImageLoaded(true);
              }}
              onError={() => {
                console.warn(
                  "⚠️ Error al cargar imagen:",
                  ancheta.Nombre,
                  "URL:",
                  currentImageUrl
                );
                tryNextUrl();
              }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <span className="text-5xl sm:text-6xl mb-3 animate-pulse">🎁</span>
            {imageError && ancheta.URL && (
              <a
                href={ancheta.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-rose-400 hover:text-rose-600 underline text-center transition-colors"
              >
                Ver imagen en Drive
              </a>
            )}
          </div>
        )}
        
        {/* Badge de categoría */}
        {ancheta.Categoria && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-rose-100">
            <span className="text-xs font-semibold text-rose-500">{ancheta.Categoria}</span>
          </div>
        )}
      </div>

      {/* Contenido minimalista */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-display text-lg sm:text-xl font-bold text-gray-800 truncate">
              {ancheta.Nombre}
            </h3>
            <span className="font-display text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
              {ancheta.Precio}
            </span>
          </div>
          
          {/* Botón de acción compacto */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="flex-shrink-0 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md text-sm"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fadeIn flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row overflow-hidden shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-shrink-0 h-[45vh] lg:h-auto lg:w-1/2 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 overflow-hidden">
              {currentImageUrl && !imageError ? (
                <img
                  src={currentImageUrl}
                  alt={ancheta.Nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-7xl lg:text-9xl">🎁</span>
                </div>
              )}
              
              {/* Botón cerrar */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2.5 lg:p-3 hover:bg-white transition-all shadow-lg active:scale-90 z-10"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Badge de categoría */}
              {ancheta.Categoria && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 lg:px-4 lg:py-2 rounded-full shadow-md border border-rose-100">
                  <span className="text-xs lg:text-sm font-semibold text-rose-500">{ancheta.Categoria}</span>
                </div>
              )}
            </div>

            {/* Sección de Información - Derecha en desktop, Abajo en móvil */}
            <div className="flex-1 flex flex-col overflow-hidden lg:w-1/2">
              {/* Contenido scrolleable */}
              <div className="flex-1 overflow-y-auto p-5 lg:p-8">
                {/* Título */}
                <h2 className="font-display text-2xl lg:text-4xl font-bold text-gray-800 mb-2 lg:mb-3">
                  {ancheta.Nombre}
                </h2>

                {/* Precio destacado */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">Precio</p>
                  <span className="font-display text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                    {ancheta.Precio}
                  </span>
                </div>

                {/* Descripción completa */}
                <div className="mb-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    {ancheta.Descripcion}
                  </p>
                </div>
              </div>

              {/* Botón de WhatsApp fijo en la parte inferior */}
              <div className="flex-shrink-0 p-4 lg:p-6 bg-gradient-to-t from-white via-white to-transparent border-t border-gray-100">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 active:scale-95 text-white font-bold py-3.5 lg:py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg text-base lg:text-lg"
                >
                  <svg
                    className="w-6 h-6 lg:w-7 lg:h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Pedir por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
