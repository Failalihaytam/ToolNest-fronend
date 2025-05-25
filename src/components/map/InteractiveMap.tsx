import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '@/app/services/listingService';
import { Link, useNavigate } from 'react-router-dom';

// Fix for default marker icons in Leaflet with Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import userIcon from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

let UserIcon = L.icon({
  iconUrl: userIcon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'user-location-marker'
});

L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
  listings: Listing[];
  onMarkerClick?: (listing: Listing) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ listings, onMarkerClick }) => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const userMarker = useRef<L.Marker | null>(null);

  // Ensure component only runs on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainer.current || !isMapVisible) return;

    console.log('Initializing map with container:', mapContainer.current);
    setIsLoading(true);

    try {
      // Initialize map
      map.current = L.map(mapContainer.current, {
        center: [40.7128, -74.0060],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Add attribution control
      L.control.attribution({
        position: 'bottomright'
      }).addTo(map.current);

      // Add zoom control
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map.current);

      // Use Stadia Maps as the primary tile provider
      const tileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 20
      });

      tileLayer.addTo(map.current);

      // Listen for tile loading events
      tileLayer.on('tileloadstart', () => {
        console.log('Tiles starting to load');
      });

      tileLayer.on('tileload', () => {
        console.log('Tiles loaded successfully');
        setIsMapInitialized(true);
        setIsLoading(false);
      });

      tileLayer.on('tileerror', (error) => {
        console.error('Tile loading error:', error);
        setIsLoading(false);
        // Fallback to OpenStreetMap if Stadia fails
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        });
        osmLayer.addTo(map.current!);
      });

      // Force a resize event after a short delay
      setTimeout(() => {
        if (map.current) {
          map.current.invalidateSize();
        }
      }, 100);

    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoading(false);
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setIsMapInitialized(false);
      setIsLoading(false);
    };
  }, [isMounted, isMapVisible]);

  // Handle user location
  const handleGetUserLocation = () => {
    console.log('Location button clicked');
    
    if (!isMounted || typeof window === 'undefined') {
      console.log('Component not mounted or window not available');
      return;
    }
    
    if (!isMapInitialized) {
      console.log('Map not initialized yet');
      alert('Please wait for the map to load completely before requesting location');
      return;
    }

    if (!map.current) {
      console.error('Map instance not found');
      return;
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    console.log('Requesting user location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Got user position:', position);
        const { longitude, latitude } = position.coords;
        setUserLocation([latitude, longitude]);

        // Remove existing user marker if it exists
        if (userMarker.current) {
          console.log('Removing existing user marker');
          userMarker.current.remove();
        }

        // Add user location marker with custom icon
        console.log('Adding new user marker at:', [latitude, longitude]);
        userMarker.current = L.marker([latitude, longitude], { icon: UserIcon })
          .bindPopup('Your Location')
          .addTo(map.current!);

        // Center map on user location
        console.log('Centering map on user location');
        map.current!.setView([latitude, longitude], 13);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please check your location permissions.');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Add listing markers
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || !map.current || !listings.length) return;

    console.log('Adding markers for listings:', listings);

    // Clear existing markers (except user marker)
    map.current.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker && layer !== userMarker.current) {
        map.current!.removeLayer(layer);
      }
    });

    // Add markers for each listing
    listings.forEach((listing) => {
      if (listing.latitude && listing.longitude) {
        console.log('Adding marker for listing:', listing);
        const popup = L.popup({ offset: [0, -20] })
          .setContent(`
            <div class="p-2">
              <h3 class="font-semibold">${listing.title}</h3>
              <p class="text-sm text-gray-600">$${listing.price_per_day}/day</p>
              <button 
                onclick="if (typeof window !== 'undefined') { window.dispatchEvent(new CustomEvent('viewListingDetails', { detail: ${listing.id} })); }"
                class="mt-2 px-3 py-1 bg-[#0ac5b2] text-white rounded-md text-sm inline-block cursor-pointer hover:bg-[#099c8d] transition-colors"
              >
                View Details
              </button>
            </div>
          `);

        L.marker([listing.latitude, listing.longitude])
          .bindPopup(popup)
          .addTo(map.current!);
      }
    });

    // Add event listener for custom event
    const handleViewDetails = (event: CustomEvent) => {
      const listingId = event.detail;
      navigate(`/tools/${listingId}`);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('viewListingDetails', handleViewDetails as EventListener);
    }

    // Force a resize event to ensure proper rendering
    map.current.invalidateSize();

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('viewListingDetails', handleViewDetails as EventListener);
      }
    };
  }, [listings, map.current, navigate, isMounted]);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsMapVisible(!isMapVisible);
          if (!isMapVisible && map.current) {
            setTimeout(() => {
              map.current?.invalidateSize();
            }, 100);
          }
        }}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Show Map"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isMapVisible && (
        <div className="absolute top-full right-0 mt-2 w-[400px] h-[400px] bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="relative w-full h-full">
            <button
              onClick={() => setIsMapVisible(false)}
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            
            {/* Add "Center on my location" button */}
            <button
              onClick={handleGetUserLocation}
              className="absolute bottom-16 left-4 z-[1000] bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
              title="Center on my location"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '400px' }} />
            
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap; 