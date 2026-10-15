import { Hero } from '../components/sections/Hero'
import { Advantages } from '../components/sections/Advantages'
import { ModelRail } from '../components/sections/ModelRail'
import { ModelShowcase } from '../components/sections/ModelShowcase'
import { Benefits } from '../components/sections/Benefits'
import { Customization } from '../components/sections/Customization'
import { Ritual } from '../components/sections/Ritual'
import { Production } from '../components/sections/Production'
import { Guarantees } from '../components/sections/Guarantees'
import { Process } from '../components/sections/Process'
import { Delivery } from '../components/sections/Delivery'
import { Reviews } from '../components/sections/Reviews'
import { Videos } from '../components/sections/Videos'
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
      <ModelRail />
      <ModelShowcase />
      <Benefits />
      <Customization />
      <Ritual />
      <Production withVideo />
      <Process />
      <Guarantees />
      <Delivery withPhotos={false} />
      <Reviews />
      <Videos />
      <Contacts />
      <FinalCta />
    </>
  )
}
