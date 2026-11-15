from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pathlib import Path
import openpyxl

base=Path('proyecto-Calidad/02_GUIAS_CALIDAD/G06_RIESGOS')
report=base/'Lab06_Calidad de Software_Ajra_Barrios_Hancco_Valdivia.docx'
wb=openpyxl.load_workbook(base/'Matriz_Riesgos_RESTORA_G06.xlsx',data_only=False)
doc=Document(report)
doc.tables[0].cell(4,1).text='15/11/2026'
doc.tables[0].cell(5,0).text='INTEGRANTE (s):\nJeans Anthony Ajra Huacso\nMathias Alonso Barrios Medina\nSergio Danilo Hancco Mullisaca\nRyan Fabian Valdivia Segovia'
doc.tables[0].cell(6,0).text='DOCENTE(s):\nJESUS MARTIN SILVA FERNANDEZ'
cell=doc.tables[1].cell(1,0)
for child in list(cell._tc):
    if child.tag!=qn('w:tcPr'): cell._tc.remove(child)
cell.add_paragraph()
tr=doc.tables[1].rows[1]._tr.get_or_add_trPr()
for e in list(tr):
    if e.tag==qn('w:cantSplit'): tr.remove(e)
RED='C00000'; PURPLE='6A3A7B'; DARK='242226'
def para(text='',align=WD_ALIGN_PARAGRAPH.JUSTIFY,size=11.5,after=8,italic=False):
    p=cell.add_paragraph(); p.alignment=align; p.paragraph_format.space_after=Pt(after); p.paragraph_format.line_spacing=1.08
    r=p.add_run(text); r.font.name='Times New Roman'; r.font.size=Pt(size); r.font.color.rgb=RGBColor.from_string(DARK); r.italic=italic
    return p
def heading(text,sub=False):
    p=cell.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.LEFT; p.paragraph_format.keep_with_next=True; p.paragraph_format.space_before=Pt(9); p.paragraph_format.space_after=Pt(4)
    r=p.add_run(text); r.bold=True; r.font.name='Times New Roman'; r.font.size=Pt(11.5 if sub else 13); r.font.color.rgb=RGBColor.from_string(RED)
def table(headers,rows,widths,font=8):
    t=cell.add_table(rows=1,cols=len(headers)); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.autofit=False
    pr=t._tbl.tblPr; bd=OxmlElement('w:tblBorders')
    for edge in ('top','left','bottom','right','insideH','insideV'):
        e=OxmlElement('w:'+edge); e.set(qn('w:val'),'single'); e.set(qn('w:sz'),'5'); e.set(qn('w:color'),'777777'); bd.append(e)
    pr.append(bd)
    def fill(row,vals,head=False,shade=False):
        for j,v in enumerate(vals):
            c=row.cells[j]; c.text='' if v is None else str(v); c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
            tcpr=c._tc.get_or_add_tcPr()
            if head or shade:
                s=OxmlElement('w:shd'); s.set(qn('w:fill'),PURPLE if head else 'F4F2F5'); tcpr.append(s)
            for p in c.paragraphs:
                p.paragraph_format.space_after=Pt(1); p.paragraph_format.line_spacing=1.0; p.alignment=WD_ALIGN_PARAGRAPH.CENTER if head else WD_ALIGN_PARAGRAPH.LEFT
                for r in p.runs:
                    r.font.name='Times New Roman'; r.font.size=Pt(font); r.bold=head
                    if head: r.font.color.rgb=RGBColor(255,255,255)
            c.width=Inches(widths[j])
    fill(t.rows[0],headers,True); rep=OxmlElement('w:tblHeader'); rep.set(qn('w:val'),'true'); t.rows[0]._tr.get_or_add_trPr().append(rep)
    for i,row in enumerate(rows):
        rr=t.add_row(); fill(rr,row,False,i%2==1)
        tr=rr._tr.get_or_add_trPr()
        for e in list(tr):
            if e.tag==qn('w:cantSplit'): tr.remove(e)
    for row in t.rows:
        for j,w in enumerate(widths): row.cells[j].width=Inches(w)
    return t
def figure(path,caption,width=5.8):
    p=cell.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after=Pt(2); p.add_run().add_picture(str(path),width=Inches(width))
    p=cell.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after=Pt(7)
    r=p.add_run(caption); r.italic=True; r.font.name='Times New Roman'; r.font.size=Pt(9)

doc.styles['Normal'].font.name='Times New Roman'; doc.styles['Normal'].font.size=Pt(11.5)
for s in doc.sections:
    s.page_width=Inches(8.27); s.page_height=Inches(11.69); s.top_margin=Inches(.65); s.bottom_margin=Inches(.65); s.left_margin=Inches(.72); s.right_margin=Inches(.72)

heading('I. OBJETIVOS')
para('Objetivo general. Aplicar un proceso estructurado de gestión de riesgos al sistema RESTORA: identificar activos y amenazas, estimar y priorizar escenarios, proponer tratamientos y evaluar las capacidades de PILAR Basic y Pirani, documentando evidencias y límites reales.')
para('Objetivos específicos: inventariar activos y dependencias; construir escenarios con criterios P/I explícitos; registrar riesgos en Pirani y revisar PILAR; proponer controles con responsable, plazo e indicador; responder el cuestionario de la guía.',WD_ALIGN_PARAGRAPH.LEFT)

heading('II. DESCRIPCIÓN DEL PROCEDIMIENTO REALIZADO EN LA PRÁCTICA')
heading('1. Revisión de guía, fuentes y alcance',True)
para('El enunciado solicita revisar plan_riesgo.xls, consultar MAGERIT, instalar una herramienta de gestión, implementar el ejemplo y comparar RMAT con PILAR. En LAB06 se encontró Plan_Riesgo_Guia_6_Alumnos.xlsx; su contenido lo identifica como una plantilla docente nueva, no como el plan_riesgo.xls citado. El PDF no define el término RMAT. Ambas diferencias quedan documentadas y no se atribuye al archivo presente otra procedencia.')
para('El alcance RESTORA cubre interfaz, API, cuentas/sesiones, SQLite/Prisma, registros de ventas/producción/desperdicio, catálogo, entregas, reportes, asistente IA, predictor Python, configuración, dependencias y operación humana. Se revisaron README.md, ARCHITECTURE.md, esquema Prisma y código seleccionado. Es una revisión documental y estática: no se examinó producción, hosting, contratos ni datos reales, y no equivale a pentest ni a una auditoría completa.')
heading('2. Método y escalas',True)
para('Se registraron 15 activos con dependencias y valores relativos de confidencialidad, integridad, disponibilidad y autenticidad (C/I/D/A). Se planteó horizonte de 12 meses; P e I usan una escala de 1 a 5 basada en la hoja de práctica. El índice P×I es ordinal, no una frecuencia medida ni una pérdida monetaria. No se descontó la eficacia de controles sin evidencia. Los residuales del plan son metas después de implantar y probar las acciones.')
table(['P','Probabilidad orientativa en 12 meses','I','Consecuencia orientativa'],[['1','Hasta 5 %','1','<1 h, sin afectación relevante'],['2','>5–20 %','2','1 a <4 h; corrección local'],['3','>20–50 %','3','4 a <8 h o corrección importante'],['4','>50–80 %','4','8 a 24 h o alteración relevante'],['5','>80 %','5','>24 h o divulgación/alteración masiva']],[.4,2.65,.4,2.65],8)
para('Bandas de la hoja: 1–4 Bajo, 5–9 Moderado, 10–16 Alto, 17–25 Crítico; el máximo aceptable indicado es 4. Son criterios didácticos para esta evaluación, no una política aprobada por RESTORA.')
heading('3. Activos y dependencias',True)
para('Los valores relativos resaltan datos, API, sesión y configuración por su efecto sobre ventas, desperdicio, acceso y continuidad. Las URL de evidencias no se trataron como archivos protegidos porque el almacenamiento no se acreditó. Los valores son preliminares y deben validarse con propietarios funcionales.')
ar=[]
for r in wb['Activos RESTORA'].iter_rows(min_row=5,max_row=19,values_only=True):
    aid,n,typ,owner,deps,c,i,d,a,j=r; ar.append([aid,n,deps,f'C{c}/I{i}/D{d}/A{a}',j])
table(['ID','Activo','Dependencias','C/I/D/A','Justificación'],ar,[.42,1.35,1.05,1.0,2.28],7.6)
heading('4. Escenarios, evaluación y tratamiento',True)
para('Se construyeron 30 escenarios sobre autenticación y autorización, continuidad y acceso a datos, validación, CSV, IA, predictor, reportes, dependencias y operación. Cada fila identifica evento, condición posible, dimensiones, P/I, controles observados, tratamiento, responsable funcional, plazo, esfuerzo e indicador. Un escenario potencial no demuestra que el evento haya ocurrido. El código revisado muestra una verificación de restauranteId en el módulo requireSession y las rutas observadas; no se verificaron dinámicamente todos los endpoints. También se detectó estáticamente que el serializador CSV escapa delimitadores y comillas, pero no neutraliza los prefijos de fórmula; no se ejecutó un payload.')
risk=[]
for r in wb['Registro de riesgos'].iter_rows(min_row=5,max_row=34,values_only=True):
    rid,asset,event,cond,dims,p,i,*tail=r; score=int(p*i); lvl='Crítico' if score>=17 else 'Alto' if score>=10 else 'Moderado' if score>=5 else 'Bajo'; risk.append([rid,event+'. '+cond,f'P{p} × I{i} = {score} · {lvl}'])
for k in (0,15): table(['ID','Evento y condición analizada','Estimación'],risk[k:k+15],[.48,5.18,1.08],7.4)
para('El registro de cálculo, evidencia estática y salvaguardas aparece íntegro en la hoja “Registro de riesgos”. El plan de las 12 prioridades está en “Tratamiento”; sus propuestas aún requieren aprobación, ejecución y prueba.')
heading('5. Pirani Free',True)
para('En la cuenta Pirani Free se registraron doce escenarios RESTORA, códigos ORM-4 a ORM-15. Once aparecen Medium y uno High en la matriz ORM de Pirani. Son estimaciones de esa herramienta, con criterios propios; no corresponden a la escala P×I de la hoja de cálculo ni a una medición estadística. Se dejaron sin controles asociados y sin grupo responsable, por lo que el residual permanece igual al inherente. Cada descripción identifica un escenario potencial y no un incidente confirmado.')
table(['Código','Escenario registrado en Pirani','Inherente / residual'],[
['ORM-4','Acceso no autorizado a ventas e inventario','Medium / Medium'],
['ORM-5','Exposición de datos operativos al proveedor de IA','Medium / Medium'],
['ORM-6','Pérdida de datos sin recuperación comprobada','High / High'],
['ORM-7','Inventario desactualizado en planificación de producción','Medium / Medium'],
['ORM-8','Inyección de fórmulas al abrir exportaciones CSV','Medium / Medium'],
['ORM-9','Exposición de cuenta de demostración en entorno público','Medium / Medium'],
['ORM-10','Ejecución de carga semilla sobre datos operativos','Medium / Medium'],
['ORM-11','Bloqueo de análisis por proceso Python sin timeout','Medium / Medium'],
['ORM-12','Acceso operativo sin separación comprobada por rol','Medium / Medium'],
['ORM-13','Sesión accesible desde dispositivo compartido','Medium / Medium'],
['ORM-14','Diferencias entre operaciones y reportes simultáneos','Medium / Medium'],
['ORM-15','Indisponibilidad del proveedor externo de IA','Medium / Medium']],[.72,4.85,1.18],7.8)
figure(base/'EVIDENCIAS/PIRANI/Pirani_Matriz_Riesgos.png','Figura 1. Pirani ORM muestra 12 riesgos guardados de un límite de 200 registros del plan Free.',5.8)
para('La captura siguiente detalla ORM-6: impacto Severe (80 %) y probabilidad Possible (60 %), con nivel High inherente y residual. La estimación se conserva sin reducción porque no hay control registrado; no significa que haya ocurrido pérdida de datos.')
figure(base/'EVIDENCIAS/PIRANI/Pirani_ORM06_Perfil_Riesgo_Alto.png','Figura 2. Ficha ORM-6: pérdida de datos sin recuperación comprobada.',5.65)
para('ORM-5 representa exposición potencial del contexto enviado al proveedor externo de IA. La ficha evidencia Major (60 %) y Possible (60 %); se debe validar minimización del contexto, retención del proveedor y mecanismo de fallback.')
figure(base/'EVIDENCIAS/PIRANI/Pirani_ORM05_Proveedor_IA.png','Figura 3. Ficha ORM-5: exposición potencial de información operativa al proveedor de IA.',5.65)
para('ORM-8 registra el riesgo potencial en exportaciones CSV: datos que empiecen con caracteres interpretables como fórmula requieren neutralización antes de abrirse en hojas de cálculo. La clasificación Medium de Pirani no equivale a una explotación verificada.')
figure(base/'EVIDENCIAS/PIRANI/Pirani_ORM08_Riesgo_CSV.png','Figura 4. Ficha ORM-8: exportaciones CSV e inyección de fórmulas potencial.',5.65)
para('ORM-11 se relaciona con el puente a Python inspeccionado en el código. El escenario plantea indisponibilidad si un proceso externo se bloquea; no se ejecutó una prueba de estrés ni se observó un bloqueo real.')
figure(base/'EVIDENCIAS/PIRANI/Pirani_ORM11_Proceso_Python.png','Figura 5. Ficha ORM-11: posible bloqueo del proceso Python.',5.65)
para('ORM-12 trata la separación de responsabilidades. El modelo de datos incluye colaboradores operativos, pero la revisión no comprobó un sistema completo de roles para cada operación; por eso se presenta como riesgo a validar, no como acceso indebido comprobado.')
figure(base/'EVIDENCIAS/PIRANI/Pirani_ORM12_Acceso_por_Rol.png','Figura 6. Ficha ORM-12: separación de acceso por rol pendiente de validación.',5.65)
para('El tablero resume la distribución de los doce registros en la matriz de calor propia de Pirani. Sus celdas y colores son una visualización ORM de la plataforma, no el resultado de MAGERIT ni de la matriz auxiliar.')
figure(base/'EVIDENCIAS/PIRANI/Pirani_Dashboard_Mapa_Calor.png','Figura 7. Panel de Pirani con mapa de calor de riesgos.',5.8)
para('El panel de reportes muestra el mapa de calor disponible y señala que el perfil de riesgos por procesos pertenece a un plan superior. La limitación observada reduce las salidas que pueden consultarse en la cuenta Free.')
figure(base/'EVIDENCIAS/PIRANI/Pirani_Reportes_Dashboard.png','Figura 8. Reportes de Pirani: mapa de calor y capacidad por procesos limitada por el plan.',5.8)
heading('6. PILAR Basic',True)
para('Se creó y abrió en PILAR Basic 2026.1.1 un proyecto nuevo con código RESTORA-G06 y nombre “RESTORA - Gestión de riesgos G06”, sin modificar las vistas de ejemplo. La captura del árbol confirma el contexto de trabajo RESTORA. Se revisaron las pantallas de contexto RGPD, dominios de seguridad, identificación de activos y valoración de dominios.')
figure(base/'EVIDENCIAS/PILAR/PILAR_Proyecto_RESTORA.png','Figura 9. Árbol del proyecto RESTORA-G06 abierto en PILAR Basic.',5.65)
para('La vista de contexto RGPD presenta categorías para roles, necesidad, ciclo de vida, necesidad y proporcionalidad. Se inspeccionó la navegación, pero no se cargaron datos personales ni se hizo una evaluación jurídica.')
figure(base/'EVIDENCIAS/PILAR/PILAR_Contexto_RGPD.png','Figura 10. Categorías de contexto RGPD disponibles en PILAR.',5.65)
para('En Dominios de seguridad se observa el dominio base de la biblioteca. Esta pantalla confirma la estructura inicial del modelo, pero no aporta por sí sola una valoración de los activos de RESTORA.')
figure(base/'EVIDENCIAS/PILAR/PILAR_Dominios_Seguridad.png','Figura 11. Dominio base disponible en PILAR para organizar el análisis.',5.65)
para('La identificación de activos quedó vacía: no se registraron en esta sesión los 15 activos de la matriz auxiliar. Por esa razón no se generó un cruce RESTORA activo-amenaza en PILAR.')
figure(base/'EVIDENCIAS/PILAR/PILAR_Identificacion_Activos.png','Figura 12. Pantalla de identificación de activos sin elementos RESTORA cargados.',5.65)
para('La valoración de dominios muestra el proyecto, el servicio esencial y el dominio Base, con las columnas de dimensiones sin valores. Al continuar, PILAR informó cero servicios esenciales. Ambos resultados confirman que el modelo no llegó a una valoración de riesgo.')
figure(base/'EVIDENCIAS/PILAR/PILAR_Valoracion_Dominios.png','Figura 13. Valoración de dominios sin puntuaciones asignadas.',5.65)
figure(base/'EVIDENCIAS/PILAR/PILAR_Aviso_Dominios_Sin_Activos.png','Figura 14. Mensaje de PILAR: “Información y servicios esenciales: 0”.',5.65)
para('La sesión no dejó un archivo .mgr ni un informe de riesgo exportado que pueda verificarse en la carpeta de evidencias. Por tanto, la ejecución de PILAR queda documentada como configuración del proyecto y exploración de sus vistas, con carga de activos, análisis, tratamiento y exportación pendientes. No se atribuye a PILAR ninguna puntuación que la aplicación no haya calculado. El manual oficial indica que la identificación debe completarse con activos y que la valoración usa sus dominios [8].')
heading('7. Comparación y estado de controles',True)
para('La matriz auxiliar permite auditar manualmente activos, escenarios y P×I; PILAR ofrece modelado de activos/amenazas/salvaguardas; Pirani permite capturar impacto/frecuencia y visualizar sus niveles ORM. Sus escalas no son equivalentes. La hoja Comparativa detalla cobertura y límites. Se propusieron 12 tratamientos con responsables funcionales, días desde aprobación, esfuerzo e indicadores. Todos siguen pendientes; no se afirma eficacia ni reducción real.')

heading('III. RESULTADOS OBTENIDOS')
para('La matriz contiene 15 activos y 30 escenarios: 16 altos, 14 moderados, cero críticos y cero bajos bajo los criterios adoptados. Pirani registra 12 riesgos (11 Medium y 1 High en su matriz ORM). En PILAR se creó el proyecto RESTORA-G06, pero la identificación de activos permanece vacía y la herramienta indicó cero servicios esenciales; no existe una matriz propia calculada. La lectura estática confirmó controles de autenticación presentes en los fragmentos revisados y señaló el riesgo potencial de fórmula en CSV, que requiere corrección y prueba.')
figure(base/'RESULTADOS/QA_Resumen.png','Figura 15. Recuento calculado en la matriz editable; no es una medición de incidentes.',6.0)
table(['Resultado','Estado y límite'],[['Activos/escenarios','15 activos y 30 escenarios documentados en el XLSX.'],['Priorización auxiliar','16 altos y 14 moderados según P×I ordinal.'],['Pirani','12 escenarios guardados; clasificación propia ORM, sin controles asociados.'],['PILAR','Proyecto RESTORA-G06 abierto; 0 servicios esenciales y 0 activos identificados. No se exportó .mgr verificable.'],['Tratamientos','12 propuestos; ninguno implementado/verificado en esta guía.']],[1.35,5.4],8)

heading('IV. ANÁLISIS DE RESULTADOS')
para('La autorización por restaurante reduce riesgo cuando cada ruta verifica el tenant; el módulo requireSession y las rutas de productos/operaciones revisadas realizan esa comparación. Se conserva un escenario de regresión para rutas no revisadas o futuras, y se recomienda probar 401/403 entre dos cuentas. OWASP destaca que cada endpoint que acepta identificadores debe verificar autorización a nivel del objeto [6].')
para('La continuidad SQLite es prioritaria porque el README describe una base local y no se halló evidencia de copias restaurables en los archivos revisados. La medida debe incluir copia protegida, retención, responsable, restauración en entorno aislado y objetivos RPO/RTO. Sin la restauración real, no hay evidencia para reducir la valoración residual.')
para('El contexto conversacional agrega una frontera con proveedores externos. El código consultado construye contexto con productos, colaboradores, ventas e indicadores y lo envía cuando hay claves IA. La cascada con fallback ayuda ante indisponibilidad, pero no resuelve minimización, condiciones de retención ni revisión humana de recomendaciones; estos puntos requieren decisión del equipo antes de producción.')
para('Los índices de la hoja docente no deben compararse directamente con los niveles de Pirani ni con los resultados internos de PILAR. ISO 31000 recomienda adaptar criterios al contexto y mantener monitoreo, revisión y comunicación de incertidumbre [2]. NIST SP 800-30 relaciona amenazas, vulnerabilidades, probabilidad e impacto, y subraya que la evaluación depende de información disponible [3].')

heading('V. CUESTIONARIO')
heading('a) ¿Qué atributos de riesgo se debe conocer?',True)
para('Activo y propietario, evento, amenaza, condición/vulnerabilidad, dependencias, probabilidad en un horizonte explícito, impacto por dimensión, salvaguardas existentes y evidencia de eficacia, riesgo residual, criterio de aceptación, responsable de decidir e incertidumbre. MAGERIT relaciona activos, amenazas y salvaguardas para estimar impacto y riesgo potencial/residual [1]. NIST complementa con contexto, probabilidad, impacto e incertidumbre de evaluación [3].')
heading('b) ¿Cuál sería el protocolo para mitigar riesgos?',True)
para('Definir alcance y criterios; identificar activos, dependencias y propietarios; describir escenarios; estimar y comparar riesgos; decidir evitar, reducir, compartir o aceptar; asignar una acción, control, responsable, fecha, esfuerzo e indicador; implantar; probar y conservar evidencia; recalcular el residual; y comunicar/monitorear periódicamente. ISO 31000 presenta identificación, análisis, evaluación, tratamiento, monitoreo/revisión y comunicación como proceso integrado [2].')
para('NIST CSF 2.0 organiza la gestión mediante Govern, Identify, Protect, Detect, Respond y Recover, para sostener las decisiones en el tiempo [5]. Para RESTORA, los ejemplos son pruebas negativas multi-tenant, retirar credenciales demo antes de producción, restaurar copias y neutralizar prefijos de fórmulas en CSV. En este informe son acciones propuestas, no ejecutadas.')
heading('c) ¿Para qué sirve MAGERIT? Indique sus limitaciones.',True)
para('MAGERIT estructura el análisis de sistemas de información mediante activos, dependencias, amenazas, salvaguardas, impacto y riesgo; ayuda a justificar decisiones de tratamiento y residual [1]. La metodología no garantiza seguridad ni sustituye datos adecuados, pruebas, responsables o decisiones de aceptación. Si la evidencia es escasa, la escala cualitativa expresa juicio, no probabilidad estadística ni pérdida monetaria; la guía de la materia también advierte que el análisis cuantitativo depende de validar los datos [3].')
para('PILAR automatiza partes del análisis MAGERIT; en esta ejecución solo quedó abierto un proyecto vacío y no se obtuvo un .mgr verificable. Pirani registra 12 escenarios con clasificación propia y permite ver el mapa de calor; el plan Free muestra 200 registros e indica que algunas vistas, como el perfil por procesos, requieren un nivel superior [4]. Las escalas y resultados de ambas herramientas no son intercambiables. La identificación de activos es un paso previo necesario en PILAR [8].')

heading('VI. CONCLUSIONES')
for s in [
'El análisis adaptó la Guía 06 a RESTORA y documentó 15 activos relacionados con API, autenticación, SQLite, operaciones, IA, predictor y operación del restaurante. Es una línea base cualitativa que requiere validación con propietarios funcionales.',
'Se registraron 30 escenarios con justificación P/I y tratamiento propuesto. La distribución es 16 altos y 14 moderados bajo las bandas elegidas; no demuestra incidentes ni tasas observadas.',
'Pirani conserva doce escenarios potenciales en su matriz ORM; los doce carecen de controles asociados. PILAR tiene un proyecto RESTORA-G06 abierto, pero la sesión no cargó activos ni generó una valoración o archivo .mgr verificable.',
'Las prioridades incluyen autorización por tenant, credenciales y secretos, recuperación SQLite, exportación CSV y exposición a proveedores IA. Todos los controles siguen pendientes; no corresponde afirmar reducción hasta su implantación y verificación.'
]: para(s)

heading('VII. RECOMENDACIONES')
for s in [
'Completar la carga de activos y dependencias en PILAR, asignar dimensiones y amenazas, evaluar salvaguardas y guardar/exportar el modelo .mgr y sus informes a EVIDENCIAS/PILAR.',
'Consultar al docente qué archivo/herramienta designa RMAT: el PDF no define el término y el archivo local es una plantilla XLSX distinta del plan_riesgo.xls citado.',
'Antes de producción, retirar cuenta demo y secreto de ejemplo; revisar todas las rutas con pruebas negativas entre restaurantes.',
'Definir copias cifradas, retención, RPO/RTO y realizar restauraciones periódicas con reconciliación de registros.',
'Neutralizar prefijos de fórmula en CSV y verificar el archivo descargado con datos de prueba.',
'Minimizar contexto IA, revisar retención de proveedores y mantener aprobación humana de recomendaciones.',
'Asignar responsables nominales y fechas reales a los tratamientos y revisar la matriz cuando cambie arquitectura, proveedor o proceso.'
]: para('• '+s,after=4)

heading('VIII. REFERENCIAS Y BIBLIOGRAFÍA')
refs=[
'[1] Ministerio de Hacienda y Administraciones Públicas, “MAGERIT versión 3: Libro I — Método,” 2012. [En línea]. https://pilar.ccn-cert.cni.es/docman/documentos/1-magerit-v3-libro-i-metodo/file. [Accedido: 15-nov-2026].',
'[2] International Organization for Standardization, “ISO 31000:2018 Risk management — Guidelines,” 2.ª ed., feb. 2018. [En línea]. https://www.iso.org/standard/31000. [Accedido: 15-nov-2026].',
'[3] Joint Task Force Transformation Initiative, “Guide for Conducting Risk Assessments,” NIST SP 800-30 Rev. 1, sep. 2012. doi: 10.6028/NIST.SP.800-30r1.',
'[4] Pirani, “¿Qué puedo hacer en el Plan Free de Pirani?” [En línea]. https://help.piranirisk.com/es/que-puedo-hacer-en-el-plan-free-de-pirani. [Accedido: 15-nov-2026].',
'[5] National Institute of Standards and Technology, “The NIST Cybersecurity Framework (CSF) 2.0,” NIST CSWP 29, 26-feb-2024. doi: 10.6028/NIST.CSWP.29.',
'[6] OWASP Foundation, “API1:2023 Broken Object Level Authorization,” OWASP API Security Top 10 2023. [En línea]. https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/. [Accedido: 15-nov-2026].',
'[7] RESTORA, README.md, ARCHITECTURE.md, esquema Prisma y código fuente de 01_APLICACION, revisión estática del proyecto, 15-nov-2026.',
'[8] PILAR Basic 2026, “Datos del proyecto” y “Activos / Identificación,” documentación oficial. [En línea]. https://www.pilar-tools.com/doc/v2026/pilar_basic/help_es/Datosdelproyecto.html y https://www.pilar-tools.com/doc/v2026/pilar_basic/help_es/ActivosIdentificacion.html. [Accedido: 15-nov-2026].'
]
for s in refs: para(s,WD_ALIGN_PARAGRAPH.LEFT,9.3,4)
doc.tables[3].cell(1,0).text='Véase la bibliografía numerada incorporada en la sección VIII del informe.'
doc.core_properties.title='Laboratorio 06 Gestión de riesgos RESTORA'; doc.core_properties.subject='Análisis cualitativo, herramientas y tratamiento de riesgos'; doc.core_properties.author='Equipo RESTORA'
doc.save(report)
check=Document(report); txt='\n'.join(p.text for p in check.paragraphs)+'\n'+'\n'.join(c.text for t in check.tables for row in t.rows for c in row.cells)
print('saved',report,'table_count',len(check.tables),'content_paras',len(check.tables[1].cell(1,0).paragraphs),'mojibake',[s for s in ['Ã³','Ã±','Â','â€™','�'] if s in txt])
print('scenarios',len(risk),'levels',{k:sum(1 for r in risk if r[2].endswith(k)) for k in ['Crítico','Alto','Moderado','Bajo']})
