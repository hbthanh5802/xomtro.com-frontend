import { env } from '@/configs/environment.config';
import { Button, ButtonGroup } from '@mui/joy';
import { FeatureCollection, Polygon } from 'geojson';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import { MdLightMode, MdNightlight, MdSatelliteAlt } from 'react-icons/md';
import { RiTrafficLightFill } from 'react-icons/ri';
import { toast } from 'sonner';

mapboxgl.accessToken = env.MAPBOX_API_KEY;
const GOONG_API_KEY = env.GOONG_API_KEY as string;

interface MapBoxProps {
  center: [number, number]; // [longitude, latitude]
  zoom?: number;
  className?: string;
  scrollZoom?: boolean;
  dragPan?: boolean;
  doubleClickZoom?: boolean;
  radius?: number;
  fillColor?: string;
  fillOpacity?: number;
  showToggleMapStyle?: boolean;
}

// Object quản lý các kiểu bản đồ
const MapStyle = {
  NORMAL: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_API_KEY}`,
  SATELLITE: `https://tiles.goong.io/assets/goong_satellite.json?api_key=${GOONG_API_KEY}`,
  TRAFFIC: `https://tiles.goong.io/assets/goong_traffic_map.json?api_key=${GOONG_API_KEY}`,
  DARK: `mapbox://styles/mapbox/dark-v11`,
  LIGHT: `mapbox://styles/mapbox/light-v11`,
} as const;

const MapBox: React.FC<MapBoxProps> = (props) => {
  const {
    center,
    zoom = 10,
    className,
    scrollZoom = false,
    dragPan = false,
    doubleClickZoom = false,
    radius = 5000,
    fillColor = '#ff0000',
    fillOpacity = 0.3,
    showToggleMapStyle,
  } = props;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  // Hàm vẽ vòng tròn
  const drawCircle = (center: [number, number], radiusInMeters: number): [number, number][] => {
    const points = 64;
    const coords = { latitude: center[1], longitude: center[0] };
    const km = radiusInMeters / 1000;
    const ret: [number, number][] = [];
    const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      ret.push([coords.longitude + x, coords.latitude + y]);
    }

    ret.push(ret[0]); // Đóng vòng tròn
    return ret;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Khởi tạo map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MapStyle.NORMAL,
      center: center,
      zoom: zoom,
      scrollZoom,
      dragPan,
      doubleClickZoom,
    });
    mapRef.current = map;

    map.on('load', () => {
      // Gắn marker
      new Marker().setLngLat(center).addTo(map);

      // Dữ liệu GeoJSON cho vòng tròn
      const circleData: FeatureCollection<Polygon> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [drawCircle(center, radius)], // Vòng tròn bán kính 5km
            },
            properties: {}, // Properties rỗng
          },
        ],
      };

      map.addSource('circle', {
        type: 'geojson',
        data: circleData,
      });

      map.addLayer({
        id: 'circle',
        type: 'fill',
        source: 'circle',
        layout: {},
        paint: {
          'fill-color': fillColor,
          'fill-opacity': fillOpacity,
          'fill-outline-color': '#000000',
        },
      });
    });

    return () => map.remove(); // Cleanup map khi component bị unmount
  }, [center, zoom, fillColor, fillOpacity, radius, scrollZoom, dragPan, doubleClickZoom]);

  // Hàm đổi kiểu bản đồ
  const changeStyle = (style: unknown, name: string) => {
    if (mapRef.current) {
      mapRef.current.setStyle(style as string);
      toast.info(`Style được chuyển sang: ${name}`);
    }
  };

  return (
    <div>
      <div ref={mapContainerRef} className={`map-container ${className ? className : ''}`} />
      {showToggleMapStyle && (
        <ButtonGroup buttonFlex={1} size='md' sx={{ flexWrap: 'wrap' }} aria-label='outlined primary button group'>
          <Button
            startDecorator={<FaMapLocationDot />}
            onClick={() => changeStyle(MapStyle.NORMAL, 'Xem bản đồ thường')}
          >
            Bản đồ thường
          </Button>
          <Button startDecorator={<MdSatelliteAlt />} onClick={() => changeStyle(MapStyle.SATELLITE, 'Xem từ vệ tinh')}>
            Bản đồ vệ tinh
          </Button>
          <Button
            startDecorator={<RiTrafficLightFill />}
            disabled
            onClick={() => changeStyle(MapStyle.TRAFFIC, 'Bản đồ giao thông')}
          >
            Bản đồ giao thông
          </Button>
          <Button
            startDecorator={<MdLightMode />}
            disabled
            variant='solid'
            onClick={() => changeStyle(MapStyle.LIGHT, 'Bản đồ sáng')}
          >
            Bản đồ sáng
          </Button>
          <Button startDecorator={<MdNightlight />} disabled onClick={() => changeStyle(MapStyle.DARK, 'Bản đồ tối')}>
            Bản đồ tối
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
};

export default MapBox;
