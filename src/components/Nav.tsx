import { FilterAccordion } from "./FilterAccordion";
import React from "react";
import { Link } from "wouter";
import { useReportData } from "../contexts/reportData";
import { NavBarInfoBox } from "./NavBarInfoBox";

export function Nav() {
  const { processed, filters } = useReportData();
  return (
    <div className="w-80 flex flex-col h-full border-r border-neutral-200 py-2 px-4 top-0 sticky h-screen">
      <div className="flex gap-2 justify-around pb-2 mb-2">
        <Link className="link" to="/">
          Home
        </Link>
        <Link className="link" to="/files">
          Files
        </Link>
      </div>
      <div className="grow">
        <div className="flex justify-between">
          <span>Filters</span>
          <button
            className="btn btn-xs btn-outline"
            onClick={filters.resetFilters}
          >
            Reset
          </button>
        </div>
        <FilterAccordion processed={processed} {...filters} />
      </div>
      <NavBarInfoBox />
    </div>
  );
}
