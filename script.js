// ===================== Tabs =====================
const tabs = {
  about:   { btn: document.getElementById('tab-about'),   panel: document.getElementById('panel-about') },
  stories: { btn: document.getElementById('tab-stories'), panel: document.getElementById('panel-stories') },
  blogs:   { btn: document.getElementById('tab-blogs'),   panel: document.getElementById('panel-blogs') },
};

function selectTab(name){
  Object.entries(tabs).forEach(([key, { btn, panel }]) => {
    const active = key === name;
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
}

Object.entries(tabs).forEach(([key, { btn }]) => {
  btn.addEventListener('click', () => selectTab(key));
});

// ===================== Play Store button(s) =====================
const toastEl = document.getElementById('toast');
let toastTimer;
function showStoreToast(){
  toastEl.textContent = 'MagicHelp isn\u2019t on Google Play yet \u2014 we\u2019ll announce it here first!';
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}
document.querySelectorAll('#playstoreBtn, [data-store-trigger]').forEach(btn => {
  btn.addEventListener('click', showStoreToast);
});

// ===================== Hero quote carousel =====================
const HERO_QUOTES = [
  { text: "Help someone today, you will be helped by someone tomorrow", attrib: "The MagicHelp promise" },
  { text: "A small kindness, delivered instantly", attrib: "What MagicHelp is built on" },
  { text: "No red tape, no waiting rooms — just people showing up for people", attrib: "How MagicHelp works" },
  { text: "Every good turn plants the next one", attrib: "The MagicHelp promise" },
  { text: "Ask freely. There's no wrong kind of request", attrib: "MagicHelp members" },
  { text: "Time, skills, or a little cash — every offer of help matters", attrib: "MagicHelp members" },
  { text: "Kindness loses momentum when it has to wait, so we don't make it", attrib: "The MagicHelp team" },
  { text: "Most requests find a helper the same day", attrib: "MagicHelp, in practice" },
];

(function startQuoteCarousel(){
  const quoteEl = document.getElementById('quoteText');
  const attribEl = document.querySelector('.quote-attrib');
  if(!quoteEl) return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0;

  function next(){
    i = (i + 1) % HERO_QUOTES.length;
    const q = HERO_QUOTES[i];
    if(reduceMotion){
      quoteEl.textContent = q.text;
      if(attribEl) attribEl.textContent = `\u2014 ${q.attrib}`;
      return;
    }
    quoteEl.classList.add('fade-out');
    setTimeout(() => {
      quoteEl.textContent = q.text;
      if(attribEl) attribEl.textContent = `\u2014 ${q.attrib}`;
      quoteEl.classList.remove('fade-out');
    }, 380);
  }

  setInterval(next, 4600);
})();

// ===================== Success Stories =====================
// HOW TO ADD A NEW WEEKLY STORY
// Open stories-data.js and add one new object to the top of the array — see the
// instructions and example already written in that file. Or use admin.html.
// No other files need to change.

const storyListEl = document.getElementById('storyList');

function renderStories(){
  const stories = (window.MAGICHELP_STORIES || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));

  if(stories.length === 0){
    storyListEl.innerHTML = '<li class="stories-empty">No stories yet — check back soon.</li>';
    return;
  }

  storyListEl.innerHTML = '';
  stories.forEach((story, i) => {
    const li = document.createElement('li');
    li.className = 'story-card';
    const bodyId = `story-body-${i}`;
    const image = story.image || 'story-1.svg';
    li.innerHTML = `
      <div class="story-photo"><img src="${image}" alt="" loading="lazy"></div>
      <div class="story-main">
        <div class="story-head">
          <span class="story-date">${formatDate(story.date)}</span>
        </div>
        <h3 class="story-name">${escapeHtml(story.name || story.title || 'Untitled story')}</h3>
        <p class="story-subtitle">${escapeHtml(story.subtitle || '')}</p>
        <button class="story-toggle" type="button" aria-expanded="false" aria-controls="${bodyId}">Read story</button>
        <div class="story-body" id="${bodyId}"></div>
      </div>
    `;
    const toggleBtn = li.querySelector('.story-toggle');
    const bodyEl = li.querySelector('.story-body');
    let filled = false;

    toggleBtn.addEventListener('click', () => {
      const isOpen = bodyEl.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.textContent = isOpen ? 'Hide story' : 'Read story';
      if(isOpen && !filled){
        const paras = story.paragraphs && story.paragraphs.length
          ? story.paragraphs
          : (story.body ? [story.body] : ['Full story coming soon.']);
        bodyEl.innerHTML = paras.map(p => `<p>${p}</p>`).join('');
        filled = true;
      }
    });

    storyListEl.appendChild(li);
  });
}

// ===================== Helped-this-week ticker =====================
// Open helped-data.js to update names/phone numbers weekly, or use admin.html.

function renderHelpedTicker(){
  const track = document.getElementById('helpedTrack');
  if(!track) return;
  const people = window.MAGICHELP_HELPED || [];
  if(people.length === 0){
    track.innerHTML = '<p class="stories-empty">No entries yet.</p>';
    return;
  }

  function rowsHtml(){
    let html = '';
    let lastTag = null;
    people.forEach(p => {
      const tag = p.week === 'last' ? 'Last week' : 'This week';
      if(tag !== lastTag){
        html += `<span class="helped-tag">${escapeHtml(tag)}</span>`;
        lastTag = tag;
      }
      html += `
        <div class="helped-row">
          <span class="helped-name">${escapeHtml(p.name || '')}</span>
          <span class="helped-phone">${escapeHtml(p.phone || '')}</span>
        </div>
      `;
    });
    return html;
  }

  // Duplicate the list once so the CSS marquee (translateY -50%) loops seamlessly.
  const once = rowsHtml();
  track.innerHTML = once + once;
}

function formatDate(iso){
  if(!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if(isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

// ===================== Blogs =====================
// Open blogs-data.js to add a new post — six fully-worked examples are there
// as reference, one per layout type. Or use admin.html.

const blogListEl = document.getElementById('blogList');
const BLOG_TYPE_LABEL = {
  article: 'Article', gallery: 'Photos', video: 'Video', flow: 'Flow diagram', tabs: 'Tabs', stats: 'Stats'
};

function renderBlogs(){
  const posts = (window.MAGICHELP_BLOGS || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));

  if(posts.length === 0){
    blogListEl.innerHTML = '<li class="stories-empty">No posts yet — check back soon.</li>';
    return;
  }

  blogListEl.innerHTML = '';
  posts.forEach((post, i) => {
    const li = document.createElement('li');
    li.className = 'blog-card';
    const bodyId = `blog-body-${i}`;
    const typeLabel = BLOG_TYPE_LABEL[post.type] || 'Post';
    li.innerHTML = `
      <div class="blog-head">
        <span class="blog-date">${formatDate(post.date)}</span>
        <span class="blog-type-pill">${escapeHtml(typeLabel)}</span>
      </div>
      <h3 class="blog-title">${escapeHtml(post.title || 'Untitled post')}</h3>
      <p class="blog-excerpt">${escapeHtml(post.excerpt || '')}</p>
      <button class="blog-toggle" type="button" aria-expanded="false" aria-controls="${bodyId}">Read post</button>
      <div class="blog-body" id="${bodyId}"></div>
    `;
    const toggleBtn = li.querySelector('.blog-toggle');
    const bodyEl = li.querySelector('.blog-body');
    let filled = false;

    toggleBtn.addEventListener('click', () => {
      const isOpen = bodyEl.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.textContent = isOpen ? 'Hide post' : 'Read post';
      if(isOpen && !filled){
        bodyEl.innerHTML = renderBlogBody(post);
        wireBlogBody(bodyEl, post);
        filled = true;
      }
    });

    blogListEl.appendChild(li);
  });
}

function renderBlogBody(post){
  switch(post.type){
    case 'gallery': return renderBlogGallery(post);
    case 'video':   return renderBlogVideo(post);
    case 'flow':    return renderBlogFlow(post);
    case 'tabs':    return renderBlogTabs(post);
    case 'stats':   return renderBlogStats(post);
    case 'article':
    default:        return renderBlogArticle(post);
  }
}

function renderBlogArticle(post){
  const paras = post.paragraphs || [];
  return paras.map(p => `<p>${p}</p>`).join('') || '<p>Full post coming soon.</p>';
}

function renderBlogGallery(post){
  const images = post.images || [];
  if(images.length === 0) return '<p>No images added yet.</p>';
  const figs = images.map(img => `
    <figure>
      <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.caption || '')}" loading="lazy">
      <figcaption>${escapeHtml(img.caption || '')}</figcaption>
    </figure>
  `).join('');
  return `<div class="blog-gallery">${figs}</div>`;
}

function renderBlogVideo(post){
  const hasRealVideo = post.videoSrc && post.videoSrc.trim() !== '';
  let inner;
  if(hasRealVideo){
    inner = `<video src="${escapeHtml(post.videoSrc)}" ${post.poster ? `poster="${escapeHtml(post.poster)}"` : ''} controls playsinline></video>`;
  } else {
    const steps = post.steps || [];
    const stepEls = steps.map(s => `<span class="blog-video-step">${escapeHtml(s)}</span>`).join('');
    inner = `
      <div class="blog-video-anim">
        ${post.poster ? `<img class="poster" src="${escapeHtml(post.poster)}" alt="">` : ''}
        ${stepEls}
      </div>
    `;
  }
  return `
    <div class="blog-video-frame">${inner}</div>
    ${post.caption ? `<p class="blog-video-caption">${escapeHtml(post.caption)}</p>` : ''}
  `;
}

function renderBlogFlow(post){
  const steps = post.steps || [];
  if(steps.length === 0) return '<p>No steps added yet.</p>';
  const stepEls = steps.map((s, idx) => `
    ${idx > 0 ? '<span class="blog-flow-connector">&#8594;</span>' : ''}
    <button type="button" class="blog-flow-step${idx === 0 ? ' active' : ''}" data-flow-index="${idx}">
      <span class="num">${idx + 1}</span>
      <span class="label">${escapeHtml(s.label || '')}</span>
    </button>
  `).join('');
  return `
    <div class="blog-flow">${stepEls}</div>
    <div class="blog-flow-detail" data-flow-detail>${escapeHtml(steps[0].detail || '')}</div>
  `;
}

function renderBlogTabs(post){
  const t = post.tabs || [];
  if(t.length === 0) return '<p>No tabs added yet.</p>';
  const navEls = t.map((tab, idx) => `<button type="button" data-tab-index="${idx}" class="${idx === 0 ? 'active' : ''}">${escapeHtml(tab.label || '')}</button>`).join('');
  return `
    <div class="blog-tabs-nav">${navEls}</div>
    <div class="blog-tabs-panel" data-tab-panel>
      <h4>${escapeHtml(t[0].heading || '')}</h4>
      <p>${escapeHtml(t[0].body || '')}</p>
    </div>
  `;
}

function renderBlogStats(post){
  const stats = post.stats || [];
  const statEls = stats.map(s => `
    <div class="blog-stat">
      <span class="value">${escapeHtml(s.value || '')}</span>
      <span class="label">${escapeHtml(s.label || '')}</span>
    </div>
  `).join('');
  const paras = (post.paragraphs || []).map(p => `<p>${p}</p>`).join('');
  return `<div class="blog-stats-grid">${statEls}</div>${paras}`;
}

function wireBlogBody(bodyEl, post){
  if(post.type === 'flow'){
    const steps = post.steps || [];
    const detailEl = bodyEl.querySelector('[data-flow-detail]');
    bodyEl.querySelectorAll('.blog-flow-step').forEach(btn => {
      btn.addEventListener('click', () => {
        bodyEl.querySelectorAll('.blog-flow-step').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const idx = Number(btn.getAttribute('data-flow-index'));
        detailEl.textContent = (steps[idx] && steps[idx].detail) || '';
      });
    });
  }
  if(post.type === 'tabs'){
    const t = post.tabs || [];
    const panel = bodyEl.querySelector('[data-tab-panel]');
    bodyEl.querySelectorAll('.blog-tabs-nav button').forEach(btn => {
      btn.addEventListener('click', () => {
        bodyEl.querySelectorAll('.blog-tabs-nav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const idx = Number(btn.getAttribute('data-tab-index'));
        const tab = t[idx];
        if(tab){
          panel.innerHTML = `<h4>${escapeHtml(tab.heading || '')}</h4><p>${escapeHtml(tab.body || '')}</p>`;
        }
      });
    });
  }
}

// ===================== Init =====================
renderStories();
renderHelpedTicker();
renderBlogs();
