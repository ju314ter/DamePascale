"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, SlidersHorizontal, X } from "lucide-react";
import type { Bijou, Taxon, Taxonomies } from "@/sanity/lib/types";
import { finalPrice, formatPrice } from "@/lib/pricing";
import CardBijou from "@/components/product-cards/card-bijou";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";
import { PressedFlower } from "@/components/botanical/decorations";

const PAGE_SIZE = 12;

const SORTS = [
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
] as const;
type Sort = (typeof SORTS)[number]["value"];

type Filters = {
  categories: string[];
  matieres: string[];
  fleurs: string[];
  price: [number, number] | null;
  sort: Sort;
};

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

function readFilters(params: URLSearchParams): Filters {
  const rawPrice = list(params.get("prix") ?? params.get("price")).map(Number);
  const sort = params.get("tri") as Sort | null;
  return {
    categories: list(params.get("category")),
    matieres: list(params.get("matiere")),
    fleurs: list(params.get("fleur")),
    price:
      rawPrice.length === 2 && rawPrice.every((n) => !isNaN(n))
        ? [rawPrice[0], rawPrice[1]]
        : null,
    sort: SORTS.some((s) => s.value === sort) ? (sort as Sort) : "nouveautes",
  };
}

function writeFilters(f: Filters, visible?: number): string {
  const p = new URLSearchParams();
  if (f.categories.length) p.set("category", f.categories.join(","));
  if (f.matieres.length) p.set("matiere", f.matieres.join(","));
  if (f.fleurs.length) p.set("fleur", f.fleurs.join(","));
  if (f.price) p.set("prix", `${f.price[0]},${f.price[1]}`);
  if (f.sort !== "nouveautes") p.set("tri", f.sort);
  if (visible && visible > PAGE_SIZE) p.set("n", String(visible));
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

const hasAny = (ids: string[], taxa?: Taxon[]) =>
  ids.length === 0 || !!taxa?.some((t) => ids.includes(t._id));

function applyFilters(items: Bijou[], f: Filters): Bijou[] {
  const filtered = items.filter(
    (b) =>
      hasAny(f.categories, b.categories) &&
      hasAny(f.matieres, b.matieres) &&
      hasAny(f.fleurs, b.fleurs) &&
      (!f.price ||
        (finalPrice(b) >= f.price[0] && finalPrice(b) <= f.price[1])),
  );
  const created = (b: Bijou) => (b._createdAt ? Date.parse(b._createdAt) : 0);
  const sorters: Record<Sort, (a: Bijou, b: Bijou) => number> = {
    nouveautes: (a, b) => created(b) - created(a),
    "prix-asc": (a, b) => finalPrice(a) - finalPrice(b),
    "prix-desc": (a, b) => finalPrice(b) - finalPrice(a),
  };
  return [...filtered].sort(sorters[f.sort]);
}

/* ───────────────────────── Sous-composants ───────────────────────── */

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex-shrink-0 px-3.5 py-2 rounded-full border font-editorial text-[0.78rem] transition-colors whitespace-nowrap ${
        active
          ? "bg-olive-700 border-olive-700 text-cream-50"
          : "bg-white border-olive-200 text-olive-700 hover:border-olive-400"
      }`}
    >
      {children}
    </button>
  );
}

function FilterGroup({
  title,
  taxa,
  selected,
  onToggle,
}: {
  title: string;
  taxa: Taxon[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  if (taxa.length === 0) return null;
  return (
    <div
      role="group"
      aria-label={title}
      className="py-5 border-b border-olive-100"
    >
      <p className="font-editorial text-[0.68rem] tracking-[0.18em] uppercase text-olive-800 mb-3">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {taxa.map((t) => (
          <Chip
            key={t._id}
            active={selected.includes(t._id)}
            onClick={() => onToggle(t._id)}
          >
            {t.title}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function FilterPanel({
  taxonomies,
  filters,
  maxPrice,
  update,
}: {
  taxonomies: Taxonomies;
  filters: Filters;
  maxPrice: number;
  update: (patch: Partial<Filters>) => void;
}) {
  const toggle =
    (key: "categories" | "matieres" | "fleurs") => (id: string) => {
      const current = filters[key];
      update({
        [key]: current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id],
      });
    };
  const price = filters.price ?? [0, maxPrice];
  const [draft, setDraft] = useState<[number, number]>(price);
  useEffect(
    () => setDraft(filters.price ?? [0, maxPrice]),
    [filters.price, maxPrice],
  );

  return (
    <div>
      <FilterGroup
        title="Type de bijou"
        taxa={taxonomies.categories}
        selected={filters.categories}
        onToggle={toggle("categories")}
      />
      <FilterGroup
        title="Fleurs"
        taxa={taxonomies.fleurs}
        selected={filters.fleurs}
        onToggle={toggle("fleurs")}
      />
      <FilterGroup
        title="Matières"
        taxa={taxonomies.matieres}
        selected={filters.matieres}
        onToggle={toggle("matieres")}
      />
      {maxPrice > 0 && (
        <div role="group" aria-label="Prix" className="py-5">
          <p className="font-editorial text-[0.68rem] tracking-[0.18em] uppercase text-olive-800 mb-4">
            Prix
          </p>
          <div className="px-2">
            <Slider
              min={0}
              max={maxPrice}
              step={1}
              value={draft}
              onValueChange={(v) => setDraft([v[0], v[1]])}
              onValueCommit={(v) =>
                update({
                  price: v[0] <= 0 && v[1] >= maxPrice ? null : [v[0], v[1]],
                })
              }
            />
          </div>
          <div className="flex justify-between mt-3 font-editorial text-[0.8rem] text-olive-700">
            <span>{formatPrice(draft[0])}</span>
            <span>{formatPrice(draft[1])}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Composant principal ───────────────────────── */

export default function ShopBrowser({
  bijoux,
  taxonomies,
  soldOutCount = 0,
}: {
  bijoux: Bijou[];
  taxonomies: Taxonomies;
  soldOutCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const initialVisible = Math.max(
    PAGE_SIZE,
    Number(searchParams.get("n")) || PAGE_SIZE,
  );
  const [visible, setVisible] = useState(initialVisible);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [autoLoad, setAutoLoad] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const gridTopRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const maxPrice = useMemo(
    () => Math.ceil(Math.max(0, ...bijoux.map((b) => finalPrice(b)))),
    [bijoux],
  );
  const results = useMemo(
    () => applyFilters(bijoux, filters),
    [bijoux, filters],
  );
  const shown = results.slice(0, visible);
  const activeCount =
    filters.categories.length +
    filters.matieres.length +
    filters.fleurs.length +
    (filters.price ? 1 : 0);

  const update = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...filters, ...patch };
      setVisible(PAGE_SIZE);
      setAutoLoad(false);
      router.replace(`${pathname}${writeFilters(next)}`, { scroll: false });
      // Ramène en haut de la grille si on l'a dépassée (évite de rester « dans le vide »).
      const top = gridTopRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0 && !sheetOpen) {
        gridTopRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
    [filters, pathname, router, sheetOpen],
  );

  const clearAll = () =>
    update({
      categories: [],
      matieres: [],
      fleurs: [],
      price: null,
    });

  // Mémorise le nombre d'articles affichés dans l'URL : au retour depuis une
  // fiche produit, on retrouve la liste (et la position) telle qu'on l'a laissée.
  const loadMore = useCallback(() => {
    setVisible((v) => {
      const next = Math.min(v + PAGE_SIZE, results.length);
      window.history.replaceState(
        null,
        "",
        `${pathname}${writeFilters(filters, next)}`,
      );
      return next;
    });
  }, [filters, pathname, results.length]);

  useEffect(() => {
    if (!autoLoad || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [autoLoad, loadMore, visible]);

  useEffect(() => {
    const onScroll = () =>
      setShowTop(window.scrollY > window.innerHeight * 1.5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const taxonTitle = (id: string) =>
    [
      ...taxonomies.categories,
      ...taxonomies.matieres,
      ...taxonomies.fleurs,
    ].find((t) => t._id === id)?.title ?? "";

  const activePills: { label: string; remove: () => void }[] = [
    ...filters.categories.map((id) => ({
      label: taxonTitle(id),
      remove: () =>
        update({ categories: filters.categories.filter((x) => x !== id) }),
    })),
    ...filters.fleurs.map((id) => ({
      label: taxonTitle(id),
      remove: () => update({ fleurs: filters.fleurs.filter((x) => x !== id) }),
    })),
    ...filters.matieres.map((id) => ({
      label: taxonTitle(id),
      remove: () =>
        update({ matieres: filters.matieres.filter((x) => x !== id) }),
    })),
    ...(filters.price
      ? [
          {
            label: `${formatPrice(filters.price[0])} – ${formatPrice(filters.price[1])}`,
            remove: () => update({ price: null }),
          },
        ]
      : []),
  ].filter((p) => p.label);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Barre d'outils collante ─────────────────────────────────── */}
      <div
        ref={gridTopRef}
        className="scroll-mt-14 md:scroll-mt-16"
        aria-hidden
      />
      <div className="sticky top-14 md:top-16 z-30 -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 pt-3 pb-3 bg-cream-50/95 backdrop-blur border-b border-olive-100/80">
        {taxonomies.categories.length > 0 && (
          <div
            className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-3"
            role="group"
            aria-label="Type de bijou"
          >
            <Chip
              active={filters.categories.length === 0}
              onClick={() => update({ categories: [] })}
            >
              Tout voir
            </Chip>
            {taxonomies.categories.map((cat) => (
              <Chip
                key={cat._id}
                active={filters.categories.includes(cat._id)}
                onClick={() =>
                  update({
                    categories: filters.categories.includes(cat._id)
                      ? filters.categories.filter((x) => x !== cat._id)
                      : [...filters.categories, cat._id],
                  })
                }
              >
                {cat.title}
              </Chip>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <p
            className="font-editorial text-[0.8rem] text-olive-700 whitespace-nowrap"
            aria-live="polite"
          >
            <strong className="font-normal text-olive-900">
              {results.length}
            </strong>{" "}
            {results.length > 1 ? "pièces" : "pièce"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-full border border-olive-300 bg-white font-editorial text-[0.72rem] tracking-[0.1em] uppercase text-olive-800"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtrer
              {activeCount > 0 && (
                <span className="min-w-5 h-5 px-1 rounded-full bg-olive-700 text-cream-50 text-[0.65rem] flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>
            <label className="sr-only" htmlFor="tri">
              Trier par
            </label>
            <select
              id="tri"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as Sort })}
              className="h-10 pl-3 pr-8 rounded-full border border-olive-300 bg-white font-editorial text-[0.78rem] text-olive-800 appearance-none bg-no-repeat bg-[right_0.7rem_center] bg-[length:12px] focus:outline-none focus:border-olive-600"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' fill='none' stroke='%23735f35' stroke-width='1.5'/%3E%3C/svg%3E\")",
              }}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {activePills.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {activePills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={pill.remove}
                className="flex-shrink-0 flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-olive-100 font-editorial text-[0.72rem] text-olive-800"
                aria-label={`Retirer le filtre ${pill.label}`}
              >
                {pill.label}
                <X className="w-3.5 h-3.5" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="flex-shrink-0 px-2 font-editorial text-[0.72rem] text-bronze-600 underline underline-offset-2"
            >
              Tout effacer
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-10 pt-6 lg:pt-8">
        {/* ── Filtres desktop ─────────────────────────────────────────── */}
        <aside
          className="hidden lg:block w-64 flex-shrink-0"
          aria-label="Filtres"
        >
          <div className="sticky top-[13rem] max-h-[calc(100vh-14rem)] overflow-y-auto filter-scrollbar pr-2">
            <p className="font-serif-display text-xl text-olive-800">Affiner</p>
            <FilterPanel
              taxonomies={taxonomies}
              filters={filters}
              maxPrice={maxPrice}
              update={update}
            />
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="mt-2 font-editorial text-[0.78rem] text-bronze-600 underline underline-offset-2"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        </aside>

        {/* ── Grille ──────────────────────────────────────────────────── */}
        <section className="flex-1 min-w-0" aria-label="Bijoux">
          {bijoux.length === 0 ? (
            <div className="text-center py-16 px-4">
              <PressedFlower className="w-16 h-16 text-olive-300 mx-auto mb-4" />
              <p className="font-hand text-2xl text-olive-700">
                Toutes les pièces ont trouvé preneur !
              </p>
              <p className="font-editorial text-sm text-olive-600 mt-2 mb-6">
                De nouvelles créations arrivent bientôt. En attendant, je peux
                imaginer un bijou rien que pour vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/sur-mesure" className={btnPrimary}>
                  Créer ma pièce sur mesure
                </Link>
                <Link href="/marches" className={btnSecondary}>
                  Me retrouver sur un marché
                </Link>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 px-4">
              <PressedFlower className="w-16 h-16 text-olive-300 mx-auto mb-4" />
              <p className="font-hand text-2xl text-olive-700">
                Aucune pièce ne correspond
              </p>
              <p className="font-editorial text-sm text-olive-600 mt-2 mb-6">
                Essayez d&apos;élargir vos critères… ou demandez-moi une
                création sur mesure.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={clearAll}
                  className={btnSecondary}
                >
                  Effacer les filtres
                </button>
                <Link href="/sur-mesure" className={btnPrimary}>
                  Créer ma pièce sur mesure
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-8">
                {shown.map((b, i) => (
                  <li key={b._id}>
                    <CardBijou item={b} priority={i < 4} />
                  </li>
                ))}
              </ul>

              <div
                ref={sentinelRef}
                className="flex flex-col items-center gap-3 pt-12"
              >
                <p className="font-editorial text-[0.8rem] text-olive-600">
                  {shown.length}{" "}
                  {shown.length > 1 ? "pièces vues" : "pièce vue"} sur{" "}
                  {results.length}
                </p>
                <div
                  className="w-48 h-1 rounded-full bg-olive-100 overflow-hidden"
                  aria-hidden
                >
                  <div
                    className="h-full bg-olive-500 transition-all duration-500"
                    style={{
                      width: `${(shown.length / results.length) * 100}%`,
                    }}
                  />
                </div>
                {shown.length < results.length && (
                  <button
                    type="button"
                    onClick={() => {
                      loadMore();
                      setAutoLoad(true);
                    }}
                    className={`${btnSecondary} mt-2`}
                  >
                    Voir plus de bijoux
                  </button>
                )}
                {soldOutCount > 0 && shown.length >= results.length && (
                  <a
                    href="#trop-tard"
                    className="mt-2 font-editorial text-[0.8rem] text-olive-600 underline underline-offset-4 decoration-olive-300 hover:text-bronze-600"
                  >
                    Voir les {soldOutCount} pièces déjà parties ↓
                  </a>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* ── Filtres mobile (tiroir du bas) ────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="p-0 rounded-t-2xl max-h-[88vh] flex flex-col bg-cream-50 gap-0"
        >
          <div className="px-5 pt-5 pb-3 border-b border-olive-100">
            <SheetTitle className="font-serif-display text-2xl text-olive-800 font-normal">
              Filtrer
            </SheetTitle>
            <SheetDescription className="sr-only">
              Affinez la liste des bijoux
            </SheetDescription>
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <FilterPanel
              taxonomies={taxonomies}
              filters={filters}
              maxPrice={maxPrice}
              update={update}
            />
          </div>
          <div className="flex gap-3 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-olive-100 bg-white">
            <button
              type="button"
              onClick={clearAll}
              className={`${btnSecondary} flex-1 px-4`}
            >
              Effacer
            </button>
            <button
              type="button"
              onClick={() => {
                setSheetOpen(false);
                gridTopRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`${btnPrimary} flex-[1.4] px-4`}
            >
              Voir {results.length} {results.length > 1 ? "pièces" : "pièce"}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Retour en haut ──────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() =>
          gridTopRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        className={`fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 w-12 h-12 rounded-full bg-white border border-olive-200 shadow-[0_6px_20px_rgba(96,78,48,0.15)] flex items-center justify-center text-olive-700 transition-all duration-300 ${
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Remonter en haut de la liste"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
