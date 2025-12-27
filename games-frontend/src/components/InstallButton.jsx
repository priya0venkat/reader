import { useState, useEffect } from 'react';

/**
 * InstallButton - Shows "Add to Home Screen" button when PWA install is available
 * Uses the beforeinstallprompt event to trigger native install prompt
 */
function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event so it can be triggered later
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
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferred prompt - it can only be used once
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    // Don't render if already installed or not installable
    if (isInstalled || !isInstallable) {
        return null;
    }

    return (
        <button
            onClick={handleInstallClick}
            className="install-button"
            aria-label="Add to Home Screen"
        >
            <span className="install-icon">📲</span>
            <span className="install-text">Add to Home Screen</span>
        </button>
    );
}

export default InstallButton;
