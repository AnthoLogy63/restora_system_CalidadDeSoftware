#import "config.typ": *

#let informe(cuerpo) = {
  // ---------- Ajustes generales ----------
  set document(title: titulo, author: integrantes)
  // El logo se ajusta a la altura indicada respetando su proporción
  let logo(ruta, alin) = if ruta != none {
    align(alin + horizon, context {
      let m = measure(image(ruta))
      image(ruta, height: altura-logo, width: altura-logo * (m.width / m.height))
    })
  }

  let alto-cabecera = if (logo-izquierdo != none or logo-derecho != none) { altura-logo } else { 1.2em }
  let margen-superior = distancia-encabezado-arriba + alto-cabecera + separacion-encabezado-texto

  let encabezado = {
    set text(size: tamano-encabezado)
    grid(
      columns: (auto, 1fr, auto),
      column-gutter: 0.4cm,
      align: horizon,
      logo(logo-izquierdo, left),
      align(center)[
        #facultad \
        #text(weight: "bold", escuela)
      ],
      logo(logo-derecho, right),
    )
  }

  set page(
    paper: papel,
    margin: (
      x: margen-lateral,
      top: margen-superior,
      bottom: margen-inferior,
    ),
    header-ascent: separacion-encabezado-texto,
    header: if encabezado-paginas { encabezado } else { none },
    numbering: if numerar-paginas { "1" } else { none },
  )
  set text(font: fuente, size: tamano, lang: idioma)
  set par(justify: justificar, leading: interlineado, spacing: espacio-parrafo)

  // ---------- Estilos para código con fondo gris ----------
  show raw.where(block: true): it => block(
    fill: rgb("#f6f8fa"),
    stroke: 0.5pt + rgb("#d0d7de"),
    inset: (x: 9pt, y: 8pt),
    radius: 4pt,
    width: 100%,
    breakable: true,
    text(font: ("Menlo", "DejaVu Sans Mono", "Courier New"), size: 8.5pt, it)
  )

  show raw.where(block: false): it => box(
    fill: rgb("#f0f2f5"),
    stroke: 0.4pt + rgb("#d8dee4"),
    inset: (x: 3.5pt, y: 0pt),
    outset: (y: 2.5pt),
    radius: 2.5pt,
    text(font: ("Menlo", "DejaVu Sans Mono", "Courier New"), size: 0.9em, it)
  )

  // ---------- Títulos con sangría francesa ----------
  set heading(numbering: numeracion-titulos)
  show heading: it => {
    let tam = tamano-titulos.at(calc.min(it.level, tamano-titulos.len()) - 1)
    let num = if it.numbering != none {
      counter(heading).display(it.numbering)
    } else { none }
    let estilo(x) = text(size: tam, weight: "bold", fill: color-titulos, x)
    if num == none {
      block(above: 1.6em, below: 1em, sticky: true, estilo(it.body))
    } else {
      pad(left: (it.level - 1) * ancho-numero, block(
        width: 100%,
        above: 1.6em,
        below: 1em,
        sticky: true,
        grid(
          columns: (ancho-numero, 1fr),
          column-gutter: 0pt,
          estilo(num),
          estilo(it.body),
        ),
      ))
    }
  }

  // ---------- Portada ----------
  if portada {
    let etiqueta(t) = text(weight: "bold", size: 11pt, t)
    let campo(nombre, valor) = block(above: 0pt, below: 1.1em, breakable: false)[
      #etiqueta(nombre) \
      #if type(valor) == array { valor.join(linebreak()) } else { valor }
    ]
    let linea = line(length: 100%, stroke: 0.6pt + color-lineas-portada)

    page(numbering: none, {
      set par(justify: false, leading: 0.55em, spacing: 0.55em)
      set text(size: 11pt)

      v(1fr)

      // Bloque del título
      linea
      v(0.4cm)
      text(style: "italic", size: 12pt, curso)
      v(0.2cm)
      par(leading: 0.8em, text(size: tamano-titulo-portada, weight: "bold", upper(titulo)))
      if subtitulo != none {
        v(0.2cm)
        text(style: "italic", size: 12pt, subtitulo)
      }
      v(0.4cm)
      linea

      v(1.0cm)

      // Datos
      campo(if integrantes.len() > 1 { "AUTORES / INTEGRANTES:" } else { "AUTOR:" }, integrantes)
      campo("DOCENTE(S):", docente)
      campo("CURSO:", curso)
      campo("LUGAR:", lugar)
      campo("FECHA:", fecha)

      v(1.2fr)
    })
    counter(page).update(1)
  }

  // ---------- Índice ----------
  if indice {
    page(numbering: none)[
      #outline(title: "Índice General", indent: auto)
    ]
    counter(page).update(1)
  }

  // ---------- Contenido: el texto se sangra según el nivel del último título ----------
  let aplanar(c) = if c.has("children") and c.func() not in (table, grid, stack) {
    c.children.map(aplanar).flatten()
  } else { (c,) }

  let items = aplanar(cuerpo)
  let bloque = ()
  let nivel = 0

  let vaciar(bloque, nivel) = {
    if bloque.len() > 0 {
      pad(left: nivel * ancho-numero, bloque.join())
    }
  }

  for c in items {
    if c.func() == heading {
      vaciar(bloque, nivel)
      bloque = ()
      nivel = c.depth
      c
    } else {
      bloque.push(c)
    }
  }
  vaciar(bloque, nivel)
}
