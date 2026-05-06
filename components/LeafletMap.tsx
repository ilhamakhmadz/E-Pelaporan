import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { WebView } from 'react-native-webview';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MarkerData {
  id: string;
  coordinate: Coordinate;
  title?: string;
  subtitle?: string;
  color?: string; // hex color
}

interface LeafletMapProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  markers?: MarkerData[];
  tempMarker?: Coordinate | null;
  onMapPress?: (coord: Coordinate) => void;
  onMarkerPress?: (id: string) => void;
  interactive?: boolean; // If true, allows picking location
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  style,
  initialRegion,
  markers = [],
  tempMarker,
  onMapPress,
  onMarkerPress,
  interactive = false,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Default to Bandung regency coordinates
  const centerLat = initialRegion?.latitude || -7.025253;
  const centerLng = initialRegion?.longitude || 107.519760;
  const zoom = initialRegion?.latitudeDelta ? Math.round(14 - Math.log2(initialRegion.latitudeDelta * 100)) : 11;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px;
          font-family: sans-serif;
          text-align: center;
        }
        .popup-title { font-weight: bold; margin-bottom: 4px; font-size: 14px; }
        .popup-subtitle { color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${centerLat}, ${centerLng}], ${zoom});
        
        // Add satellite/hybrid tile layer (Google Maps Hybrid equivalent)
        L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3']
        }).addTo(map);

        const markers = {};
        let tempMarkerObj = null;

        // Custom Icon helper
        const getCustomIcon = (color) => {
          return L.divIcon({
            className: 'custom-div-icon',
            html: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="\${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>\`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -36]
          });
        };

        const defaultBlueIcon = getCustomIcon('#2196F3');

        function updateMarkers(newMarkersData) {
          // Clear existing
          Object.values(markers).forEach(m => map.removeLayer(m));
          
          newMarkersData.forEach(data => {
            const icon = data.color ? getCustomIcon(data.color) : defaultBlueIcon;
            const m = L.marker([data.coordinate.latitude, data.coordinate.longitude], { icon }).addTo(map);
            
            if (data.title || data.subtitle) {
              const html = \`<div class="popup-title">\${data.title || ''}</div><div class="popup-subtitle">\${data.subtitle || ''}</div>\`;
              m.bindPopup(html, { className: 'custom-popup' });
            }
            
            m.on('click', () => {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: data.id }));
            });
            
            markers[data.id] = m;
          });
        }

        function setTempMarker(lat, lng) {
          if (tempMarkerObj) map.removeLayer(tempMarkerObj);
          tempMarkerObj = L.marker([lat, lng], { icon: getCustomIcon('#f39c12') }).addTo(map);
          const html = \`<div class="popup-title">Koordinat:</div><div class="popup-subtitle">Latitude: \${lat}<br>Longitude: \${lng}</div>\`;
          tempMarkerObj.bindPopup(html, { className: 'custom-popup' }).openPopup();
        }

        ${interactive ? `
        map.on('click', function(e) {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          setTempMarker(lat, lng);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapPress',
            coordinate: { latitude: lat, longitude: lng }
          }));
        });
        ` : ''}

        document.addEventListener('message', function(e) {
          try {
            const msg = JSON.parse(e.data);
            if (msg.type === 'updateMarkers') {
              updateMarkers(msg.markers);
            } else if (msg.type === 'setTempMarker') {
              setTempMarker(msg.coordinate.latitude, msg.coordinate.longitude);
              map.setView([msg.coordinate.latitude, msg.coordinate.longitude]);
            }
          } catch(err) {}
        });

      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    if (mapLoaded && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'updateMarkers', markers }));
      if (tempMarker) {
        webViewRef.current.postMessage(JSON.stringify({ type: 'setTempMarker', coordinate: tempMarker }));
      }
    }
  }, [markers, tempMarker, mapLoaded]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'mapPress' && onMapPress) {
        onMapPress(data.coordinate);
      } else if (data.type === 'markerPress' && onMarkerPress) {
        onMarkerPress(data.id);
      }
    } catch (e) {
      console.warn("Invalid message from WebView:", event.nativeEvent.data);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>
          Peta WebView hanya berjalan di perangkat mobile (Android/iOS).
        </Text>
      </View>
    );
  }

  return (
    <View style={style}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={StyleSheet.absoluteFillObject}
        onMessage={handleMessage}
        onLoadEnd={() => setMapLoaded(true)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    padding: 20,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#666',
  },
});
