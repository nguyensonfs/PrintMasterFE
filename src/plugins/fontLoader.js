import ViteFonts from 'unplugin-fonts/vite'

export default function fontLoader() {
  return ViteFonts({
    google: {
      families: [
        {
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        },
        {
          name: 'Montserrat',
          styles: 'ital,wght@0,100..900;1,100..900',
        },
        {
          name: 'Poppins',
          styles:
            'ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
        },
        {
          name: 'Sacramento',
          styles: 'wght@400',
        },
      ],
    },
  })
}
