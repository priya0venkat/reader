import { useState, useEffect } from 'react';

/**
 * InstallButton - Shows "Add to Home Screen" button
 * - On Android/Desktop Chrome: Uses beforeinstallprompt for native install
 * - On iOS: Shows instructions to use Safari's Add to Home Screen
 */
function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Detect iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setIsIOS(isIOSDevice);

        // On iOS, show the button (for manual instructions)
        if (isIOSDevice) {
            setIsInstallable(true);
            return;
        }

        // Listen for the beforeinstallprompt event (non-iOS)
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Listen for successful installation
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        // iOS: Show instructions modal
        if (isIOS) {
            setShowIOSInstructions(true);
            return;
        }

        // Non-iOS: Use native prompt
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    // Don't render if already installed or not installable
    if (isInstalled || !isInstallable) {
        return null;
    }

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="install-button"
                aria-label="Add to Home Screen"
            >
                <span className="install-icon">📲</span>
                <span className="install-text">Add to Home Screen</span>
            </button>

            {/* iOS Instructions Modal */}
            {showIOSInstructions && (
                <div className="ios-instructions-overlay" onClick={() => setShowIOSInstructions(false)}>
                    <div className="ios-instructions-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Add to Home Screen</h3>
                        <p>To install this app on your iOS device:</p>
                        <ol>
                            <li>Open this page in <strong>Safari</strong></li>
                            <li>Tap the <strong>Share</strong> button <span style={{ fontSize: '1.2em' }}>⬆️</span></li>
                            <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                        </ol>
                        <button
                            className="ios-instructions-close"
                            onClick={() => setShowIOSInstructions(false)}
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default InstallButton;
