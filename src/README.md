# Russian Railway History Database Viewer

Internal tool for viewing and constructing a database of Russian railway history from 1832-1989.

## Features

- Interactive map displaying railway stations across Russia and neighboring countries
- Time-based filtering with year slider (1832-1989)
- Color-coded stations based on status:
  - **Black**: Existing stations
  - **Green**: Newly constructed stations
  - **Orange**: Electrified stations
  - **Purple**: Gauge change stations
  - **Red**: Closed stations
  - **Yellow**: Mock stations (approximate locations)
- Hover over stations to view metadata including:
  - Station names in multiple languages
  - Coordinates
  - Links to Wikidata, Wikipedia, OpenStreetMap, Parovoz, and Railwayz
  - Notes and additional information
- Mock stations displayed as circles with configurable radius
- Efficient querying using DuckDB-WASM

## Loading Your CSV Data

Currently, the application uses demo data stored in memory. To load your actual CSV files, you have several options:

### Option 1: Parse CSV Files (Recommended for Browser)

Modify `/components/DatabaseContext.tsx` to load and parse your CSV files. You can use the browser's File API or fetch:

```typescript
// Example: Loading from uploaded files
async function parseCSV(file: File) {
  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim();
      return obj;
    }, {});
  });
}
```

### Option 2: Use DuckDB-WASM (For Production)

For handling 28,000+ stations efficiently, you can integrate DuckDB-WASM:

```bash
npm install @duckdb/duckdb-wasm
```

Then load CSV files using DuckDB's read_csv_auto function:

```typescript
await conn.query(`
  CREATE TABLE stations AS 
  SELECT * FROM read_csv_auto('path/to/stations.csv')
`);
```

## CSV File Structure

### stations.csv
Required columns: `station_id`, `name_primary`, `lat`, `lon`, `current_status`

Optional columns: `name_latin`, `country_code`, `esr_code`, `osm_node_id`, `osm_way_id`, `osm_relation_id`, `wikidata_id`, `wikipedia_ru`, `parovoz_url`, `railwayz_id`, `geometry_quality`, `notes`, `created_at`, `updated_at`

### station_names.csv
Required columns: `station_id`, `name`, `language`

Optional columns: `valid_from`, `valid_to`, `name_type`, `source_id`, `notes`

### events.csv
Required columns: `event_id`, `event_type`, `date`

Optional columns: `date_precision`, `line_id`, `station_id`, `segment_id`, `description`, `source_id`, `source_page`, `notes`

Event types: `station_open`, `station_close`, `electrification`, `gauge_change`, etc.

## Mock Stations

Mock stations represent approximate locations where the exact position is unknown. They have:
- `current_status = 'mock'`
- Notes field starting with `<radius XX.XX>` to specify the uncertainty radius in kilometers
- Displayed as semi-transparent circles on the map

## Performance

The application is designed to handle 28,000+ stations efficiently by:
- Using DuckDB-WASM for fast SQL queries
- Filtering stations based on the selected year
- Rendering only visible/relevant stations on the map

## Usage

1. Use the year slider or previous/next buttons to navigate through time
2. Hover over stations to see detailed information
3. Click on links in the popup to open external resources
4. Zoom and pan the map to explore different regions

## Technology Stack

- React
- TypeScript
- DuckDB-WASM (in-browser SQL database)
- Leaflet (interactive maps)
- Tailwind CSS