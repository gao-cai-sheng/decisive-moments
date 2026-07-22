import { useMemo } from "react";
import type { RelationshipType } from "../data/schemas";
import { useT, type MessageKey } from "../i18n";
import { useAppStore } from "../store/appStore";

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange(value: string): void;
}) {
  const t = useT();
  return (
    <label className="hud-filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{t("common.all")}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TopHud() {
  const t = useT();
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const toggleCollections = useAppStore((state) => state.toggleCollections);
  const toggleSettings = useAppStore((state) => state.toggleSettings);
  const toggleContribute = useAppStore((state) => state.toggleContribute);
  const philosophers = useAppStore((state) => state.philosophers);
  const relationships = useAppStore((state) => state.relationships);
  const filters = useAppStore((state) => state.filters);
  const setFilter = useAppStore((state) => state.setFilter);
  const clearFilters = useAppStore((state) => state.clearFilters);
  const toggleRelationshipType = useAppStore((state) => state.toggleRelationshipType);

  const options = useMemo(
    () => ({
      civilizations: uniqueSorted(philosophers.map((item) => item.civilization)),
      periods: uniqueSorted(philosophers.flatMap((item) => item.periods)),
      traditions: uniqueSorted(philosophers.flatMap((item) => item.traditions)),
      themes: uniqueSorted(philosophers.flatMap((item) => item.themes)),
      relationshipTypes: uniqueSorted(relationships.map((item) => item.type)) as RelationshipType[],
    }),
    [philosophers, relationships],
  );

  return (
    <header className="hud-top">
      <div className="brand">{t("brand.title")}</div>
      <input
        className="search-input"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder={t("hud.searchPlaceholder")}
        aria-label={t("hud.searchAria")}
      />
      <div className="hud-filters" aria-label={t("hud.filtersAria")}>
        <SelectFilter
          label={t("hud.civilization")}
          value={filters.civilization ?? ""}
          options={options.civilizations}
          onChange={(value) => setFilter("civilization", value)}
        />
        <SelectFilter
          label={t("hud.period")}
          value={filters.period ?? ""}
          options={options.periods}
          onChange={(value) => setFilter("period", value)}
        />
        <SelectFilter
          label={t("hud.tradition")}
          value={filters.tradition ?? ""}
          options={options.traditions}
          onChange={(value) => setFilter("tradition", value)}
        />
        <SelectFilter
          label={t("hud.theme")}
          value={filters.theme ?? ""}
          options={options.themes}
          onChange={(value) => setFilter("theme", value)}
        />
        <div className="relationship-type-filters" aria-label={t("hud.relationshipFiltersAria")}>
          {options.relationshipTypes.map((type) => {
            const selected = filters.relationshipTypes.includes(type);
            return (
              <button
                className="hud-chip"
                aria-pressed={selected}
                key={type}
                type="button"
                onClick={() => toggleRelationshipType(type)}
              >
                {t(`relationshipType.${type}` as MessageKey)}
              </button>
            );
          })}
        </div>
        <button className="hud-button" type="button" onClick={clearFilters}>
          {t("hud.clearFilters")}
        </button>
      </div>
      <button className="hud-button" type="button" onClick={toggleCollections}>
        {t("hud.collections")}
      </button>
      <button className="hud-button" type="button" onClick={toggleContribute}>
        {t("contribute.open")}
      </button>
      <button className="hud-button" type="button" onClick={toggleSettings}>
        {t("hud.settings")}
      </button>
    </header>
  );
}
