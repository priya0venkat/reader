// Sound file hosted on GCS to avoid git binary issues
const washingMachineSoundUrl = 'https://storage.googleapis.com/purejax-data-1234/assets/washing-machine.ogg';

export function playWashingMachineSound() {
    const audio = new Audio(washingMachineSoundUrl);
    audio.play().catch(error => {
        console.error("Audio playback failed:", error);
    });
}
