"use client";

import type { CatalogFilters as FiltersType } from "@/app/api/catalog/route";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

interface FilterOptions {
  themes: string[];
  regions: string[];
  accessMethods: string[];
}

interface CatalogFiltersProps {
  onFiltersChange: (filters: FiltersType) => void;
  initialFilters?: FiltersType;
  filterOptions?: {
    themes: string[];
    regions: string[];
    accessMethods: string[];
  };
}

export function CatalogFilters({
  onFiltersChange,
  initialFilters,
  filterOptions: propFilterOptions,
}: CatalogFiltersProps) {
  const [filters, setFilters] = useState<FiltersType>(initialFilters || {});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    themes: [],
    regions: [],
    accessMethods: [],
  });

  useEffect(() => {
    // Use prop filter options if available, otherwise fetch
    if (propFilterOptions) {
      setFilterOptions(propFilterOptions);
    } else {
      // Fetch filter options only if not provided
      fetch("/api/catalog")
        .then((res) => res.json())
        .then((data) => {
          setFilterOptions(data.filters);
        })
        .catch(console.error);
    }
  }, [propFilterOptions]);

  // Sync internal state when initialFilters change (e.g., when cleared externally)
  useEffect(() => {
    setFilters(initialFilters || {});
  }, [initialFilters]);

  const handleFilterChange = (type: keyof FiltersType, value: string) => {
    const newFilters = { ...filters };

    if (type === "theme" || type === "region" || type === "accessMethod") {
      // For radio button behavior - only one selection per group
      newFilters[type] = newFilters[type] === value ? undefined : value;
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FiltersType = {
      theme: undefined,
      region: undefined,
      accessMethod: undefined,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-background-2 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-foreground hover:text-foreground hover:underline font-medium"
        >
          Limpar
        </button>
      </div>

      {/* Theme Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Tema</h3>
        <div className="space-y-2">
          {filterOptions.themes.map((theme) => (
            <div key={theme} className="flex items-center space-x-2">
              <Checkbox
                id={`theme-${theme}`}
                checked={filters.theme === theme}
                onCheckedChange={() => handleFilterChange("theme", theme)}
                className="shadow-none rounded-sm w-4 h-4 bg-checkbox border-foreground/20"
              />
              <label
                htmlFor={`theme-${theme}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {theme}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Region Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Região</h3>
        <div className="space-y-2">
          {filterOptions.regions.map((region) => (
            <div key={region} className="flex items-center space-x-2">
              <Checkbox
                id={`region-${region}`}
                checked={filters.region === region}
                onCheckedChange={() => handleFilterChange("region", region)}
                className="shadow-none rounded-sm w-4 h-4 bg-checkbox border-foreground/20"
              />
              <label
                htmlFor={`region-${region}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {region}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Access Method Filter */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Forma de acesso
        </h3>
        <div className="space-y-2">
          {filterOptions.accessMethods.map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={`access-${method}`}
                checked={filters.accessMethod === method}
                onCheckedChange={() =>
                  handleFilterChange("accessMethod", method)
                }
                className="shadow-none rounded-sm w-4 h-4 bg-checkbox border-foreground/20"
              />
              <label
                htmlFor={`access-${method}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {method}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
