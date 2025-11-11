// main.js - renders projects from data/projects.json, language toggle, filter, carousel
const LANG = {
  en: {
    about_title: "About",
    about_text: "Hello — I'm Brayan, a Systems Engineer from Costa Rica. I build web apps and systems. Use the Projects section to see work and videos.",
    contact_label: "Contact:",
    filter_label: "Filter by technology",
    projects_title: "Projects",
    no_projects: "No projects yet. Add entries to data/projects.json.",
    thoughts_title: "Thoughts",
    thoughts_text: "Write short reflections, approaches to engineering, or personal notes here."
  },
  es: {
    about_title: "Sobre mí",
    about_text: "Hola — Soy Brayan, Ingeniero en Sistemas de Costa Rica. Construyo aplicaciones web y sistemas. Revisa la sección Proyectos para ver trabajos y videos.",
    contact_label: "Contacto:",
    filter_label: "Filtrar por tecnología",
    projects_title: "Proyectos",
    no_projects: "Aún no hay proyectos. Agrega entradas en data/projects.json.",
    thoughts_title: "Pensamientos",
    thoughts_text: "Escribe reflexiones breves, enfoques sobre ingeniería o notas personales aquí."
  }
};

const state = {
  lang: 'en',
  projects: [],
  techs: new Set(),
  filter: 'all'
};

document.getElementById('year').textContent = new Date().getFullYear();
const langToggle = document.getElementById('lang-toggle');
langToggle.addEventListener('click', () => {
  state.lang = state.lang === 'en' ? 'es' : 'en';
  document.body.setAttribute('data-lang', state.lang);
  langToggle.textContent = state.lang === 'en' ? 'Español' : 'English';
  renderStaticText();
});

function renderStaticText(){
  const dict = LANG[state.lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(dict[key]) el.textContent = dict[key];
  });
  document.getElementById('about-text').textContent = dict.about_text;
  document.getElementById('thoughts-text').textContent = dict.thoughts_text;
}

async function loadProjects(){
  try {
    const res = await fetch('data/projects.json');
    if(!res.ok) throw new Error('Projects not found');
    const json = await res.json();
    state.projects = json.projects || [];
    buildTechList();
    renderProjects();
    populateFilter();
  } catch(err){
    console.error(err);
    document.getElementById('no-projects').style.display = '';
  }
}

function buildTechList(){
  state.techs.clear();
  state.projects.forEach(p => {
    (p.stack || []).forEach(t => state.techs.add(t));
  });
}

function populateFilter(){
  const sel = document.getElementById('tech-filter');
  sel.innerHTML = '<option value="all" selected>All</option>';
  const arr = Array.from(state.techs).sort();
  arr.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', e => {
    state.filter = e.target.value;
    renderProjects();
  });
}

function renderProjects(){
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';
  const template = document.getElementById('project-template');
  const filtered = state.projects.filter(p => state.filter === 'all' ? true : (p.stack || []).includes(state.filter));
  if(filtered.length === 0){
    document.getElementById('no-projects').style.display = '';
  } else {
    document.getElementById('no-projects').style.display = 'none';
  }
  filtered.forEach((p, idx) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.project-name').textContent = p.name || `Project ${idx+1}`;
    node.querySelector('.year').textContent = p.year || '';
    node.querySelector('.complexity').textContent = p.complexity || '';
    node.querySelector('.project-desc').textContent = p.description || '';
    const stackWrap = node.querySelector('.stack');
    (p.stack || []).forEach(s => {
      const tag = document.createElement('span'); tag.className='tag'; tag.textContent = s; stackWrap.appendChild(tag);
    });

    const live = node.querySelector('.live-link');
    if(p.live_link) { live.href = p.live_link; live.style.display='inline' } else live.style.display='none';
    const repo = node.querySelector('.repo-link');
    if(p.repo_link) { repo.href = p.repo_link; repo.style.display='inline' } else repo.style.display='none';

    // carousel
    const frame = node.querySelector('.carousel-frame');
    const prev = node.querySelector('.prev');
    const next = node.querySelector('.next');
    let images = p.images || [];
    if(images.length === 0){
      // placeholder
      const ph = document.createElement('div');
      ph.style.width='100%'; ph.style.height='100%'; ph.style.display='flex'; ph.style.alignItems='center'; ph.style.justifyContent='center';
      ph.style.color=getComputedStyle(document.documentElement).getPropertyValue('--muted');
      ph.textContent='No images';
      frame.appendChild(ph);
    } else {
      let current = 0;
      const imgEl = document.createElement('img');
      imgEl.src = images[current];
      imgEl.alt = p.name || 'project image';
      frame.appendChild(imgEl);
      prev.addEventListener('click', () => {
        current = (current - 1 + images.length) % images.length;
        imgEl.src = images[current];
      });
      next.addEventListener('click', () => {
        current = (current + 1) % images.length;
        imgEl.src = images[current];
      });
    }

    // videos (up to 2)
    const videosWrap = node.querySelector('.videos');
    (p.videos || []).slice(0,2).forEach(v => {
      // if it's a YouTube link, embed iframe; otherwise try video tag
      if(v.includes('youtube') || v.includes('youtu.be')){
        const iframe = document.createElement('iframe');
        iframe.src = convertYouTubeToEmbed(v);
        iframe.frameBorder = 0;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        videosWrap.appendChild(iframe);
      } else {
        const video = document.createElement('video');
        video.controls = true;
        const src = document.createElement('source');
        src.src = v;
        video.appendChild(src);
        videosWrap.appendChild(video);
      }
    });

    grid.appendChild(node);
  });
  renderStaticText();
}

function convertYouTubeToEmbed(url){
  // handles standard youtube URLs
  try {
    const u = new URL(url);
    if(u.hostname.includes('youtu.be')){
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    } else {
      const params = new URLSearchParams(u.search);
      const id = params.get('v');
      return `https://www.youtube.com/embed/${id}`;
    }
  } catch(e){
    return url;
  }
}

// initial
renderStaticText();
loadProjects();