import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

interface ComplaintMapProps {
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  selectedLocation?: { lat: number; lng: number };
  height?: string;
  showLocationButton?: boolean;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    description: string;
    status: 'submitted' | 'in-progress' | 'resolved';
  }>;
}

const LocationMarker: React.FC<{ onLocationSelect?: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect?.(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected location for complaint</Popup>
    </Marker>
  );
};

const ComplaintMap: React.FC<ComplaintMapProps> = ({
  onLocationSelect,
  selectedLocation,
  height = "400px",
  showLocationButton = true,
  markers = []
}) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Default center (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoadingLocation(false);
          
          // Pan map to user location
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    } else {
      setIsLoadingLocation(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'submitted': return '#f59e0b'; // amber
      case 'in-progress': return '#3b82f6'; // blue
      case 'resolved': return '#10b981'; // green
      default: return '#6b7280'; // gray
    }
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <div style={{ height }} className="relative">
          <MapContainer
            center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
            zoom={userLocation ? 15 : 6}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {onLocationSelect && <LocationMarker onLocationSelect={onLocationSelect} />}
            
            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>Your current location</Popup>
              </Marker>
            )}
            
            {/* Complaint markers */}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={new L.Icon({
                  iconUrl: `data:image/svg+xml;base64,${btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${getMarkerColor(marker.status)}">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  `)}`,
                  iconSize: [25, 25],
                  iconAnchor: [12, 25],
                  popupAnchor: [0, -25],
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">{marker.title}</h3>
                    <p className="text-sm text-gray-600">{marker.description}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
                      marker.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      marker.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {marker.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Location controls */}
          {showLocationButton && (
            <div className="absolute top-4 right-4 z-[1000]">
              <Button
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                size="sm"
                className="shadow-elegant"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {isLoadingLocation ? 'Loading...' : 'My Location'}
              </Button>
            </div>
          )}
          
          {onLocationSelect && (
            <div className="absolute bottom-4 left-4 z-[1000]">
              <Card className="p-3 bg-card/95 backdrop-blur">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Click on map to select location</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ComplaintMap;