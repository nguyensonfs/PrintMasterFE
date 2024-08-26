// Plugins
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import fontLoader from './src/plugins/fontLoader'

// Utilities
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // Cấu hình Vue với Vuetify để xử lý các asset URLs trong template
    Vue({
      template: { transformAssetUrls },
    }),

    // Font loader plugin
    fontLoader(),

    // Vuetify plugin với tự động import các component
    Vuetify({
      autoImport: true,
    }),

    // Tự động import các component và stores
    Components({
      dirs: ['src/components', 'src/stores'],
      extensions: ['vue', 'js'],
      deep: true,
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'vue-toastification': ['useToast'],
        },
        'vee-validate',
      ],
    }),
  ],

  // Alias và extensions
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Alias cho thư mục src
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'], // Hỗ trợ nhiều loại file
  },

  // Cấu hình server
  server: {
    port: 5173, // Port tùy chỉnh cho server
  },
})
