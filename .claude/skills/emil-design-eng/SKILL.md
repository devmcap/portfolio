# Emil Kowalski - Design Engineer Skill

Habilidad avanzada de ingeniería de diseño frontend enfocada en microinteracciones, animaciones de alto rendimiento (60/120fps) y refinamiento visual pixel-perfect.

## Core Design Principles

### 1. Motion & Timing
- **Easings:** Queda estrictamente prohibido usar `ease-in` o `ease-out` genéricos. Usa curvas de aceleración personalizadas basadas en la física (ej. `cubic-bezier(0.2, 0.8, 0.2, 1)` para entradas rápidas y frenados suaves o `cubic-bezier(0.4, 0, 0.2, 1)` para transiciones estándar).
- **Durations:** Las microinteracciones (hovers, clicks) deben durar entre `100ms` y `200ms`. Los cambios de estado grandes (modales, páginas) deben durar entre `300ms` y `400ms`. Nunca superes los `500ms`.
- **Staggering:** Al renderizar listas de elementos, aplica un retraso escalonado (stagger) acumulativo de entre `20ms` y `40ms` por elemento para guiar la vista del usuario.

### 2. Performance First (60/120fps)
- **Composite Properties:** Solo se permite animar propiedades que utilicen la GPU: `transform` (`translate`, `scale`, `rotate`) y `opacity`.
- **Layout Thrashing:** Evita a toda costa animar propiedades que fuercen el re-layout o re-paint del navegador como `width`, `height`, `top`, `left`, `margin` o `padding`. Si necesitas cambiar el tamaño, escala el elemento (`scaleX`/`scaleY`) o usa la técnica FLIP (First, Last, Invert, Play).
- **Will-Change:** Añade la propiedad CSS `will-change` de forma dinámica únicamente durante la ejecución de la animación, removiéndola al finalizar para evitar fugas de memoria.

### 3. Microinteractions & Component States
- **Active States:** Cada botón, enlace o elemento interactivo debe contar con un estado `:active` perceptible (ej. una reducción sutil de escala a `0.98`) para dar feedback físico inmediato al hacer clic.
- **Focus Ring:** No remuevas el borde de enfoque (`outline: none`) sin sustituirlo por un anillo de enfoque accesible, estilizado y animado mediante variables CSS o Tailwind (`focus-visible:ring-2`).
- **Layout Transitions:** Utiliza layouts compartidos (`layoutId` en Framer Motion) al transformar un elemento pequeño en uno grande (ej. una tarjeta que se expande a modal) para asegurar una transición fluida sin saltos de píxeles.

### 4. Code & Implementation Quality
- Prioriza soluciones nativas con CSS o Tailwind CSS para animaciones simples de estados.
- Utiliza la librería `Framer Motion` (en React/Next.js) o `GSAP` para orquestar líneas de tiempo complejas o gestos de arrastre (drag-and-drop).
- Todo componente interactivo debe respetar la preferencia del sistema operativo de los usuarios que tengan activada la opción de "Reducir movimiento" (`@media (prefers-reduced-motion: reduce)`).
