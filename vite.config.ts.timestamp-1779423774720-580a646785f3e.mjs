// vite.config.ts
import legacy from "file:///C:/xampp/htdocs/benny-cards-mobile-app/node_modules/.pnpm/@vitejs+plugin-legacy@5.4.3_b23e0a94fea280b2c50cb89955189847/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import react from "file:///C:/xampp/htdocs/benny-cards-mobile-app/node_modules/.pnpm/@vitejs+plugin-react@4.7.0__95e93033bcb1a9ffc3a02dca37ebf698/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///C:/xampp/htdocs/benny-cards-mobile-app/node_modules/.pnpm/@tailwindcss+vite@4.2.4_vit_a0b03b32050c198381c0e57a62756601/node_modules/@tailwindcss/vite/dist/index.mjs";
import { defineConfig } from "file:///C:/xampp/htdocs/benny-cards-mobile-app/node_modules/.pnpm/vite@5.4.21_@types+node@25._0aa3e4af1d6937e41a338caf5b7b0b4b/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  server: {
    port: 5174,
    strictPort: true,
    host: true
  },
  envPrefix: ["VITE_", "API_"],
  plugins: [
    tailwindcss(),
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcYmVubnktY2FyZHMtbW9iaWxlLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxceGFtcHBcXFxcaHRkb2NzXFxcXGJlbm55LWNhcmRzLW1vYmlsZS1hcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3hhbXBwL2h0ZG9jcy9iZW5ueS1jYXJkcy1tb2JpbGUtYXBwL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5cclxuaW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDUxNzQsXHJcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgaG9zdDogdHJ1ZSxcclxuICB9LFxyXG4gIGVudlByZWZpeDogWydWSVRFXycsICdBUElfJ10sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdGFpbHdpbmRjc3MoKSxcclxuICAgIHJlYWN0KCksXHJcbiAgICBsZWdhY3koKVxyXG4gIF0sXHJcbiAgdGVzdDoge1xyXG4gICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgc2V0dXBGaWxlczogJy4vc3JjL3NldHVwVGVzdHMudHMnLFxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLE9BQU8sWUFBWTtBQUNuQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxvQkFBb0I7QUFHN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFdBQVcsQ0FBQyxTQUFTLE1BQU07QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLEVBQ2Q7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
