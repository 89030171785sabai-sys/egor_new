import { Hero } from '../components/sections/Hero'
import { Advantages } from '../components/sections/Advantages'
import { Catalog } from '../components/sections/Catalog'
import { Calculator } from '../components/sections/Calculator'
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
      <Calculator />
      <Faq />
      <Contacts />
      <FinalCta />
    </>
  )
}
