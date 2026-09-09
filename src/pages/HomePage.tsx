import { Hero } from '../components/sections/Hero'
import { Advantages } from '../components/sections/Advantages'
import { Catalog } from '../components/sections/Catalog'
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
    </>
  )
}
