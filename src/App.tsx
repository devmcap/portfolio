import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { SmoothScroll } from './components/SmoothScroll'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'

// Each section is one "chapter" of the scroll story, rendered in order.
export default function App() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
