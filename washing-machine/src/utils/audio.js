import washingMachineSound from '../assets/washing-machine.ogg';

export function playWashingMachineSound() {
    const audio = new Audio(washingMachineSound);
    audio.play().catch(error => {
        console.error("Audio playback failed:", error);
    });
}
