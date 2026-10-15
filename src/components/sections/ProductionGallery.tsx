import { PhotoGallery } from '../ui/Lightbox'

/** Photographs from the shop floor, in the order they should read. */
const photos = [
  { file: 'production-workshop-bowls.webp', alt: 'Готовые чаши в цеху: чёрный корпус, лиственница, нержавеющая сталь' },
  { file: 'production-inside-liner.webp', alt: 'Чаша изнутри: листы нержавеющей стали встык, сиденье по периметру' },
  { file: 'production-welding.webp', alt: 'Сварщик зачищает шов нержавеющей чаши в цеху' },
  { file: 'production-inside-larch.webp', alt: 'Чаша с лавками из лиственницы и подголовниками, вид сверху' },
]

/**
 * Four frames across the whole screen, edge to edge, one screen tall, after
 * the light block of stages. On a phone they fall into a two by two. Each
 * opens full size on click.
 */
export function ProductionGallery() {
  return (
    <section className="pb-10 lg:pb-14">
      <PhotoGallery
        photos={photos}
        className="grid grid-cols-2 gap-1 px-1 sm:gap-2 sm:px-2 lg:grid-cols-4"
        thumbClassName="aspect-3/4 lg:aspect-auto lg:h-[min(78vh,42rem)]"
      />
    </section>
  )
}
