import { Hero } from '../components/sections/Hero'
import { Advantages } from '../components/sections/Advantages'
import { ModelRail } from '../components/sections/ModelRail'
import { ModelShowcase } from '../components/sections/ModelShowcase'
import { Benefits } from '../components/sections/Benefits'
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
      {/*
       * ВРЕМЕННАЯ ПЛАШКА — проверка автопубликации. Убрать после проверки:
       * удалить этот блок целиком, больше нигде он не используется.
       */}
      <div className="bg-red-600 px-4 py-8 text-center">
        <p className="font-display text-4xl text-white uppercase sm:text-6xl">Сайт работает</p>
      </div>

      <Hero />
      <Advantages />
      <ModelRail />
      <ModelShowcase />
      <Benefits />
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
