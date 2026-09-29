'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChannelPartner, PartnerType, NpaStatus } from '@/lib/types';
import { CHANNEL_PARTNERS_DATABASE } from '@/lib/channel-partners-data';
import { SCHEMES_DATABASE } from '@/lib/schemes-data';
import { 
  MapPin, 
  Navigation, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Compass, 
  Layers, 
  X,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface PartnerLocatorMapProps {
  initialSchemeId?: string;
  userState?: string;
}

// Calculate Haversine distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function PartnerLocatorMap({
  initialSchemeId,
  userState = 'Delhi'
}: PartnerLocatorMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<any>(null);

  // User coordinate state (defaults to New Delhi)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6139,
    lng: 77.2090
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [userLocationName, setUserLocationName] = useState<string>('New Delhi (Central)');

  // Filters
  const [selectedPartnerType, setSelectedPartnerType] = useState<string>('all');
  const [filterOutHighNpa, setFilterOutHighNpa] = useState<boolean>(true); // Smart routing ON by default
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>(initialSchemeId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected partner for detail modal / routing
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);
  const [routedSuccessPartner, setRoutedSuccessPartner] = useState<ChannelPartner | null>(null);
  const [routedDocketId, setRoutedDocketId] = useState<string>('SIH-CFS-849201');

  // Filtered & Distance-Sorted Partners
  const filteredPartners = useMemo(() => {
    return CHANNEL_PARTNERS_DATABASE
      .filter(partner => {
        // Partner Type filter
        if (selectedPartnerType !== 'all' && partner.type !== selectedPartnerType) {
          return false;
        }
        // NPA filter: If filterOutHighNpa is true, exclude HIGH_NPA_SUSPENDED
        if (filterOutHighNpa && partner.npaStatus === 'HIGH_NPA_SUSPENDED') {
          return false;
        }
        // Scheme filter
        if (selectedSchemeFilter !== 'all' && !partner.supportedSchemes.includes(selectedSchemeFilter)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = partner.name.toLowerCase().includes(q);
          const matchBranch = partner.branchName.toLowerCase().includes(q);
          const matchState = partner.state.toLowerCase().includes(q);
          const matchDistrict = partner.district.toLowerCase().includes(q);
          if (!matchName && !matchBranch && !matchState && !matchDistrict) return false;
        }
        return true;
      })
      .map(partner => ({
        ...partner,
        distanceKm: getDistanceKm(userCoords.lat, userCoords.lng, partner.lat, partner.lng)
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [selectedPartnerType, filterOutHighNpa, selectedSchemeFilter, searchQuery, userCoords]);

  // High NPA count bypassed
  const bypassedNpaCount = useMemo(() => {
    return CHANNEL_PARTNERS_DATABASE.filter(p => p.npaStatus === 'HIGH_NPA_SUSPENDED').length;
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      try {
        const L = (await import('leaflet')).default;

        if (!mapRef.current && mapContainerRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: [userCoords.lat, userCoords.lng],
            zoom: 6,
            scrollWheelZoom: true
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          markersLayerRef.current = L.layerGroup().addTo(map);
          mapRef.current = map;
        }

        // Render markers
        if (mapRef.current && markersLayerRef.current) {
          markersLayerRef.current.clearLayers();

          // Add User Marker
          const userCircle = L.circleMarker([userCoords.lat, userCoords.lng], {
            radius: 9,
            fillColor: '#2563eb',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
          }).bindPopup(`<b>Your Current Location</b><br/>${userLocationName}`);
          markersLayerRef.current.addLayer(userCircle);

          // Add Partner Markers
          filteredPartners.forEach(partner => {
            const isSelected = selectedPartner?.id === partner.id;
            let fillColor = '#10b981'; // Green for HEALTHY_ACTIVE
            if (partner.npaStatus === 'QUOTA_RESTRICTED') fillColor = '#f59e0b';
            if (partner.npaStatus === 'HIGH_NPA_SUSPENDED') fillColor = '#ef4444';

            const marker = L.circleMarker([partner.lat, partner.lng], {
              radius: isSelected ? 12 : 8,
              fillColor,
              color: isSelected ? '#111827' : '#ffffff',
              weight: isSelected ? 3 : 2,
              opacity: 1,
              fillOpacity: 0.9
            });

            marker.bindPopup(`
              <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
                <b style="font-size: 13px; color: #0f172a;">${partner.name}</b><br/>
                <span style="color: #64748b;">${partner.branchName}</span><br/>
                <div style="margin-top: 4px; padding: 2px 6px; border-radius: 4px; display: inline-block; font-weight: bold; font-size: 11px; background-color: ${
                  partner.npaStatus === 'HEALTHY_ACTIVE' ? '#d1fae5; color: #065f46' : partner.npaStatus === 'QUOTA_RESTRICTED' ? '#fef3c7; color: #92400e' : '#fee2e2; color: #991b1b'
                };">
                  ${partner.npaStatus === 'HEALTHY_ACTIVE' ? '✓ Eligible & Disbursing' : partner.npaStatus === 'QUOTA_RESTRICTED' ? '⚠ Quota Limited' : '✕ High NPA Suspended'}
                </div>
                <br/>
                <span style="font-size: 11px; color: #475569;">NPA: <b>${partner.npaRate}%</b> • Funds: <b>${partner.fundAllocationRemainingPercent}%</b></span>
                <br/>
                <span style="font-size: 11px; color: #059669; font-weight: 600;">Distance: ${partner.distanceKm} km</span>
              </div>
            `);

            marker.on('click', () => {
              setSelectedPartner(partner);
            });

            markersLayerRef.current.addLayer(marker);
          });
        }
      } catch (err) {
        console.error('Leaflet load error:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [userCoords, filteredPartners, selectedPartner, userLocationName]);

  // GPS Locate User
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(newCoords);
        setUserLocationName('GPS Detected Location');
        if (mapRef.current) {
          mapRef.current.setView([newCoords.lat, newCoords.lng], 10);
        }
      },
      (error) => {
        setIsLocating(false);
        alert('Could not retrieve location. Using default state center.');
      },
      { timeout: 10000 }
    );
  };

  // Quick State Location Switcher
  const handleStateCenter = (stateName: string, lat: number, lng: number) => {
    setUserCoords({ lat, lng });
    setUserLocationName(`${stateName} Center`);
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 8);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Geo-Spatial Partner Locator & Router
            </span>
            <span className="text-xs text-slate-500">
              Channel Finance System (100+ Authorized Partners)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Locate Nearest Eligible Channel Partner
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Government loan applications are processed via SCAs, Public Sector Banks, RRBs, and NBFC-MFIs. Our intelligent router prevents misrouted applications by checking partner NPA health.
          </p>
        </div>

        {/* GPS Detect Button */}
        <div className="flex items-center gap-2">
          <button
            id="detect-gps-btn"
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Detect My GPS Location'}</span>
          </button>
        </div>
      </div>

      {/* Smart NPA Routing Alert Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-950">
                Automated NPA & Fund Health Router Active
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-sky-200/80 text-sky-900">
                INTELLIGENT ROUTING
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {filterOutHighNpa
                ? `Protected routing: ${bypassedNpaCount} bank branches with overdues >7% or frozen quarterly funds have been automatically bypassed to prevent your application from getting stuck.`
                : 'Warning: High-NPA filter is disabled. Applications might be routed to branches currently facing disbursement audits.'}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs shrink-0">
          <input
            type="checkbox"
            id="toggle-npa-filter"
            checked={filterOutHighNpa}
            onChange={(e) => setFilterOutHighNpa(e.target.checked)}
            className="rounded text-sky-600 focus:ring-sky-500"
          />
          <span>Filter Out Inactive / High-NPA Partners</span>
        </label>
      </div>

      {/* Quick State Picker Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-600">
        <span className="font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Compass className="w-3.5 h-3.5" /> Jump to:
        </span>
        {[
          { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
          { name: 'Lucknow (UP)', lat: 26.8467, lng: 80.9462 },
          { name: 'Mumbai (MH)', lat: 19.0760, lng: 72.8777 },
          { name: 'Bengaluru (KA)', lat: 12.9716, lng: 77.5946 },
          { name: 'Patna (BR)', lat: 25.5941, lng: 85.1376 },
          { name: 'Chennai (TN)', lat: 13.0827, lng: 80.2707 },
          { name: 'Jaipur (RJ)', lat: 26.9124, lng: 75.7873 },
          { name: 'Kolkata (WB)', lat: 22.5726, lng: 88.3639 }
        ].map(s => (
          <button
            key={s.name}
            onClick={() => handleStateCenter(s.name, s.lat, s.lng)}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Main Map & Partner List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs overflow-hidden">
            {/* Map Container */}
            <div
              id="partner-leaflet-map"
              ref={mapContainerRef}
              className="w-full h-[450px] sm:h-[500px] rounded-xl z-10"
              style={{ minHeight: '450px' }}
            />
          </div>

          {/* Map Legend */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full bg-sky-500 ring-2 ring-sky-200" />
                <span>Eligible & Active (Disbursing)</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                <span>Quota Limited</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                <span>High NPA / Suspended</span>
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Click any node on map to inspect details
            </span>
          </div>
        </div>

        {/* Right Partner List & Search (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="search-partner-input"
                placeholder="Search partner, city, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Partners' },
                { id: 'SCA', label: 'SCAs (Apex State Corp)' },
                { id: 'PSB', label: 'PSB Banks (SBI/PNB)' },
                { id: 'RRB', label: 'RRBs (Gramin Bank)' },
                { id: 'NBFC_MFI', label: 'MFIs (Microcredit)' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedPartnerType(t.id)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${
                    selectedPartnerType === t.id
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Partner Cards Scroll Container */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Showing {filteredPartners.length} Eligible Partners</span>
              <span>Sorted by Nearest Distance</span>
            </div>

            {filteredPartners.map(partner => {
              const isSelected = selectedPartner?.id === partner.id;

              return (
                <div
                  key={partner.id}
                  id={`partner-item-${partner.id}`}
                  onClick={() => {
                    setSelectedPartner(partner);
                    if (mapRef.current) {
                      mapRef.current.setView([partner.lat, partner.lng], 12);
                    }
                  }}
                  className={`bg-white rounded-xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-600 ring-2 ring-sky-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {partner.type === 'SCA' ? 'State Channelizing Agency' : partner.type === 'PSB' ? 'Public Sector Bank' : partner.type === 'RRB' ? 'Regional Rural Bank' : 'NBFC-MFI'}
                        </span>
                        <span className="text-[11px] font-semibold text-sky-700 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" /> {partner.distanceKm} km away
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {partner.branchName} • {partner.district}, {partner.state}
                      </p>
                    </div>

                    {/* NPA Status Badge */}
                    <div className="shrink-0 text-right">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md block ${
                        partner.npaStatus === 'HEALTHY_ACTIVE'
                          ? 'bg-sky-100 text-sky-800'
                          : partner.npaStatus === 'QUOTA_RESTRICTED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {partner.npaStatus === 'HEALTHY_ACTIVE' ? 'Active' : partner.npaStatus === 'QUOTA_RESTRICTED' ? 'Quota Low' : 'Suspended'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                        NPA: {partner.npaRate}%
                      </span>
                    </div>
                  </div>

                  {/* Fund Allocation & TAT */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>Fund Left: <b>{partner.fundAllocationRemainingPercent}%</b></span>
                      <span>•</span>
                      <span>TAT: <b>{partner.turnaroundTimeDays} Days</b></span>
                    </div>
                    <button
                      id={`route-btn-${partner.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPartner(partner);
                        setRoutedDocketId(`SSR-CFS-${Math.floor(100000 + Math.random() * 900000)}`);
                        setRoutedSuccessPartner(partner);
                      }}
                      className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-0.5"
                    >
                      <span>Route Here</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Partner Detailed Sheet & Routing Confirmation Modal */}
      {selectedPartner && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-md">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {selectedPartner.type} Channel Partner
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ID: {selectedPartner.id}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {selectedPartner.name}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedPartner.address}
              </p>
            </div>

            <button
              onClick={() => setSelectedPartner(null)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            {/* Contact Details */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                Nodal Officer Contact
              </span>
              <p className="font-semibold text-slate-900">{selectedPartner.nodalOfficer}</p>
              <div className="flex items-center gap-1.5 text-slate-600">
                <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                <a href={`tel:${selectedPartner.phone}`} className="hover:underline">{selectedPartner.phone}</a>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <a href={`mailto:${selectedPartner.email}`} className="hover:underline">{selectedPartner.email}</a>
              </div>
            </div>

            {/* Fund & Health Metrics */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                NPA & Fund Disbursement Health
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross NPA Ratio:</span>
                <span className="font-bold text-slate-800">{selectedPartner.npaRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quarterly Fund Left:</span>
                <span className="font-bold text-sky-700">{selectedPartner.fundAllocationRemainingPercent}%</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                {selectedPartner.statusReason}
              </p>
            </div>

            {/* Turnaround & Action */}
            <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200 flex flex-col justify-between">
              <div>
                <span className="text-sky-950 font-bold block uppercase tracking-wider text-[10px]">
                  Turnaround Time (TAT)
                </span>
                <p className="text-lg font-black text-sky-800 mt-1">
                  ~{selectedPartner.turnaroundTimeDays} Days
                </p>
                <p className="text-[11px] text-sky-700 mt-0.5">
                  Direct digital forwarding to Channel Partner desk
                </p>
              </div>

              <button
                id="confirm-route-btn"
                onClick={() => {
                  setRoutedDocketId(`SSR-CFS-${Math.floor(100000 + Math.random() * 900000)}`);
                  setRoutedSuccessPartner(selectedPartner);
                }}
                className="mt-3 w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Digital Routing Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routing Success Confirmation Modal */}
      {routedSuccessPartner && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Application Successfully Routed!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your preliminary scheme dossier has been assigned to the authorized Channel Partner:
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Routing Docket ID:</span>
                <span className="font-mono font-bold text-slate-900">{routedDocketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel Partner:</span>
                <span className="font-semibold text-slate-900">{routedSuccessPartner.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Branch Office:</span>
                <span className="text-slate-700">{routedSuccessPartner.branchName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nodal Officer:</span>
                <span className="text-slate-700">{routedSuccessPartner.nodalOfficer}</span>
              </div>
            </div>

            <div className="bg-sky-50 rounded-lg p-3 text-[11px] text-sky-800 border border-sky-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <b>Next Steps:</b> Visit the branch with your Caste Certificate, Income Certificate, and DPR. Zero commission required. An SMS notification has been simulated.
              </span>
            </div>

            <button
              onClick={() => setRoutedSuccessPartner(null)}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              Close & Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
