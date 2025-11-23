import { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { YearControls } from './components/YearControls';
import { DatabaseProvider, useDatabase } from './components/DatabaseContext';
import { LeafletLoader } from './components/LeafletLoader';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const [currentYear, setCurrentYear] = useState(1989);
  const { isLoading, error } = useDatabase();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Loading database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p>Error loading database:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-slate-800 text-white p-4 shadow-lg z-10">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h1>Eurasian Railway History Database 1832-1989</h1>
            <p className="text-sm text-slate-300 mt-1">
              Internal tool for database construction
            </p>
          </div>
          <div className="w-[32px] flex justify-end">
            <button
              type="button"
              title="We strongly condemn Russia's unjustified agression on Ukraine. Stand with Ukraine!"
              className="w-8 h-5 flex items-center justify-center rounded border border-slate-600 bg-slate-900 hover:bg-slate-700"
              aria-label="Show solidarity with Ukraine"
            >
              <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden="true">
                <rect width="32" height="10" y="0" fill="#005BBB" />
                <rect width="32" height="10" y="10" fill="#FFD500" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 relative">
        <MapView currentYear={currentYear} />
      </div>

      <div className="bg-slate-100 border-t border-slate-300 p-4">
        <YearControls 
          currentYear={currentYear}
          onYearChange={setCurrentYear}
          minYear={1832}
          maxYear={1989}
        />
        
        <div className="mt-3 flex gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-black"></div>
            <span>Existing segments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-green-600"></div>
            <span>Newly constructed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-orange-600"></div>
            <span>Electrified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-purple-600"></div>
            <span>Gauge change</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-red-600"></div>
            <span>Closed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-black"></div>
            <span>Station</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-yellow-500 bg-yellow-200"></div>
            <span>Mock station (zoom to see radius)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <LeafletLoader />
      <AppContent />
    </DatabaseProvider>
  );
}
