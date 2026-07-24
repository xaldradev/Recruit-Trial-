import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Check, X, Sparkles, Loader2 } from 'lucide-react';
import { reverseGeocode, LocationDetectionResult } from '../utils/geolocation';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { IndianState, WorldCountry } from '../data/seoLocationsData';

interface GeoLocationBannerProps {
  currentState: string;
  currentCountry: string;
  onSelectState: (stateName: string) => void;
  onSelectCountry: (countryCode: string) => void;
  forceShow?: boolean;
  onClose?: () => void;
}

export default function GeoLocationBanner({
  currentState,
  currentCountry,
  onSelectState,
  onSelectCountry,
  forceShow = false,
  onClose
}: GeoLocationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<LocationDetectionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check if location has already been suggested to this visitor
    const alreadySuggested = getStorageItem('arohi_geo_suggested');
    if (forceShow) {
      triggerDetectLocation();
    } else if (!alreadySuggested) {
      // Small delay on first visit for smooth entry
      const timer = setTimeout(() => {
        triggerDetectLocation();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const triggerDetectLocation = () => {
    if (!('geolocation' in navigator)) {
      if (forceShow) setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setIsVisible(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          setDetectedLocation(result);
          setIsLoading(false);

          // If the detected state/country matches current, we can auto-hide unless forced
          if (!forceShow) {
            const detectedStateName = result.state?.name || result.stateName;
            if (detectedStateName && currentState.toLowerCase() === detectedStateName.toLowerCase()) {
              // User is already on their detected state page
              setStorageItem('arohi_geo_suggested', 'true');
              setIsVisible(false);
            }
          }
        } catch (err) {
          console.error('Reverse geocode error:', err);
          setIsLoading(false);
          setErrorMsg('Could not resolve location name.');
        }
      },
      (err) => {
        console.warn('Geolocation position error:', err);
        setIsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Location access permission was denied.');
        } else {
          setErrorMsg('Unable to fetch current position.');
        }
        if (!forceShow) {
          // Mark suggested so we don't block
          setStorageItem('arohi_geo_suggested', 'true');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleApplyState = (state: IndianState) => {
    onSelectState(state.name);
    setStorageItem('arohi_geo_suggested', 'true');
    setStorageItem('arohi_detected_state', state.name);
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleApplyCountry = (country: WorldCountry) => {
    onSelectCountry(country.code);
    setStorageItem('arohi_geo_suggested', 'true');
    setStorageItem('arohi_detected_country', country.name);
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleDismiss = () => {
    setStorageItem('arohi_geo_suggested', 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible && !forceShow) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 left-3 sm:left-auto sm:right-6 z-[100] max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#0f0b29]/95 border-2 border-amber-500/40 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-slate-100 relative overflow-hidden">
        {/* Subtle top accent gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          title="Dismiss suggestion"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5 animate-bounce" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Auto Location Suggestion
              </span>
            </div>

            {isLoading ? (
              <p className="text-xs text-slate-300 font-medium animate-pulse">
                Detecting your region using Browser Geolocation...
              </p>
            ) : errorMsg ? (
              <div>
                <p className="text-xs text-rose-300 font-semibold">{errorMsg}</p>
                <button
                  onClick={triggerDetectLocation}
                  className="text-[11px] font-bold text-amber-400 underline hover:text-amber-300 mt-1 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : detectedLocation ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  We detected your location near{' '}
                  <span className="font-bold text-white bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                    {detectedLocation.city ? `${detectedLocation.city}, ` : ''}
                    {detectedLocation.state?.name || detectedLocation.stateName || detectedLocation.countryName}
                  </span>
                  . Would you like to switch your view to tailored local opportunities?
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {detectedLocation.state && (
                    <button
                      onClick={() => handleApplyState(detectedLocation.state!)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 hover:scale-105"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Switch to {detectedLocation.state.name}
                    </button>
                  )}

                  {!detectedLocation.state && detectedLocation.country && (
                    <button
                      onClick={() => handleApplyCountry(detectedLocation.country!)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 hover:scale-105"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Switch to {detectedLocation.country.name}
                    </button>
                  )}

                  <button
                    onClick={handleDismiss}
                    className="bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all"
                  >
                    Keep Current
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Requesting position authorization...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
