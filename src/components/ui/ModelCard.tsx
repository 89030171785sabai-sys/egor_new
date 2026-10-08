import { Link } from "react-router-dom";
import { ButtonLink } from "./Button";
import { ModelShot } from "./ModelShot";
import { PlaceholderImage } from "./PlaceholderImage";
import {
  formatHours,
  formatPrice,
  formatPriceRange,
  promo,
  steelGrades,
  type Model,
} from "../../data/models";

/**
 * Catalogue card: product shot beside the name, the kit, the price and the
 * call to action.
 *
 * It lies down rather than standing up. Side by side, two of these never
 * matched: a model's kit runs to four lines or to six, so one card ended well
 * below the other and the page looked broken. One to a row, each card is as
 * tall as its own contents and the column reads straight down — and the kit
 * list, which is what someone is actually comparing, gets the width to sit on
 * one line per item.
 *
 * The shot fills its half edge to edge: `scripts/normalise-card-photos.py`
 * lays each photograph out on a card-shaped canvas, so the page has no frame
 * to draw around it and every bowl in the catalogue reads at one size.
 *
 * `photo` decides whether the card shows that shot or the stand-in.
 */
export function ModelCard({
  model,
  photo = false,
}: {
  model: Model;
  photo?: boolean;
}) {
  return (
    <article className="rounded-panel bg-white p-5 shadow-sm shadow-ink-900/5 transition-shadow hover:shadow-lg hover:shadow-ink-900/10 sm:p-6 lg:grid lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] lg:gap-8">
      {/*
        * The picture stands on the floor of its half and the backdrop carries
        * on above it, in the shot's own starting colour. A card is as tall as
        * its text, which outruns the picture on most models — anchoring the
        * shot to the top instead left a hole under it.
        */}
      <div
        style={{ backgroundColor: model.photos?.cardTop ?? '#f1f2f4' }}
        className="relative flex flex-col justify-end overflow-hidden rounded-card"
      >
        {photo && model.photos?.card ? (
          <ModelShot model={model} slot="card" ratio="10/9" />
        ) : (
          <PlaceholderImage
            tone="studio"
            ratio="4/3"
            label={`${model.name} — товарное фото`}
          />
        )}
        <span className="absolute top-3 right-3 rounded-full bg-brand-500 px-3.5 py-1.5 text-sm font-semibold text-white">
          Нагрев {formatHours(model.heatingHours)}
        </span>
      </div>

      <div className="mt-5 flex flex-col lg:mt-0">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-bold tracking-tight text-navy-700 uppercase">
            {model.name}
          </h3>
          {model.badge && (
            <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
              {model.badge}
            </span>
          )}
        </div>
        <p className="mt-2 flex items-start gap-2 text-xs font-semibold tracking-wide text-brand-500 uppercase">
          <span
            aria-hidden="true"
            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500"
          />
          {model.accent}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-ink-500">
          {model.description}
        </p>

        <p className="mt-5 text-sm font-semibold">что входит:</p>
        <ul className="mt-3 space-y-2.5">
          {model.includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
                <svg
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                  className="size-2.5"
                >
                  <path
                    d="m2 6.4 2.6 2.6L10 3.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-sand-200 pt-5">
          <p className="text-xs tracking-wider text-ink-400 uppercase">Цена</p>
          <p className="mt-1 text-xl font-bold">{formatPriceRange(model)}</p>
          {model.slug === promo.modelSlug && (
            <p className="mt-1.5 text-sm text-brand-600">
              {promo.cm} см — {formatPrice(promo.price)}{" "}
              <span className="text-ink-400 line-through">
                {formatPrice(promo.was)}
              </span>
            </p>
          )}
          <p className="mt-1.5 text-xs text-ink-400">
            {steelGrades[model.steel].title} · срок службы{" "}
            {steelGrades[model.steel].life}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
          <ButtonLink to="/contacts" size="lg">
            Обсудить детали
          </ButtonLink>
          <Link
            to={`/${model.slug}`}
            className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-600"
          >
            Подробнее о модели →
          </Link>
        </div>
      </div>
    </article>
  );
}
