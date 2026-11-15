import {describe,it,expect} from 'vitest';
import {ventaItemSchema,produccionItemSchema,createRegistroOperacionSchema} from './registroOperacion';
import {Turno} from '@/generated/prisma/enums';

describe('G07 validación de cantidades de venta',()=>{
 for(const cantidad of [-100,-1,-0.01,0,NaN,Infinity,-Infinity])
  it(`rechaza cantidad ${cantidad}`,()=>expect(ventaItemSchema.safeParse({concepto:'Ceviche',cantidad,montoTotal:20}).success).toBe(false));
 for(const cantidad of [0.01,0.5,1,2,10,100,1000])
  it(`acepta cantidad positiva ${cantidad}`,()=>expect(ventaItemSchema.safeParse({concepto:'Ceviche',cantidad,montoTotal:20}).success).toBe(true));
 for(const montoTotal of [-100,-1,-0.01,NaN,Infinity])
  it(`rechaza monto ${montoTotal}`,()=>expect(ventaItemSchema.safeParse({concepto:'Ceviche',cantidad:1,montoTotal}).success).toBe(false));
 for(const montoTotal of [0,0.01,20,1000])
  it(`acepta monto no negativo ${montoTotal}`,()=>expect(ventaItemSchema.safeParse({concepto:'Ceviche',cantidad:1,montoTotal}).success).toBe(true));
 it('rechaza concepto vacío',()=>expect(ventaItemSchema.safeParse({concepto:'',cantidad:1,montoTotal:20}).success).toBe(false));
 it('rechaza cantidad textual sin coerción',()=>expect(ventaItemSchema.safeParse({concepto:'Ceviche',cantidad:'2',montoTotal:20}).success).toBe(false));
});
describe('G07 validación de producción',()=>{
 for(const cantidadProducida of [-2,-0.01,0,NaN,Infinity])
  it(`rechaza producción ${cantidadProducida}`,()=>expect(produccionItemSchema.safeParse({productoAsociado:'Ceviche',cantidadProducida}).success).toBe(false));
 for(const cantidadProducida of [0.01,1,20,200])
  it(`acepta producción ${cantidadProducida}`,()=>expect(produccionItemSchema.safeParse({productoAsociado:'Ceviche',cantidadProducida,unidad:'porción'}).success).toBe(true));
 it('rechaza producto vacío',()=>expect(produccionItemSchema.safeParse({productoAsociado:'',cantidadProducida:1}).success).toBe(false));
 it('rechaza unidad explícita vacía',()=>expect(produccionItemSchema.safeParse({productoAsociado:'Ceviche',cantidadProducida:1,unidad:''}).success).toBe(false));
});
describe('G07 registro de operaciones',()=>{
 const base={fecha:'2026-11-14',turno:Object.values(Turno)[0]};
 it('convierte fecha válida',()=>expect(createRegistroOperacionSchema.parse(base).fecha).toBeInstanceOf(Date));
 it('rechaza fecha inválida',()=>expect(createRegistroOperacionSchema.safeParse({...base,fecha:'fecha inválida'}).success).toBe(false));
 it('rechaza turno ajeno al catálogo',()=>expect(createRegistroOperacionSchema.safeParse({...base,turno:'INEXISTENTE'}).success).toBe(false));
 it('rechaza venta inválida dentro del lote',()=>expect(createRegistroOperacionSchema.safeParse({...base,ventas:[{concepto:'Ceviche',cantidad:0,montoTotal:20}]}).success).toBe(false));
 it('rechaza producción inválida dentro del lote',()=>expect(createRegistroOperacionSchema.safeParse({...base,producciones:[{productoAsociado:'Ceviche',cantidadProducida:-1}]}).success).toBe(false));
 it('acepta lote de producción y venta válidas',()=>expect(createRegistroOperacionSchema.safeParse({...base,ventas:[{concepto:'Ceviche',cantidad:2,montoTotal:40}],producciones:[{productoAsociado:'Ceviche',cantidadProducida:3}]}).success).toBe(true));
});
