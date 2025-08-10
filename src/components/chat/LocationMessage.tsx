"use client";

import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Card, CardContent } from '../ui/card';

type LocationMessageProps = {
    latitude: number;
    longitude: number;
    description: string;
};

export function LocationMessage({ latitude, longitude, description }: LocationMessageProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map | null>(null);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            const coordinates = fromLonLat([longitude, latitude]);

            const marker = new Feature({
                geometry: new Point(coordinates),
            });
            
            // Using a public domain pin icon
            const iconStyle = new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: '/image/marker-icon.png',
                    scale: 0.05,
                }),
            });

            marker.setStyle(iconStyle);

            const vectorSource = new VectorSource({
                features: [marker],
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });
            
            mapInstance.current = new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                    vectorLayer,
                ],
                view: new View({
                    center: coordinates,
                    zoom: 15,
                }),
                controls: [],
            });
        }
    }, [latitude, longitude]);

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div ref={mapRef} className="w-64 h-40 rounded-lg overflow-hidden" data-ai-hint="map location"></div>
                {description && <p className="text-sm pt-2">{description}</p>}
            </CardContent>
        </Card>
    );
}
