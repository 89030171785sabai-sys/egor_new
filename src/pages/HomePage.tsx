import { Hero } from '../components/sections/Hero'
import { Advantages } from '../components/sections/Advantages'
import { Catalog } from '../components/sections/Catalog'
import { ModelShowcase } from '../components/sections/ModelShowcase'
import { Calculator } from '../components/sections/Calculator'
import { Customization } from '../components/sections/Customization'
import { Ritual } from '../components/sections/Ritual'
import { Production } from '../components/sections/Production'
import { Guarantees } from '../components/sections/Guarantees'
import { Process } from '../components/sections/Process'
import { Delivery } from '../components/sections/Delivery'
import { Reviews } from '../components/sections/Reviews'
import { Faq } from '../components/sections/Faq'
import { Contacts } from '../components/sections/Contacts'
import { FinalCta } from '../components/sections/FinalCta'
import { useSeo } from '../lib/seo'
import { homeRoute } from '../lib/routes'

export function HomePage() {
  useSeo({
    title: homeRoute.title,
    description: homeRoute.description,
    path: homeRoute.path,
  })

  return (
    <>
      <Hero />
      <Advantages />
      <Catalog />
      <ModelShowcase />
      <Calculator />
      <Customization />
      <Ritual />
      <Production />
      <Process />
      <Guarantees />
      <Delivery />
      <Reviews />
      <Faq />
      <Contacts />
      <FinalCta />
    </>
  )
}
