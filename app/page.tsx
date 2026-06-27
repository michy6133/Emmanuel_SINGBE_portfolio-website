import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WelcomeVideo } from '@/components/sections/welcome-video'
import { Hero } from '@/components/sections/hero'
import { Stats } from '@/components/sections/stats'
import { Why } from '@/components/sections/why'
import { About } from '@/components/sections/about'
import { Portfolio } from '@/components/sections/portfolio'
import { Services } from '@/components/sections/services'
import { Certifications } from '@/components/sections/certifications'
import { Testimonials } from '@/components/sections/testimonials'
import { Contact } from '@/components/sections/contact'
import { GsapScrollEffects } from '@/components/gsap-scroll-effects'
import { getApprovedComments, getSiteContent } from '@/lib/server/db'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [content, approvedComments] = await Promise.all([
    getSiteContent(),
    getApprovedComments(),
  ])

  return (
    <div className="grain min-h-screen bg-background">
      <GsapScrollEffects />
      <Navbar navLinks={content.navLinks} />
      <main>
        <WelcomeVideo content={content.welcomeVideo} />
        <Hero content={content.hero} />
        <Stats stats={content.stats} />
        <Why items={content.why} />
        <About content={content.about} />
        <Portfolio projects={content.projects} />
        <Services services={content.services} />
        <Certifications certifications={content.certifications} />
        <Testimonials
          testimonials={content.testimonials}
          approvedComments={approvedComments}
        />
        <Contact contact={content.contact} />
      </main>
      <Footer />
    </div>
  )
}
