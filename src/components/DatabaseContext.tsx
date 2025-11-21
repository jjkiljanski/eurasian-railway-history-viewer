import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Station {
  station_id: string;
  name_primary: string;
  name_latin?: string;
  lat: number;
  lon: number;
  country_code?: string;
  esr_code?: string;
  osm_node_id?: string;
  osm_way_id?: string;
  osm_relation_id?: string;
  wikidata_id?: string;
  wikipedia_ru?: string;
  parovoz_url?: string;
  railwayz_id?: string;
  current_status: string;
  geometry_quality?: string;
  notes?: string;
}

interface StationName {
  station_id: string;
  name: string;
  language: string;
  valid_from?: string;
  valid_to?: string;
  name_type?: string;
  source_id?: string;
  notes?: string;
}

interface Event {
  event_id: string;
  event_type: string;
  date: string;
  date_precision?: string;
  line_id?: string;
  station_id?: string;
  segment_id?: string;
  description?: string;
  source_id?: string;
  source_page?: string;
  notes?: string;
}

interface Segment {
  segment_id: string;
  from_station_id: string;
  to_station_id: string;
  geometry: [number, number][]; // Array of [lat, lon] coordinates
  geometry_source?: string;
  geometry_quality?: string;
  is_current?: boolean;
  notes?: string;
}

interface DatabaseContextType {
  stations: Station[];
  stationNames: StationName[];
  events: Event[];
  segments: Segment[];
  isLoading: boolean;
  error: string | null;
  queryDataForYear: (year: number) => { stations: StationWithState[], segments: SegmentWithState[] };
}

interface StationWithState extends Station {
  state: 'existing' | 'new' | 'electrified' | 'gauge_change' | 'closed';
  alternative_names: { [key: string]: string };
}

interface SegmentWithState extends Segment {
  state: 'existing' | 'new' | 'electrified' | 'gauge_change' | 'closed';
}

const DatabaseContext = createContext<DatabaseContextType>({
  stations: [],
  stationNames: [],
  events: [],
  segments: [],
  isLoading: true,
  error: null,
  queryDataForYear: () => ({ stations: [], segments: [] }),
});

export const useDatabase = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [stationNames, setStationNames] = useState<StationName[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load demo data
    const demoStations: Station[] = [
      { station_id: 'STN_0001', name_primary: 'Москва-Пассажирская', name_latin: 'Moskva-Passazhirskaya', lat: 55.7765, lon: 37.6550, country_code: 'RU', osm_node_id: '123', wikidata_id: 'Q123', wikipedia_ru: 'Москва-Пассажирская', parovoz_url: 'http://parovoz.com/moscow', railwayz_id: 'moscow-pass', current_status: 'open', geometry_quality: 'high' },
      { station_id: 'STN_0002', name_primary: 'Санкт-Петербург-Главный', name_latin: 'Sankt-Peterburg-Glavny', lat: 59.9311, lon: 30.3609, country_code: 'RU', osm_node_id: '124', wikidata_id: 'Q124', current_status: 'open', geometry_quality: 'high' },
      { station_id: 'STN_0003', name_primary: 'Владивосток', name_latin: 'Vladivostok', lat: 43.1056, lon: 131.8735, country_code: 'RU', osm_node_id: '125', wikidata_id: 'Q125', wikipedia_ru: 'Владивосток_(вокзал)', current_status: 'open', geometry_quality: 'high' },
      { station_id: 'STN_0004', name_primary: 'Екатеринбург-Пассажирский', name_latin: 'Yekaterinburg-Passazhirsky', lat: 56.8519, lon: 60.6122, country_code: 'RU', current_status: 'open', geometry_quality: 'medium' },
      { station_id: 'STN_0005', name_primary: 'Новосибирск-Главный', name_latin: 'Novosibirsk-Glavny', lat: 55.0415, lon: 82.9346, country_code: 'RU', wikidata_id: 'Q126', current_status: 'open', geometry_quality: 'high' },
      { station_id: 'STN_0006', name_primary: 'Иркутск-Пассажирский', name_latin: 'Irkutsk-Passazhirsky', lat: 52.2869, lon: 104.3050, country_code: 'RU', current_status: 'closed', geometry_quality: 'medium' },
      { station_id: 'STN_0007', name_primary: 'Неизвестная станция', name_latin: 'Unknown Station', lat: 60.0, lon: 100.0, country_code: 'RU', current_status: 'mock', geometry_quality: 'low', notes: '<radius 5.50> Approximate location' },
      { station_id: 'STN_0008', name_primary: 'Казань', name_latin: 'Kazan', lat: 55.7887, lon: 49.1221, country_code: 'RU', wikidata_id: 'Q127', wikipedia_ru: 'Казань_(вокзал)', parovoz_url: 'http://parovoz.com/kazan', current_status: 'open', geometry_quality: 'high' },
    ];

    const demoStationNames: StationName[] = [
      { station_id: 'STN_0001', name: 'Moscow Passenger', language: 'en' },
      { station_id: 'STN_0001', name: 'Moskau Passagier', language: 'de' },
      { station_id: 'STN_0002', name: 'Saint Petersburg Main', language: 'en' },
      { station_id: 'STN_0003', name: 'Vladivostok Station', language: 'en' },
      { station_id: 'STN_0008', name: 'Kazan Station', language: 'en' },
    ];

    const demoEvents: Event[] = [
      { event_id: 'EVT_0001', event_type: 'station_open', date: '1851-11-01', date_precision: 'month', station_id: 'STN_0001', description: 'Moscow Passenger opened' },
      { event_id: 'EVT_0002', event_type: 'station_open', date: '1851-11-01', date_precision: 'month', station_id: 'STN_0002', description: 'Saint Petersburg opened' },
      { event_id: 'EVT_0003', event_type: 'station_open', date: '1903-07-21', date_precision: 'day', station_id: 'STN_0003', description: 'Vladivostok opened' },
      { event_id: 'EVT_0004', event_type: 'station_open', date: '1878-05-01', date_precision: 'month', station_id: 'STN_0004', description: 'Yekaterinburg opened' },
      { event_id: 'EVT_0005', event_type: 'station_open', date: '1893-04-01', date_precision: 'month', station_id: 'STN_0005', description: 'Novosibirsk opened' },
      { event_id: 'EVT_0006', event_type: 'station_open', date: '1898-08-16', date_precision: 'day', station_id: 'STN_0006', description: 'Irkutsk opened' },
      { event_id: 'EVT_0007', event_type: 'station_close', date: '1975-06-01', date_precision: 'month', station_id: 'STN_0006', description: 'Irkutsk closed' },
      { event_id: 'EVT_0008', event_type: 'electrification', date: '1935-12-15', date_precision: 'day', station_id: 'STN_0001', description: 'Moscow electrified' },
      { event_id: 'EVT_0009', event_type: 'electrification', date: '1936-01-10', date_precision: 'day', station_id: 'STN_0002', description: 'Saint Petersburg electrified' },
      { event_id: 'EVT_0010', event_type: 'station_open', date: '1860-01-01', date_precision: 'year', station_id: 'STN_0007', description: 'Mock station opened' },
      { event_id: 'EVT_0011', event_type: 'station_open', date: '1896-09-12', date_precision: 'day', station_id: 'STN_0008', description: 'Kazan opened' },
      
      // Segment events
      { event_id: 'EVT_SEG_0001', event_type: 'segment_open', date: '1851-11-01', date_precision: 'month', segment_id: 'SEG_0001', description: 'Moscow-Petersburg segment opened' },
      { event_id: 'EVT_SEG_0002', event_type: 'segment_open', date: '1916-10-05', date_precision: 'day', segment_id: 'SEG_0002', description: 'Trans-Siberian segment opened' },
      { event_id: 'EVT_SEG_0003', event_type: 'segment_open', date: '1916-10-05', date_precision: 'day', segment_id: 'SEG_0003', description: 'Trans-Siberian segment opened' },
      { event_id: 'EVT_SEG_0004', event_type: 'segment_open', date: '1896-10-01', date_precision: 'month', segment_id: 'SEG_0004', description: 'Trans-Siberian segment opened' },
      { event_id: 'EVT_SEG_0005', event_type: 'segment_open', date: '1898-08-16', date_precision: 'day', segment_id: 'SEG_0005', description: 'Trans-Siberian segment opened' },
      { event_id: 'EVT_SEG_0006', event_type: 'segment_open', date: '1900-01-01', date_precision: 'year', segment_id: 'SEG_0006', description: 'Northern segment opened' },
      { event_id: 'EVT_SEG_0007', event_type: 'segment_open', date: '1902-01-01', date_precision: 'year', segment_id: 'SEG_0007', description: 'Western connection opened' },
      { event_id: 'EVT_SEG_0008', event_type: 'electrification', date: '1935-12-15', date_precision: 'day', segment_id: 'SEG_0001', description: 'Moscow-Petersburg electrified' },
      { event_id: 'EVT_SEG_0009', event_type: 'segment_close', date: '1975-06-01', date_precision: 'month', segment_id: 'SEG_0005', description: 'Irkutsk segment closed' },
    ];

    const demoSegments: Segment[] = [
      { segment_id: 'SEG_0001', from_station_id: 'STN_0001', to_station_id: 'STN_0002', geometry: [[55.7765, 37.6550], [59.9311, 30.3609]], geometry_quality: 'high' },
      { segment_id: 'SEG_0002', from_station_id: 'STN_0002', to_station_id: 'STN_0003', geometry: [[59.9311, 30.3609], [43.1056, 131.8735]], geometry_quality: 'high' },
      { segment_id: 'SEG_0003', from_station_id: 'STN_0003', to_station_id: 'STN_0004', geometry: [[43.1056, 131.8735], [56.8519, 60.6122]], geometry_quality: 'medium' },
      { segment_id: 'SEG_0004', from_station_id: 'STN_0004', to_station_id: 'STN_0005', geometry: [[56.8519, 60.6122], [55.0415, 82.9346]], geometry_quality: 'high' },
      { segment_id: 'SEG_0005', from_station_id: 'STN_0005', to_station_id: 'STN_0006', geometry: [[55.0415, 82.9346], [52.2869, 104.3050]], geometry_quality: 'medium' },
      { segment_id: 'SEG_0006', from_station_id: 'STN_0006', to_station_id: 'STN_0007', geometry: [[52.2869, 104.3050], [60.0, 100.0]], geometry_quality: 'low' },
      { segment_id: 'SEG_0007', from_station_id: 'STN_0007', to_station_id: 'STN_0008', geometry: [[60.0, 100.0], [55.7887, 49.1221]], geometry_quality: 'high' },
    ];

    setStations(demoStations);
    setStationNames(demoStationNames);
    setEvents(demoEvents);
    setSegments(demoSegments);
    setIsLoading(false);
  }, []);

  const queryDataForYear = (year: number): { stations: StationWithState[], segments: SegmentWithState[] } => {
    // Group events by station
    const stationEventMap = new Map<string, Event[]>();
    events.forEach(event => {
      if (event.station_id) {
        if (!stationEventMap.has(event.station_id)) {
          stationEventMap.set(event.station_id, []);
        }
        stationEventMap.get(event.station_id)!.push(event);
      }
    });

    // Group alternative names by station
    const namesByStation = new Map<string, Array<{ name: string; language: string }>>();
    stationNames.forEach(sn => {
      if (!namesByStation.has(sn.station_id)) {
        namesByStation.set(sn.station_id, []);
      }
      namesByStation.get(sn.station_id)!.push({ name: sn.name, language: sn.language });
    });

    const resultStations: StationWithState[] = [];

    stations.forEach(station => {
      const stationEvents = stationEventMap.get(station.station_id) || [];
      
      // Find relevant events up to the current year
      const openEvent = stationEvents
        .filter(e => e.event_type === 'station_open')
        .map(e => ({ ...e, year: new Date(e.date).getFullYear() }))
        .filter(e => e.year <= year)
        .sort((a, b) => b.year - a.year)[0];

      const closeEvent = stationEvents
        .filter(e => e.event_type === 'station_close')
        .map(e => ({ ...e, year: new Date(e.date).getFullYear() }))
        .filter(e => e.year <= year)
        .sort((a, b) => b.year - a.year)[0];

      const electrificationEvent = stationEvents
        .filter(e => e.event_type === 'electrification')
        .map(e => ({ ...e, year: new Date(e.date).getFullYear() }))
        .filter(e => e.year <= year)
        .sort((a, b) => b.year - a.year)[0];

      // Determine if station should be shown
      if (!openEvent) return; // Station not yet opened
      if (closeEvent && closeEvent.year < year) return; // Station was closed before this year

      // Determine state
      let state: 'existing' | 'new' | 'electrified' | 'gauge_change' | 'closed';
      if (closeEvent && closeEvent.year === year) {
        state = 'closed';
      } else if (electrificationEvent && electrificationEvent.year === year) {
        state = 'electrified';
      } else if (openEvent.year === year) {
        state = 'new';
      } else {
        state = 'existing';
      }

      // Build alternative names
      const altNames: { [key: string]: string } = {};
      const stationNamesList = namesByStation.get(station.station_id) || [];
      const langCounts: { [key: string]: number } = {};
      
      for (const { name, language } of stationNamesList) {
        if (!langCounts[language]) {
          langCounts[language] = 0;
        }
        langCounts[language]++;
        const suffix = langCounts[language] > 1 ? `_${langCounts[language] - 1}` : '';
        altNames[`name:${language}${suffix}`] = name;
      }

      resultStations.push({
        ...station,
        state,
        alternative_names: altNames,
      });
    });

    // Group events by segment
    const segmentEventMap = new Map<string, Event[]>();
    events.forEach(event => {
      if (event.segment_id) {
        if (!segmentEventMap.has(event.segment_id)) {
          segmentEventMap.set(event.segment_id, []);
        }
        segmentEventMap.get(event.segment_id)!.push(event);
      }
    });

    const resultSegments: SegmentWithState[] = [];

    segments.forEach(segment => {
      const segmentEvents = segmentEventMap.get(segment.segment_id) || [];
      
      // Find relevant events up to the current year
      const openEvent = segmentEvents
        .filter(e => e.event_type === 'segment_open')
        .map(e => ({ ...e, year: new Date(e.date).getFullYear() }))
        .filter(e => e.year <= year)
        .sort((a, b) => b.year - a.year)[0];

      const closeEvent = segmentEvents
        .filter(e => e.event_type === 'segment_close')
        .map(e => ({ ...e, year: new Date(e.date).getFullYear() }))
        .filter(e => e.year <= year)
        .sort((a, b) => b.year - a.year)[0];

      const electrificationEvent = segmentEvents
        .filter(e => e.event_type === 'electrification')
        .map(e => ({ ...e, year: new Date(e.date).getFullYear() }))
        .filter(e => e.year <= year)
        .sort((a, b) => b.year - a.year)[0];

      // Determine if segment should be shown
      if (!openEvent) return; // Segment not yet opened
      if (closeEvent && closeEvent.year < year) return; // Segment was closed before this year

      // Determine state
      let state: 'existing' | 'new' | 'electrified' | 'gauge_change' | 'closed';
      if (closeEvent && closeEvent.year === year) {
        state = 'closed';
      } else if (electrificationEvent && electrificationEvent.year === year) {
        state = 'electrified';
      } else if (openEvent.year === year) {
        state = 'new';
      } else {
        state = 'existing';
      }

      resultSegments.push({
        ...segment,
        state,
      });
    });

    return { stations: resultStations, segments: resultSegments };
  };

  return (
    <DatabaseContext.Provider value={{ stations, stationNames, events, segments, isLoading, error, queryDataForYear }}>
      {children}
    </DatabaseContext.Provider>
  );
}