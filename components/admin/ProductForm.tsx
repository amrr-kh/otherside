"use client";

import { CustomSelect } from "@/components/CustomSelect";

export type ProductFormValues = {
  name: string;
  shortDescription: string;
  fullDescription: string;
  basePrice: number;
  compareAtPrice: number | null;
  categoryName: string;
  gender: "WOMEN" | "MEN" | "UNISEX";
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  material: string;
  fit: string;
  care: string;
  featured: boolean;
  isNewDrop: boolean;
  trending: boolean;
};

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  shortDescription: "",
  fullDescription: "",
  basePrice: 0,
  compareAtPrice: null,
  categoryName: "",
  gender: "UNISEX",
  status: "DRAFT",
  material: "",
  fit: "",
  care: "",
  featured: false,
  isNewDrop: false,
  trending: false,
};

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";
const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-soft-black/50";

export function ProductForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: Partial<ProductFormValues>;
  submitLabel: string;
}) {
  const values = { ...EMPTY_VALUES, ...defaultValues };

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          Product Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={values.name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="shortDescription" className={labelClass}>
          Short Description
        </label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          required
          rows={2}
          defaultValue={values.shortDescription}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="fullDescription" className={labelClass}>
          Full Description
        </label>
        <textarea
          id="fullDescription"
          name="fullDescription"
          required
          rows={5}
          defaultValue={values.fullDescription}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="basePrice" className={labelClass}>
            Price (EGP)
          </label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={values.basePrice || ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="compareAtPrice" className={labelClass}>
            Compare-at Price (optional)
          </label>
          <input
            id="compareAtPrice"
            name="compareAtPrice"
            type="number"
            min={0}
            step="0.01"
            defaultValue={values.compareAtPrice ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>
            Category (optional)
          </label>
          <input
            id="category"
            name="category"
            placeholder="e.g. Hoodies"
            defaultValue={values.categoryName}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="gender" className={labelClass}>
            Gender
          </label>
          <CustomSelect
            id="gender"
            name="gender"
            defaultValue={values.gender}
            theme="light"
            options={[
              { value: "UNISEX", label: "Unisex" },
              { value: "WOMEN", label: "Women" },
              { value: "MEN", label: "Men" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="material" className={labelClass}>
            Material
          </label>
          <input
            id="material"
            name="material"
            defaultValue={values.material}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="fit" className={labelClass}>
            Fit
          </label>
          <input
            id="fit"
            name="fit"
            defaultValue={values.fit}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="care" className={labelClass}>
            Care
          </label>
          <input
            id="care"
            name="care"
            defaultValue={values.care}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className={labelClass}>
          Status
        </label>
        <CustomSelect
          id="status"
          name="status"
          defaultValue={values.status}
          theme="light"
          className="max-w-40"
          options={[
            { value: "DRAFT", label: "Draft" },
            { value: "ACTIVE", label: "Active" },
            { value: "ARCHIVED", label: "Archived" },
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-soft-black/70">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={values.featured}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-soft-black/70">
          <input
            type="checkbox"
            name="isNewDrop"
            defaultChecked={values.isNewDrop}
          />
          New Drop
        </label>
        <label className="flex items-center gap-2 text-sm text-soft-black/70">
          <input
            type="checkbox"
            name="trending"
            defaultChecked={values.trending}
          />
          Trending
        </label>
      </div>

      <button
        type="submit"
        className="w-fit bg-soft-black px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-warm-white transition-opacity hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
