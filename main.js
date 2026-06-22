// Header scroll
window.addEventListener('scroll',()=>{
  document.getElementById('hdr')?.classList.toggle('scrolled',window.scrollY>30);
});

// Reveal on scroll
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
