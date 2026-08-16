import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { LanguageProvider } from './providers/LanguageProvider'
import { useLenis, scrollToId } from './hooks/useLenis'
import { Intro } from './components/intro/Intro'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { KafkaDeepDive } from './components/sections/KafkaDeepDive'
import { SagaDeepDive } from './components/sections/SagaDeepDive'
import { GatewayDeepDive } from './components/sections/GatewayDeepDive'
import { Experience } from './components/sections/Experience'
import { Contact } from './components/sections/Contact'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-sky"
    />
  )
}

export default function App() {
  useLenis()
  // Skip the intro when deep-linking to a section or in static/screenshot mode.
  const [showIntro, setShowIntro] = useState(
    () => !(typeof window !== 'undefined' && (window.location.search.includes('static') || window.location.hash)),
  )

  // Deep-link support: scroll to #section when the page opens with a hash.
  useEffect(() => {
    const id = window.location.hash.replace('#', '')
    if (!id) return
    const t = setTimeout(() => scrollToId(id, true), 250)
    return () => clearTimeout(t)
  }, [])

  return (
    <LanguageProvider>
      {showIntro && <Intro onDone={() => setShowIntro(false)} />}
      <ScrollProgress />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <KafkaDeepDive />
        <SagaDeepDive />
        <GatewayDeepDive />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  )
}
