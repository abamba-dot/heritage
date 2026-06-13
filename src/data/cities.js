export const cities = [
  {
    id: 'abidjan',
    name: 'ABIDJAN',
    country: "CÔTE D'IVOIRE",
    code: '225',
    coordinates: "5°19'N 4°02'W",
    tagline: "LA LAGUNE, NOTRE HÉRITAGE",
    theme: {
      background: '#0F1A12',
      primary: '#1E4D2B',
      accent: '#D4AF37',
      textOnBg: '#F5F0E1',
    },
    assets: {
      heroDecor: '/images/abidjan.png',
      heroDecorMobile: '/images/abidjanmobile.png',
      monumentSilhouette: '/images/abidjan-monument.svg',
      cityIcon: '/images/abidjan-palm.svg',
    },
    silhouettePosition: 'left',
  },
  {
    id: 'casa',
    name: 'CASABLANCA',
    country: 'MAROC',
    code: '212',
    coordinates: "33°35'N 7°36'W",
    tagline: "L'OCÉAN, NOTRE HÉRITAGE",
    theme: {
      background: '#F2EDE4',
      primary: '#2A5C3E',
      accent: '#C9A227',
      textOnBg: '#1A1A1A',
    },
    assets: {
      heroDecor: '/images/casa.png',
      heroDecorMobile: '/images/casamobile.png',
      monumentSilhouette: '/images/casa-minaret.svg',
      cityIcon: '/images/casa-mosque.svg',
    },
    silhouettePosition: 'right',
  },
  {
    id: 'libreville',
    name: 'LIBREVILLE',
    country: 'GABON',
    code: '241',
    coordinates: "0°23'N 9°27'E",
    tagline: "L'ATLANTIQUE, NOTRE HÉRITAGE",
    theme: {
      background: '#080C10',
      primary: '#0F1E30',
      accent: '#D4AF37',
      textOnBg: '#E8E0D0',
    },
    assets: {
      heroDecor: '/images/libreville.png',
      heroDecorMobile: '/images/librevillesmobile.png',
      monumentSilhouette: '/images/libreville-monument.svg',
      cityIcon: '/images/libreville-skyline.svg',
    },
    silhouettePosition: 'left',
  },
]

export const getCityById = (id) => cities.find((city) => city.id === id)
