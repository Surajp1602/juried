// This build's motion signature, written from the "motion" and "signature" axes of juried/dna.json.
// It starts empty on purpose: how things move is a design decision made per build, never inherited.
// Runs once after React has rendered. `reduced` is true when the visitor prefers reduced motion:
// in that case leave everything visible and still.
export default function motion({ gsap, ScrollTrigger, lenis, reduced }) {}
