"use client";

import React, { useContext, useEffect } from "react";
import { Button } from "../ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  AmigurumiFilters,
  getAmigurumisCategories,
  getAmigurumisUnivers,
} from "@/sanity/lib/amigurumis/calls";
import { Slider } from "../ui/slider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  SubmitHandler,
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { CheckboxFilters } from "../ui/checkbox";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface FiltresAmigurumiProps {
  handleFiltersChange: (filters: AmigurumiFilters) => void;
  urlParamsArray: {
    categories: string[];
    universes: string[];
    price: [number, number];
  };
}

interface FormData {
  categories: { _id: string; title: string; checked: boolean }[];
  universes: { _id: string; title: string; checked: boolean }[];
  price: [number, number];
}

const FiltresAmigurumiWrapper = ({
  handleFiltersChange,
  urlParamsArray,
}: FiltresAmigurumiProps) => {
  const { register, handleSubmit, setValue, control, watch, getValues } =
    useForm<FormData>({
      defaultValues: {
        categories: [{ _id: "1234-5678", title: "Category", checked: true }],
        universes: [{ _id: "1234-5678", title: "Univers", checked: true }],
        price: [0, 100],
      },
    });

  useEffect(() => {
    async function fetchAmigurumisUnivers() {
      const data = await getAmigurumisUnivers();
      setValue(
        "universes",
        data.map((univers) => ({
          ...univers,
          checked: true,
        }))
      );
    }
    fetchAmigurumisUnivers();

    async function fetchAmigurumisCategories() {
      const data = await getAmigurumisCategories();
      setValue(
        "categories",
        data.map((category) => ({
          ...category,
          checked: true,
        }))
      );
    }
    fetchAmigurumisCategories();
  }, [setValue]);

  // Check and uncheck filtres according to URLparams
  useEffect(() => {
    const currentCategory = getValues("categories");
    const currentUnivers = getValues("universes");

    if (urlParamsArray.categories && urlParamsArray.categories.length > 0) {
      setValue(
        "categories",
        currentCategory.map((category: any) => ({
          ...category,
          checked: urlParamsArray.categories.includes(category._id),
        }))
      );
    }

    if (urlParamsArray.universes && urlParamsArray.universes.length > 0) {
      setValue(
        "universes",
        currentUnivers.map((univers: any) => ({
          ...univers,
          checked: urlParamsArray.universes.includes(univers._id),
        }))
      );
    }

    if (urlParamsArray.price) {
      setValue("price", urlParamsArray.price);
    }
  }, [urlParamsArray, getValues, setValue]);

  const onSubmit: SubmitHandler<any> = (data) => {
    const newFilters: AmigurumiFilters = {
      categories: getValues("categories")
        .filter((category: any) => category.checked)
        .map((category: any) => category._id),
      universes: getValues("universes")
        .filter((univers: any) => univers.checked)
        .map((univers: any) => univers._id),
      price: getValues("price"),
    };
    handleFiltersChange(newFilters);
  };

  const { fields: fieldCategory } = useFieldArray({
    name: "categories",
    control,
  });
  const { fields: fieldUnivers } = useFieldArray({
    name: "universes",
    control,
  });

  const watchedFields = useWatch({ control });

  function handleSliderChange(value: number[]): void {
    if (value.length === 2) {
      const [min, max] = value;
      setValue("price", [min, max]);
    }
  }

  function handleSelectAll(bool: boolean): void {
    fieldCategory.forEach((_, index) => {
      setValue(`categories.${index}.checked`, bool, { shouldDirty: true });
    });
    fieldUnivers.forEach((_, index) => {
      setValue(`universes.${index}.checked`, bool, { shouldDirty: true });
    });
  }

  return (
    <Sheet key={"left"}>
      <SheetTrigger className="relative flex justify-center items-center h-[50px] w-[40%]">
        <div
          className={cn(
            "text-xl font-bold border border-transparent hover:bg-secondary hover:border-primary hover:text-primary w-[100%]",
            buttonVariants({ variant: "cta" })
          )}
        >
          Filtres
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Filtres</SheetTitle>
          <SheetDescription>
            Faites votre sélection parmis nos univers colorés et populaires.
          </SheetDescription>
          <div className="flex justify-center items-center w-full gap-2">
            <Button variant={"action"} onClick={() => handleSelectAll(true)}>
              Tous
            </Button>
            <Button variant={"action"} onClick={() => handleSelectAll(false)}>
              Aucun
            </Button>
          </div>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <Label className="py-4 italic">Categories :</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap">
                    {fieldCategory.map((category: any, i) => (
                      <div
                        key={category._id} // Ensure unique key
                        className="flex items-center gap-2 justify-center p-1"
                      >
                        <CheckboxFilters
                          id={category._id}
                          checked={
                            watchedFields.categories?.[i]?.checked ?? false
                          }
                          {...register(`categories.${i}._id`)}
                          onCheckedChange={(checked: boolean) => {
                            setValue(`categories.${i}.checked`, checked, {
                              shouldDirty: true,
                            });
                          }}
                        >
                          {category.title}
                        </CheckboxFilters>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <Label className="py-4 italic">Univers :</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap">
                    {fieldUnivers.map((univers: any, i) => (
                      <div
                        key={univers._id} // Ensure unique key
                        className="flex items-center gap-2 justify-center p-1"
                      >
                        <CheckboxFilters
                          id={univers._id}
                          checked={
                            watchedFields.universes?.[i]?.checked ?? false
                          }
                          {...register(`universes.${i}._id`)}
                          onCheckedChange={(checked: boolean) => {
                            setValue(`universes.${i}.checked`, checked, {
                              shouldDirty: true,
                            });
                          }}
                        >
                          {univers.title}
                        </CheckboxFilters>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <Label className="py-4 italic">Prix :</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="rounded-none border-none h-10 w-full flex justify-center items-center">
                    <p className="px-2">{watch("price")[0]}</p>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[
                        getValues("price")[0],
                        getValues("price")[1],
                      ]}
                      onValueChange={handleSliderChange}
                    />
                    <p className="px-2">{watch("price")[1]}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <SheetFooter>
            <SheetClose
              asChild
              className="flex justify-center items-center w-full"
            >
              <Button type="submit" variant={"cta"}>
                Appliquer
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default FiltresAmigurumiWrapper;
