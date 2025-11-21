import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YearControlsProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  minYear: number;
  maxYear: number;
}

export function YearControls({ currentYear, onYearChange, minYear, maxYear }: YearControlsProps) {
  const handlePrevious = () => {
    if (currentYear > minYear) {
      onYearChange(currentYear - 1);
    }
  };

  const handleNext = () => {
    if (currentYear < maxYear) {
      onYearChange(currentYear + 1);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onYearChange(parseInt(e.target.value));
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePrevious}
        disabled={currentYear <= minYear}
        className="p-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous year"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 flex items-center gap-3">
        <span className="min-w-[4rem]">{minYear}</span>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={handleSliderChange}
          className="flex-1 h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #334155 0%, #334155 ${((currentYear - minYear) / (maxYear - minYear)) * 100}%, #cbd5e1 ${((currentYear - minYear) / (maxYear - minYear)) * 100}%, #cbd5e1 100%)`
          }}
        />
        <span className="min-w-[4rem] text-right">{maxYear}</span>
      </div>

      <button
        onClick={handleNext}
        disabled={currentYear >= maxYear}
        className="p-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next year"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="px-4 py-2 bg-slate-700 text-white rounded min-w-[5rem] text-center">
        {currentYear}
      </div>
    </div>
  );
}
