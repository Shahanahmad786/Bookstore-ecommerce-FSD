// Simple confetti generator
const confettiContainer = document.getElementById('confetti');
const confettiBtn = document.getElementById('confettiBtn');

function rand(min, max){ return Math.random()*(max-min)+min }

function makePiece(){
  const el = document.createElement('div');
  el.className = 'piece';
  el.style.left = rand(0,100) + '%';
  el.style.top = rand(-10,10) + '%';
  const w = rand(6,12);
  el.style.width = w + 'px';
  el.style.height = Math.round(w*1.4) + 'px';
  el.style.background = ['#7c3aed','#06b6d4','#fb7185','#f97316','#34d399'][Math.floor(rand(0,5))];
  el.style.transform = `rotate(${rand(0,360)}deg)`;
  confettiContainer.appendChild(el);

  const duration = rand(3000,6000);
  const endX = rand(-40,40);
  const endY = rand(80,140);
  el.animate([
    { transform: `translate3d(0,0,0) rotate(${rand(0,720)}deg)`, opacity:1 },
    { transform: `translate3d(${endX}px,${endY}px,0) rotate(${rand(720,1440)}deg)`, opacity:0 }
  ], { duration, easing: 'cubic-bezier(.2,.7,.2,1)' });
  setTimeout(()=> el.remove(), duration);
}

function burst(count=60){
  for(let i=0;i<count;i++) makePiece();
}

confettiBtn.addEventListener('click', ()=>{
  burst(36);
  // small sparkle of text
  confettiBtn.classList.add('pulse');
  setTimeout(()=> confettiBtn.classList.remove('pulse'), 900);
});

// subtle periodic bursts
setInterval(()=>{ if (Math.random() < 0.12) burst(8); }, 2200);

// startup mini burst
setTimeout(()=> burst(16), 600);
