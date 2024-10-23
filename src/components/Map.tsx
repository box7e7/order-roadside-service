/* eslint-disable */
// @ts-nocheck

import React, { useRef, useState, useEffect } from 'react';
import loader from '@/utils/googleMapsLoader';

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  onConfirmLocation: (location: { lat: number; lng: number }) => void;
}

const Map: React.FC<MapProps> = ({ center, zoom, onConfirmLocation }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    loader.load().then((google) => {
      if (ref.current) {
        const newMap = new google.maps.Map(ref.current, {
          center,
          zoom,
        });
        setMap(newMap);

        class CustomMarker extends google.maps.OverlayView {
          position: google.maps.LatLng;
          content: HTMLElement;

          constructor(position: google.maps.LatLng, map: google.maps.Map, onConfirm: () => void) {
            super();
            this.position = position;

            const container = document.createElement('div');
            container.className = 'custom-marker-container';

            const button = document.createElement('button');
            button.innerHTML = 'Confirm Location';
            button.className = 'custom-marker-button';
            button.onclick = onConfirm;

            const pin = document.createElement('div');
            pin.className = 'custom-marker-pin';

            container.appendChild(button);
            container.appendChild(pin);

            this.content = container;

            this.setMap(map);
          }

          onAdd() {
            const panes = this.getPanes();
            if (panes) {
              // Use type assertion here
              const pane = (panes as any).overlayImage;
              pane.appendChild(this.content);
            }
          }

          draw() {
            const overlayProjection = this.getProjection();
            const position = overlayProjection.fromLatLngToDivPixel(this.position)!;
            const div = this.content;
            div.style.left = position.x + 'px';
            div.style.top = position.y + 'px';
          }

          onRemove() {
            if (this.content.parentElement) {
              this.content.parentElement.removeChild(this.content);
            }
          }
        }

        new CustomMarker(
          new google.maps.LatLng(center.lat, center.lng),
          newMap,
          () => onConfirmLocation(center)
        );
      }
    });
  }, [center, zoom, onConfirmLocation]);

  return (
    <>
      <div ref={ref} className="w-full h-[400px] rounded-lg overflow-hidden" />
      <style jsx global>{`
        .custom-marker-container {
          position: absolute;
          transform: translate(-50%, -100%);
          cursor: pointer;
        }
        .custom-marker-button {
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
          white-space: nowrap;
          transition: background-color 0.3s, transform 0.3s;
        }
        .custom-marker-button:hover {
          background-color: #45a049;
          transform: scale(1.05);
        }
        .custom-marker-pin {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 15px solid #4CAF50;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </>
  );
}

export default Map;