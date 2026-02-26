"use client";

import React, { useEffect } from "react";
import { Slider } from "../ui/slider";
import {
  SubmitHandler,
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { CheckboxFilters } from "../ui/checkbox";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  BijouFilters,
  getBijouxCategories,
  getBijouxFleurs,
  getBijouxMatieres,
} from "@/sanity/lib/bijoux/calls";

interface FiltresBijouProps {
  handleFiltersChange: (filters: BijouFilters) => void;
  onClose?: () => void;
  variant?: "card" | "flush";
  scrollTarget?: React.RefObject<HTMLElement | null>;
  urlParamsArray: {
    categories: string[];
    fleurs: string[];
    matieres: string[];
    price: [number, number];
  };
}

interface FormData {
  categories: { _id: string; title: string; checked: boolean }[];
  matieres: { _id: string; title: string; checked: boolean }[];
  fleurs: { _id: string; title: string; checked: boolean }[];
  price: [number, number];
}

const FiltresBijouxWrapper = ({
  handleFiltersChange,
  onClose,
  variant = "card",
  scrollTarget,
  urlParamsArray,
}: FiltresBijouProps) => {
  const { register, handleSubmit, setValue, control, watch, getValues } =
    useForm<FormData>({
      defaultValues: {
        categories: [{ _id: "1234-5678", title: "Categorie", checked: true }],
        matieres: [{ _id: "1234-5678", title: "Matière", checked: true }],
        fleurs: [{ _id: "1234-5678", title: "Fleur", checked: true }],
        price: [0, 100],
      },
    });

  useEffect(() => {
    async function fetchBijouxMatieres() {
      const data = await getBijouxMatieres();
      setValue("matieres", data.map((m) => ({ ...m, checked: true })));
    }
    fetchBijouxMatieres();

    async function fetchBijouxFleurs() {
      const data = await getBijouxFleurs();
      setValue("fleurs", data.map((f) => ({ ...f, checked: true })));
    }
    fetchBijouxFleurs();

    async function fetchBijouxCategories() {
      const data = await getBijouxCategories();
      setValue("categories", data.map((c) => ({ ...c, checked: true })));
    }
    fetchBijouxCategories();
  }, [setValue]);

  useEffect(() => {
    const currentCategory = getValues("categories");
    const currentMatiere = getValues("matieres");
    const currentFleur = getValues("fleurs");

    if (urlParamsArray.categories && urlParamsArray.categories.length > 0) {
      setValue(
        "categories",
        currentCategory.map((category: any) => ({
          ...category,
          checked: urlParamsArray.categories.includes(category._id),
        }))
      );
    }

    if (urlParamsArray.matieres && urlParamsArray.matieres.length > 0) {
      setValue(
        "matieres",
        currentMatiere.map((matiere: any) => ({
          ...matiere,
          checked: urlParamsArray.matieres.includes(matiere._id),
        }))
      );
    }

    if (urlParamsArray.fleurs && urlParamsArray.fleurs.length > 0) {
      setValue(
        "fleurs",
        currentFleur.map((fleur: any) => ({
          ...fleur,
          checked: urlParamsArray.fleurs.includes(fleur._id),
        }))
      );
    }

    if (urlParamsArray.price) {
      setValue("price", urlParamsArray.price);
    }
  }, [urlParamsArray, getValues, setValue]);

  const onSubmit: SubmitHandler<any> = () => {
    const newFilters: BijouFilters = {
      categories: getValues("categories")
        .filter((c: any) => c.checked)
        .map((c: any) => c._id),
      matieres: getValues("matieres")
        .filter((m: any) => m.checked)
        .map((m: any) => m._id),
      fleurs: getValues("fleurs")
        .filter((f: any) => f.checked)
        .map((f: any) => f._id),
      price: getValues("price"),
    };
    handleFiltersChange(newFilters);
    onClose?.();
    scrollTarget?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { fields: fieldCategory } = useFieldArray({ name: "categories", control });
  const { fields: fieldMatiere } = useFieldArray({ name: "matieres", control });
  const { fields: fieldFleur } = useFieldArray({ name: "fleurs", control });

  const watchedFields = useWatch({ control });

  function handleSliderChange(value: number[]): void {
    if (value.length === 2) {
      setValue("price", [value[0], value[1]]);
    }
  }

  function handleSelectAll(bool: boolean): void {
    fieldCategory.forEach((_, i) =>
      setValue(`categories.${i}.checked`, bool, { shouldDirty: true })
    );
    fieldMatiere.forEach((_, i) =>
      setValue(`matieres.${i}.checked`, bool, { shouldDirty: true })
    );
    fieldFleur.forEach((_, i) =>
      setValue(`fleurs.${i}.checked`, bool, { shouldDirty: true })
    );
  }


  const outerClass =
    variant === "card"
      ? "bg-white rounded-xl border border-olive-100/70 shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-88px)]"
      : "bg-white overflow-hidden h-full flex flex-col";

  return (
    <div className={outerClass}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-olive-100/80">
        <span className="font-editorial text-[0.62rem] tracking-[0.22em] uppercase font-bold text-olive-800">
          Filtrer
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSelectAll(true)}
            className="font-editorial text-[0.58rem] tracking-[0.08em] text-olive-400 hover:text-bronze-500 transition-colors uppercase"
          >
            Tout
          </button>
          <span className="text-olive-200 text-xs">·</span>
          <button
            type="button"
            onClick={() => handleSelectAll(false)}
            className="font-editorial text-[0.58rem] tracking-[0.08em] text-olive-400 hover:text-bronze-500 transition-colors uppercase"
          >
            Aucun
          </button>
          {onClose && (
            <>
              <span className="text-olive-200 text-xs">·</span>
              <button
                type="button"
                onClick={onClose}
                className="text-olive-300 hover:text-olive-700 transition-colors"
                aria-label="Fermer"
              >
                <X size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="flex-1 min-h-0 overflow-y-auto filter-scrollbar">
          <Accordion type="single" collapsible>

            {/* Catégories */}
            {fieldCategory.length > 0 && (
              <AccordionItem value="categories" className="border-b border-olive-100/60 px-3">
                <AccordionTrigger className="py-2.5 cursor-pointer font-editorial text-[0.62rem] font-bold tracking-[0.18em] uppercase text-olive-700 hover:no-underline [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-olive-400">
                  Catégories
                </AccordionTrigger>
                <AccordionContent className="pb-3 pt-0">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {fieldCategory.map((category: any, i) => (
                      <CheckboxFilters
                        key={category._id}
                        id={`cat-${category._id}`}
                        checked={watchedFields.categories?.[i]?.checked ?? false}
                        {...register(`categories.${i}._id`)}
                        onCheckedChange={(checked: boolean) => {
                          setValue(`categories.${i}.checked`, checked, { shouldDirty: true });
                        }}
                      >
                        <span className="font-editorial text-[0.75rem] text-olive-600">
                          {category.title}
                        </span>
                      </CheckboxFilters>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Matières */}
            {fieldMatiere.length > 0 && (
              <AccordionItem value="matieres" className="border-b border-olive-100/60 px-3">
                <AccordionTrigger className="py-2.5 cursor-pointer cursor-pointer font-editorial text-[0.62rem] font-bold tracking-[0.18em] uppercase text-olive-700 hover:no-underline [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-olive-400">
                  Matières
                </AccordionTrigger>
                <AccordionContent className="pb-3 pt-0">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {fieldMatiere.map((matiere: any, i) => (
                      <CheckboxFilters
                        key={matiere._id}
                        id={`mat-${matiere._id}`}
                        checked={watchedFields.matieres?.[i]?.checked ?? false}
                        {...register(`matieres.${i}._id`)}
                        onCheckedChange={(checked: boolean) => {
                          setValue(`matieres.${i}.checked`, checked, { shouldDirty: true });
                        }}
                      >
                        <span className="font-editorial text-[0.75rem] text-olive-600">
                          {matiere.title}
                        </span>
                      </CheckboxFilters>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Fleurs */}
            {fieldFleur.length > 0 && (
              <AccordionItem value="fleurs" className="border-b border-olive-100/60 px-3">
                <AccordionTrigger className="py-2.5 cursor-pointer font-editorial text-[0.62rem] font-bold tracking-[0.18em] uppercase text-olive-700 hover:no-underline [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-olive-400">
                  Fleurs
                </AccordionTrigger>
                <AccordionContent className="pb-3 pt-0">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {fieldFleur.map((fleur: any, i) => (
                      <CheckboxFilters
                        key={fleur._id}
                        id={`fleur-${fleur._id}`}
                        checked={watchedFields.fleurs?.[i]?.checked ?? false}
                        {...register(`fleurs.${i}._id`)}
                        onCheckedChange={(checked: boolean) => {
                          setValue(`fleurs.${i}.checked`, checked, { shouldDirty: true });
                        }}
                      >
                        <span className="font-editorial text-[0.75rem] text-olive-600">
                          {fleur.title}
                        </span>
                      </CheckboxFilters>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

          </Accordion>

          {/* Prix — always visible */}
          <div className="px-3 py-2.5 border-t border-olive-100/60">
            <span className="font-editorial text-[0.62rem] font-bold tracking-[0.18em] uppercase text-olive-700">
              Prix
            </span>
            <div className="px-1 mt-4">
              <Slider
                min={0}
                max={100}
                step={1}
                defaultValue={[getValues("price")[0], getValues("price")[1]]}
                onValueChange={handleSliderChange}
              />
              <div className="flex justify-between mt-2.5">
                <span className="font-editorial text-[0.7rem] text-olive-500">
                  {watch("price")[0]}€
                </span>
                <span className="font-editorial text-[0.7rem] text-olive-500">
                  {watch("price")[1]}€
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Apply button */}
        <div className="px-3 pb-3 flex-shrink-0">
          <button
            type="submit"
            className="w-full py-2.5 bg-olive-700 text-white font-editorial text-[0.62rem] tracking-[0.2em] uppercase rounded-lg hover:bg-olive-800 active:scale-[0.99] transition-all"
          >
            Appliquer
          </button>
        </div>
      </form>
    </div>
  );
};

export default FiltresBijouxWrapper;
