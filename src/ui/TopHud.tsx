import { useMemo } from "react";
import type { RelationshipType } from "../data/schemas";
import { useAppStore } from "../store/appStore";

const relationshipTypeLabels: Record<RelationshipType, string> = {
  direct_student: "师承",
  influence: "影响",
  school: "学派",
  shared_problem: "共同问题",
  critique: "批判",
  reception: "接受",
};

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
  return (
    <label className="hud-filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">全部</option>
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
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const toggleCollections = useAppStore((state) => state.toggleCollections);
  const toggleSettings = useAppStore((state) => state.toggleSettings);
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
      <div className="brand">群星闪耀时</div>
      <input
        className="search-input"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="搜索哲人、文明、命题..."
        aria-label="搜索哲人、文明、命题"
      />
      <div className="hud-filters" aria-label="星图筛选">
        <SelectFilter
          label="文明"
          value={filters.civilization ?? ""}
          options={options.civilizations}
          onChange={(value) => setFilter("civilization", value)}
        />
        <SelectFilter
          label="时期"
          value={filters.period ?? ""}
          options={options.periods}
          onChange={(value) => setFilter("period", value)}
        />
        <SelectFilter
          label="传统"
          value={filters.tradition ?? ""}
          options={options.traditions}
          onChange={(value) => setFilter("tradition", value)}
        />
        <SelectFilter
          label="主题"
          value={filters.theme ?? ""}
          options={options.themes}
          onChange={(value) => setFilter("theme", value)}
        />
        <div className="relationship-type-filters" aria-label="关系类型筛选">
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
                {relationshipTypeLabels[type] ?? type}
              </button>
            );
          })}
        </div>
        <button className="hud-button" type="button" onClick={clearFilters}>
          清除筛选
        </button>
      </div>
      <button className="hud-button" type="button" onClick={toggleCollections}>
        收藏
      </button>
      <button className="hud-button" type="button" onClick={toggleSettings}>
        设置
      </button>
    </header>
  );
}
