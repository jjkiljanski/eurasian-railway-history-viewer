import { useEffect } from 'react';

export function LeafletLoader() {
  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet JavaScript
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    document.head.appendChild(script);

    // Load Leaflet Draw CSS
    const drawLink = document.createElement('link');
    drawLink.rel = 'stylesheet';
    drawLink.href = 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css';
    drawLink.crossOrigin = '';
    document.head.appendChild(drawLink);

    // Load Leaflet Draw JavaScript (after Leaflet)
    const drawScript = document.createElement('script');
    drawScript.src = 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js';
    drawScript.crossOrigin = '';
    document.head.appendChild(drawScript);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
      document.head.removeChild(drawLink);
      document.head.removeChild(drawScript);
    };
  }, []);

  return null;
}
