import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/lib/costo.ts", "src/lib/estadisticas.ts", "src/lib/recomendaciones.ts", "src/lib/validation/registroOperacion.ts", "src/lib/validation/residuo.ts"],
      reporter: ["text", "html", "json-summary"],
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 },
    },
    environment: "node",
    include: ["src/**/*.test.ts"],
    // El módulo predictor es Python y no debe recogerse.
    exclude: ["node_modules", "frontend", "predictor", ".next"],
  },
});
