export default class Music {
    startMusic() {
        const synth = new Tone.Synth().toDestination();
        const now = Tone.now();
        // trigger the attack immediately
        synth.triggerAttack("C4", now);
        // wait one second before triggering the release
        synth.triggerRelease(now + 1);
    }
}
