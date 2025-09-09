import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Star, User, Calendar, Star as StarIcon } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Lock body scroll when landing page mounts
    document.body.style.overflow = 'hidden';
    
    // Cleanup: restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="min-h-[100dvh] h-[100dvh] bg-white overflow-hidden flex flex-col justify-start">
      <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3 flex-1 flex flex-col justify-start">
        {/* Header */}
        <div className="text-center mb-2 sm:mb-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-1 sm:mb-2">
            Plan or Provide?
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Choose how you want to use GoaFYI
          </p>
        </div>

        {/* Main Options */}
        <div className="max-w-6xl mx-auto mb-0">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Viewer Option */}
            <div className="bg-white bg-gradient-to-b from-rose-50 to-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 hover:shadow-3xl transition-all duration-300 min-h-[280px] md:min-h-[320px] flex flex-col transform hover:-translate-y-2 hover:scale-105" style={{
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}>
              <div className="text-center flex-1 flex flex-col justify-between">
                {/* Illustration */}
                <div className="mb-2 sm:mb-3">
                  <img 
                    src="/landing1.png" 
                    alt="Event Planning" 
                    className="w-40 h-30 sm:w-48 sm:h-36 md:w-56 md:h-42 mx-auto object-contain"
                  />
                </div>
                
                <h2 className="text-base sm:text-xl md:text-2xl font-serif font-bold text-gray-900 mb-2 sm:mb-3">
                  Planning an Event?
                </h2>

                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-left">
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                    <span className="leading-relaxed">Browse portfolios</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                    <span className="leading-relaxed">Find local vendors</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                    <span className="leading-relaxed">Save favorites</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/viewer-login')}
                  className="w-full bg-red-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-red-600 transition-all duration-300"
                >
                  Continue as Viewer
                </button>
              </div>
            </div>

            {/* Vendor Option */}
            <div className="bg-white bg-gradient-to-b from-blue-50 to-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 hover:shadow-3xl transition-all duration-300 min-h-[280px] md:min-h-[320px] flex flex-col transform hover:-translate-y-2 hover:scale-105" style={{
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}>
              <div className="text-center flex-1 flex flex-col justify-between">
                {/* Illustration */}
                <div className="mb-2 sm:mb-3">
                  <img 
                    src="/landing2.png" 
                    alt="Vendor Services" 
                    className="w-40 h-30 sm:w-48 sm:h-36 md:w-56 md:h-42 mx-auto object-contain"
                  />
                </div>
                
                <h2 className="text-base sm:text-xl md:text-2xl font-serif font-bold text-gray-900 mb-2 sm:mb-3">
                  Are You a Vendor?
                </h2>

                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-left">
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                    <span className="leading-relaxed">Create profile</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                    <span className="leading-relaxed">Manage bookings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                    <span className="leading-relaxed">Get reviews</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/vendor-login')}
                  className="w-full bg-blue-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-600 transition-all duration-300"
                >
                  Continue as Vendor
                </button>
              </div>
            </div>

            
          </div>
        </div>

        {/* Install App Button */}
        <div className="text-center pb-2 mt-5">
          <button
            onClick={() => {
              // Enhanced PWA installation logic
              const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
              const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
              const isAndroid = /Android/.test(navigator.userAgent);
              
              // Check if already installed
              if (isInStandaloneMode) {
                alert('App is already installed! 🎉');
                return;
              }
              
              // Handle iOS Safari
              if (isIOS) {
                const instructions = `To install this app on your iPhone/iPad:

1. Tap the Share button (📤) at the bottom of your screen
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" in the top right corner

The app will then appear on your home screen like a native app!`;
                alert(instructions);
                return;
              }
              
              // Handle Android Chrome
              if (isAndroid && 'serviceWorker' in navigator) {
                const deferredPrompt = (window as any).deferredPrompt;
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then((choiceResult: any) => {
                    if (choiceResult.outcome === 'accepted') {
                      console.log('User accepted the install prompt');
                      alert('App installed successfully! 🎉');
                    } else {
                      console.log('User dismissed the install prompt');
                    }
                    (window as any).deferredPrompt = null;
                  });
                } else {
                  const instructions = `To install this app on your Android device:

1. Tap the menu button (⋮) in your browser
2. Look for "Install app" or "Add to Home screen"
3. Tap it and follow the prompts

The app will then appear on your home screen!`;
                  alert(instructions);
                }
                return;
              }
              
              // Handle desktop browsers
              if ('serviceWorker' in navigator) {
                const deferredPrompt = (window as any).deferredPrompt;
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then((choiceResult: any) => {
                    if (choiceResult.outcome === 'accepted') {
                      console.log('User accepted the install prompt');
                      alert('App installed successfully! 🎉');
                    }
                    (window as any).deferredPrompt = null;
                  });
                } else {
                  const instructions = `To install this app:

• Chrome/Edge: Look for the install icon (⬇️) in the address bar
• Firefox: Go to Menu > Install
• Safari: Go to File > Add to Dock

The app will work like a native desktop application!`;
                  alert(instructions);
                }
              } else {
                alert('Your browser doesn\'t support app installation. Please use a modern browser like Chrome, Firefox, or Safari.');
              }
            }}
            className="bg-white/20 backdrop-blur-lg text-gray-800 px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform border border-white/40"
            style={{
              boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)'
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-lg">📱</span>
              <span>Install App</span>
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
