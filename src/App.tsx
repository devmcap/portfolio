import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { SmoothScroll } from './components/SmoothScroll'
import { LanguageProvider } from './i18n/LanguageProvider'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'

// Each section is one "chapter" of the scroll story, rendered in order.
export default function App() {
  return (
    <LanguageProvider>
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
    </LanguageProvider>
  )
}
