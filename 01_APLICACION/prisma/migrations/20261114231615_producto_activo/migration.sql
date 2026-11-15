-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Producto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restauranteId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "costoUnitario" REAL NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Producto_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "Restaurante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Producto" ("costoUnitario", "createdAt", "id", "nombre", "restauranteId") SELECT "costoUnitario", "createdAt", "id", "nombre", "restauranteId" FROM "Producto";
DROP TABLE "Producto";
ALTER TABLE "new_Producto" RENAME TO "Producto";
CREATE INDEX "Producto_restauranteId_idx" ON "Producto"("restauranteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
