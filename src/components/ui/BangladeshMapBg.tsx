'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Accurate Bangladesh Map Background
 * Uses AnyChart with accurate GeoData as requested.
 */
export default function BangladeshMapBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load AnyChart scripts sequentially
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadAllScripts = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.15/proj4.js');
        await loadScript('https://cdn.anychart.com/releases/8.12.0/js/anychart-core.min.js');
        await loadScript('https://cdn.anychart.com/releases/8.12.0/js/anychart-map.min.js');
        await loadScript('https://cdn.anychart.com/geodata/2.2.0/countries/bangladesh/bangladesh.js');
        setScriptsLoaded(true);
      } catch (err) {
        console.error('Failed to load AnyChart scripts', err);
      }
    };

    loadAllScripts();
  }, []);

  useEffect(() => {
    if (!scriptsLoaded || !containerRef.current) return;

    const anychart = (window as any).anychart;
    if (!anychart) return;

    // Clear previous render to prevent duplicates in Strict Mode
    containerRef.current.innerHTML = '';

    anychart.onDocumentReady(function () {
      // create map
      var map = anychart.map();

      // create data set
      var dataSet = anychart.data.set([
        { "id": "BD.DA", "value": 0 },
        { "id": "BD.KH", "value": 1 },
        { "id": "BD.BA", "value": 2 },
        { "id": "BD.CG", "value": 3 },
        { "id": "BD.SY", "value": 4 },
        { "id": "BD.RJ", "value": 5 },
        { "id": "BD.RP", "value": 6 }
      ]);

      // create choropleth series
      var series = map.choropleth(dataSet);

      // set geoIdField to 'id', this field contains in geo data meta properties
      series.geoIdField('id');

      // set map color settings
      series.colorScale(anychart.scales.linearColor('#deebf7', '#3182bd'));
      series.hovered().fill('#addd8e');

      // set geo data, from AnyChart geo maps collection
      map.geoData(anychart.maps['bangladesh']);

      // Blend styling for background use
      map.credits().enabled(false);
      map.background().fill('transparent');

      // set map container id (div)
      map.container(containerRef.current!);

      // initiate map drawing
      map.draw();
    });

  }, [scriptsLoaded]);

  return (
    <div className="fixed inset-0 z-0 bg-white flex items-center justify-center">
      <div 
        ref={containerRef} 
        id="container"
        style={{ width: '100%', height: '100%', margin: 0, padding: 0 }} 
      />
    </div>
  );
}


