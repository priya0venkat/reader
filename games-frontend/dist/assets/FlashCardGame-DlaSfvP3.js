import{j as t,r as c,u as f}from"./index-frGSGQhB.js";import{T as p}from"./piper-tts-web-CmrSpxTq.js";const b=[{id:"common-objects",title:"Common Objects",description:"Guess the object! Click to reveal the word.",mechanic:"image-reveal",cards:[{id:"apple",front:"🍎",back:"Apple",phonetic:"Ah, Puh, Puh, Luh, Eh. Apple"},{id:"ball",front:"⚽",back:"Ball",phonetic:"Buh, Ah, Luh, Luh. Ball"},{id:"cat",front:"🐱",back:"Cat",phonetic:"Kuh, Ah, Tuh. Cat"},{id:"dog",front:"🐶",back:"Dog",phonetic:"Duh, Aw, Guh. Dog"},{id:"car",front:"🚗",back:"Car",phonetic:"Kuh, Ah, Ruh. Car"},{id:"bus",front:"🚌",back:"Bus",phonetic:"Buh, Uh, Suh. Bus"},{id:"flower",front:"🌸",back:"Flower",phonetic:"Fuh, Luh, Ow, Wuh, Eh, Ruh. Flower"},{id:"house",front:"🏠",back:"House",phonetic:"Huh, Ow, Uh, Suh, Eh. House"},{id:"hat",front:"🧢",back:"Hat",phonetic:"Huh, Ah, Tuh. Hat"},{id:"shoe",front:"👟",back:"Shoe",phonetic:"Suh, Huh, Oh, Eh. Shoe"}]},{id:"common-words",title:"Common Words",description:"Sight words for early readers.",mechanic:"flip",cards:[{id:"the",front:"the",back:"the"},{id:"and",front:"and",back:"and"},{id:"a",front:"a",back:"a"},{id:"to",front:"to",back:"to"},{id:"in",front:"in",back:"in"},{id:"is",front:"is",back:"is"},{id:"you",front:"you",back:"you"},{id:"that",front:"that",back:"that"},{id:"it",front:"it",back:"it"},{id:"he",front:"he",back:"he"}]}];function x({onSelectBundle:e}){return t.jsxs("div",{className:"bundle-selector",children:[t.jsx("h2",{children:"Choose a Bundle"}),t.jsx("div",{className:"bundle-grid",children:b.map(r=>t.jsxs("button",{className:"bundle-card",onClick:()=>e(r),children:[t.jsx("h3",{children:r.title}),t.jsx("p",{children:r.description})]},r.id))}),t.jsx("style",{children:`
        .bundle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .bundle-card {
          background: var(--surface);
          color: var(--text);
          padding: 2rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          transition: transform 0.2s, box-shadow 0.2s;
          text-align: left;
        }
        .bundle-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          background: var(--primary);
        }
        .bundle-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }
      `})]})}let s=null,l=!1,u=null;const m=()=>(u||(u=new(window.AudioContext||window.webkitAudioContext)),u),g=()=>{const e=m();e.state==="suspended"&&e.resume();const r=e.createBuffer(1,1,22050),n=e.createBufferSource();n.buffer=r,n.connect(e.destination),n.start(0)},v=async e=>{if(s)return"Ready";if(l)return"Initializing...";l=!0;try{return e&&e("Initializing Audio..."),s=new p({voiceId:"en_US-amy-low",progress:r=>{const n=Math.round(r),a=isNaN(n)||!isFinite(n)?"...":`${n}%`;e&&e(`Loading: ${a}`)},logger:r=>console.log("[Piper]",r),wasmPaths:{onnxWasm:`${window.location.origin}./onnx/`,piperData:`${window.location.origin}./piper/piper_phonemize.data`,piperWasm:`${window.location.origin}./piper/piper_phonemize.wasm`}}),await s.init(),l=!1,e&&e("Ready"),"Ready"}catch(r){throw console.error("Failed to init Piper:",r),l=!1,s=null,e&&e("Audio Failed"),r}},w=async e=>{const r=m();if(r.state==="suspended")try{await r.resume()}catch(n){console.warn("Could not resume audio context",n)}if(!s){console.warn("Piper not initialized, using fallback");const n=new SpeechSynthesisUtterance(e);window.speechSynthesis.speak(n);return}try{const a=await(await s.predict(e)).arrayBuffer(),i=await r.decodeAudioData(a),o=r.createBufferSource();o.buffer=i,o.connect(r.destination),o.start(0)}catch(n){console.error("Piper speak error:",n);const a=new SpeechSynthesisUtterance(e);window.speechSynthesis.speak(a)}};function k({card:e,mechanic:r}){const[n,a]=c.useState(!1),i=()=>{n||w(e.phonetic||e.back),a(!n)},o=r==="image-reveal";return t.jsxs("div",{className:`flash-card ${n?"flipped":""}`,onClick:i,children:[t.jsxs("div",{className:"flash-card-inner",children:[t.jsxs("div",{className:"flash-card-front",children:[o?e.front.startsWith("/")?t.jsx("img",{src:e.front,alt:"Guess the object"}):t.jsx("div",{className:"emoji-content",children:e.front}):t.jsx("div",{className:"text-content",children:e.front}),o&&t.jsx("p",{className:"hint",children:"Tap to reveal!"})]}),t.jsx("div",{className:"flash-card-back",children:t.jsx("div",{className:"text-content",children:e.back})})]}),t.jsx("style",{children:`
        .flash-card {
          width: 300px;
          height: 400px;
          cursor: pointer;
          background-color: transparent;
        }
        .flash-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          box-shadow: var(--shadow-lg);
          border-radius: var(--radius-lg);
        }
        .flash-card.flipped .flash-card-inner {
          transform: rotateY(180deg);
        }
        .flash-card-front, .flash-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: var(--radius-lg);
          background: var(--surface);
          color: var(--text);
          padding: 2rem;
          border: 4px solid var(--secondary);
        }
        .flash-card-front {
          /* Default front style */
        }
        .flash-card-back {
          background: var(--primary);
          color: white;
          transform: rotateY(180deg);
        }
        .flash-card img {
          max-width: 80%;
          max-height: 60%;
          object-fit: contain;
          margin-bottom: 1rem;
        }
        .text-content {
          font-size: 3rem;
          font-weight: bold;
        }
        .emoji-content {
          font-size: 8rem;
          line-height: 1;
        }
        .hint {
          margin-top: 1rem;
          font-size: 1rem;
          color: var(--text-muted);
          opacity: 0.8;
        }
      `})]})}function j({bundle:e,onBack:r}){const[n,a]=c.useState(0),i=()=>{a(h=>(h+1)%e.cards.length)},o=()=>{a(h=>(h-1+e.cards.length)%e.cards.length)},d=e.cards[n];return t.jsxs("div",{className:"game-board fade-in",children:[t.jsxs("div",{className:"controls-top",children:[t.jsx("button",{onClick:r,className:"btn-secondary",children:"← Back"}),t.jsxs("span",{children:[n+1," / ",e.cards.length]})]}),t.jsx("div",{className:"card-area",children:t.jsx(k,{card:d,mechanic:e.mechanic},d.id)}),t.jsxs("div",{className:"controls-bottom",children:[t.jsx("button",{onClick:o,className:"btn-nav",children:"Previous"}),t.jsx("button",{onClick:i,className:"btn-nav",children:"Next"})]}),t.jsx("style",{children:`
        .game-board {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        .controls-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-muted);
        }
        .btn-secondary {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-weight: bold;
        }
        .btn-secondary:hover {
          color: var(--text);
          background: rgba(255,255,255,0.1);
        }
        .card-area {
          perspective: 1000px;
          margin: 2rem 0;
        }
        .controls-bottom {
          display: flex;
          gap: 1rem;
        }
        .btn-nav {
          background: var(--secondary);
          color: #fff;
          padding: 1rem 2rem;
          border-radius: var(--radius-md);
          font-size: 1.2rem;
          font-weight: bold;
          box-shadow: var(--shadow-md);
          transition: background 0.2s;
        }
        .btn-nav:hover {
          background: var(--secondary-hover);
        }
      `})]})}function N(){const e=f(),[r,n]=c.useState(null),[a,i]=c.useState("");return c.useEffect(()=>{const o=()=>{g(),v(d=>i(d)),window.removeEventListener("click",o)};return window.addEventListener("click",o),()=>window.removeEventListener("click",o)},[]),t.jsxs("div",{className:"app-container",children:[t.jsxs("header",{className:"app-header",children:[t.jsx("button",{onClick:()=>e("/"),className:"home-btn",children:"🏠"}),t.jsx("h1",{onClick:()=>n(null),style:{cursor:"pointer"},children:"✨ Flash Cards ✨"}),a&&t.jsx("div",{className:"audio-status",children:a})]}),t.jsx("style",{children:`
        .home-btn {
          position: absolute;
          left: 1rem;
          top: 1rem;
          font-size: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
        }
        .audio-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.8rem;
          opacity: 0.7;
        }
      `}),t.jsx("main",{children:r?t.jsx(j,{bundle:r,onBack:()=>n(null)}):t.jsx(x,{onSelectBundle:n})})]})}export{N as default};
