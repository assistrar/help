// ===================== Shared helpers =====================
function deepClone(x){ return JSON.parse(JSON.stringify(x || [])); }
function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
function todayIso(){
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
function formatDateShort(iso){
  if(!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if(isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function parseLines(text){
  return (text || '').split('\n').map(l => l.trim()).filter(Boolean);
}
function parsePipe(line, count){
  const parts = line.split('|').map(p => p.trim());
  while(parts.length < count) parts.push('');
  return parts.slice(0, count);
}
function triggerDownload(filename, content){
  const blob = new Blob([content], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
let toastTimer;
function toast(msg){
  const el = document.getElementById('adminToast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ===================== Tabs =====================
document.querySelectorAll('.admin-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('data-admin-tab');
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.toggle('active', p.id === `admin-panel-${name}`));
  });
});

// ===================== State =====================
const state = {
  stories: deepClone(window.MAGICHELP_STORIES),
  blogs: deepClone(window.MAGICHELP_BLOGS),
  helped: deepClone(window.MAGICHELP_HELPED),
};

// ===================== SUCCESS STORIES =====================
const storiesListEl = document.getElementById('storiesList');
let storiesFormEl = null;

function renderStoriesList(){
  if(state.stories.length === 0){
    storiesListEl.innerHTML = '<div class="admin-empty">No stories yet. Click "Add story" to create the first one.</div>';
    return;
  }
  const sorted = state.stories.map((s, idx) => ({ s, idx })).sort((a, b) => (a.s.date < b.s.date ? 1 : -1));
  storiesListEl.innerHTML = '';
  sorted.forEach(({ s, idx }) => {
    const row = document.createElement('div');
    row.className = 'admin-row';
    row.innerHTML = `
      <div class="admin-row-main">
        <p class="admin-row-title">${escapeHtml(s.name || 'Untitled')}</p>
        <p class="admin-row-sub">${escapeHtml(formatDateShort(s.date))} &middot; ${escapeHtml(s.subtitle || '')}</p>
      </div>
      <div class="admin-row-actions">
        <button class="admin-btn admin-btn--sm" data-edit="${idx}" type="button">Edit</button>
        <button class="admin-btn admin-btn--sm admin-btn--danger" data-delete="${idx}" type="button">Delete</button>
      </div>
    `;
    storiesListEl.appendChild(row);
  });
  storiesListEl.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openStoryForm(Number(b.getAttribute('data-edit')))));
  storiesListEl.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => {
    const idx = Number(b.getAttribute('data-delete'));
    if(confirm('Delete this story?')){
      state.stories.splice(idx, 1);
      renderStoriesList();
      toast('Story deleted — download to publish');
    }
  }));
}

function closeStoryForm(){
  if(storiesFormEl){ storiesFormEl.remove(); storiesFormEl = null; }
}

function openStoryForm(idx){
  closeStoryForm();
  const isEdit = idx !== undefined && idx !== null;
  const s = isEdit ? state.stories[idx] : { date: todayIso(), name: '', subtitle: '', image: '', paragraphs: [] };

  storiesFormEl = document.createElement('div');
  storiesFormEl.className = 'admin-form';
  storiesFormEl.innerHTML = `
    <h3>${isEdit ? 'Edit story' : 'Add a new success story'}</h3>
    <div class="admin-field-row">
      <div class="admin-field">
        <label>Date</label>
        <input type="date" id="f-date" value="${escapeHtml(s.date || todayIso())}">
      </div>
      <div class="admin-field">
        <label>Support image
          <span class="hint">Filename in the site folder, e.g. story-1.svg or photo.jpg</span>
        </label>
        <input type="text" id="f-image" value="${escapeHtml(s.image || '')}" placeholder="story-1.svg">
      </div>
    </div>
    <div class="admin-field">
      <label>Story name</label>
      <input type="text" id="f-name" value="${escapeHtml(s.name || '')}" placeholder="Priya's Tuesday Rescue">
    </div>
    <div class="admin-field">
      <label>Subtitle</label>
      <input type="text" id="f-subtitle" value="${escapeHtml(s.subtitle || '')}" placeholder="A flat tire, a stranger, and a job saved">
    </div>
    <div class="admin-field">
      <label>Story text
        <span class="hint">One paragraph per line. Write 2-3 paragraphs.</span>
      </label>
      <textarea id="f-paragraphs" rows="6">${escapeHtml((s.paragraphs || []).join('\n'))}</textarea>
    </div>
    <div class="admin-form-actions">
      <button class="admin-btn admin-btn--primary" id="f-save" type="button">Save</button>
      <button class="admin-btn" id="f-cancel" type="button">Cancel</button>
    </div>
  `;
  storiesListEl.parentElement.insertBefore(storiesFormEl, storiesListEl);
  storiesFormEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

  storiesFormEl.querySelector('#f-cancel').addEventListener('click', closeStoryForm);
  storiesFormEl.querySelector('#f-save').addEventListener('click', () => {
    const updated = {
      date: storiesFormEl.querySelector('#f-date').value || todayIso(),
      name: storiesFormEl.querySelector('#f-name').value.trim(),
      subtitle: storiesFormEl.querySelector('#f-subtitle').value.trim(),
      image: storiesFormEl.querySelector('#f-image').value.trim() || 'story-1.svg',
      paragraphs: parseLines(storiesFormEl.querySelector('#f-paragraphs').value),
    };
    if(!updated.name){ alert('Please add a story name.'); return; }
    if(isEdit){ state.stories[idx] = updated; } else { state.stories.push(updated); }
    closeStoryForm();
    renderStoriesList();
    toast('Story saved — download to publish');
  });
}

document.getElementById('storiesAddBtn').addEventListener('click', () => openStoryForm());
document.getElementById('storiesDownloadBtn').addEventListener('click', () => {
  const header = `/* =====================================================================
   MAGICHELP — SUCCESS STORIES
   Generated by admin.html. Replace the stories-data.js file in your site
   folder with this downloaded file to publish these changes.
   ===================================================================== */

`;
  const content = header + `window.MAGICHELP_STORIES = ${JSON.stringify(state.stories, null, 2)};\n`;
  triggerDownload('stories-data.js', content);
  toast('Downloaded stories-data.js');
});

// ===================== BLOGS =====================
const blogsListEl = document.getElementById('blogsList');
let blogsFormEl = null;
const BLOG_TYPES = [
  { value: 'article', label: 'Article (text)' },
  { value: 'gallery', label: 'Gallery (photos)' },
  { value: 'video', label: 'Video / animation' },
  { value: 'flow', label: 'Flow diagram' },
  { value: 'tabs', label: 'Tabs' },
  { value: 'stats', label: 'Stats' },
];

function renderBlogsList(){
  if(state.blogs.length === 0){
    blogsListEl.innerHTML = '<div class="admin-empty">No posts yet. Click "Add post" to create the first one.</div>';
    return;
  }
  const sorted = state.blogs.map((b, idx) => ({ b, idx })).sort((a, b) => (a.b.date < b.b.date ? 1 : -1));
  blogsListEl.innerHTML = '';
  sorted.forEach(({ b, idx }) => {
    const row = document.createElement('div');
    row.className = 'admin-row';
    row.innerHTML = `
      <div class="admin-row-main">
        <p class="admin-row-title"><span class="admin-pill">${escapeHtml(b.type || 'article')}</span>${escapeHtml(b.title || 'Untitled')}</p>
        <p class="admin-row-sub">${escapeHtml(formatDateShort(b.date))} &middot; ${escapeHtml(b.excerpt || '')}</p>
      </div>
      <div class="admin-row-actions">
        <button class="admin-btn admin-btn--sm" data-edit="${idx}" type="button">Edit</button>
        <button class="admin-btn admin-btn--sm admin-btn--danger" data-delete="${idx}" type="button">Delete</button>
      </div>
    `;
    blogsListEl.appendChild(row);
  });
  blogsListEl.querySelectorAll('[data-edit]').forEach(el => el.addEventListener('click', () => openBlogForm(Number(el.getAttribute('data-edit')))));
  blogsListEl.querySelectorAll('[data-delete]').forEach(el => el.addEventListener('click', () => {
    const idx = Number(el.getAttribute('data-delete'));
    if(confirm('Delete this post?')){
      state.blogs.splice(idx, 1);
      renderBlogsList();
      toast('Post deleted — download to publish');
    }
  }));
}

function closeBlogForm(){
  if(blogsFormEl){ blogsFormEl.remove(); blogsFormEl = null; }
}

function typeFieldsHtml(type, b){
  if(type === 'gallery'){
    const val = (b.images || []).map(i => `${i.src} | ${i.caption || ''}`).join('\n');
    return `
      <div class="admin-field">
        <label>Images
          <span class="hint">One per line: filename.jpg | caption text</span>
        </label>
        <textarea id="f-type-a" rows="5">${escapeHtml(val)}</textarea>
      </div>
    `;
  }
  if(type === 'video'){
    return `
      <div class="admin-field-row">
        <div class="admin-field">
          <label>Video file <span class="hint">Optional — leave blank to show the animated placeholder</span></label>
          <input type="text" id="f-type-a" value="${escapeHtml(b.videoSrc || '')}" placeholder="myvideo.mp4">
        </div>
        <div class="admin-field">
          <label>Poster image</label>
          <input type="text" id="f-type-b" value="${escapeHtml(b.poster || '')}" placeholder="gallery-1.svg">
        </div>
      </div>
      <div class="admin-field">
        <label>Caption</label>
        <input type="text" id="f-type-c" value="${escapeHtml(b.caption || '')}">
      </div>
      <div class="admin-field">
        <label>Animated steps
          <span class="hint">One per line — only used when no video file is set</span>
        </label>
        <textarea id="f-type-d" rows="4">${escapeHtml((b.steps || []).join('\n'))}</textarea>
      </div>
    `;
  }
  if(type === 'flow'){
    const val = (b.steps || []).map(s => `${s.label} | ${s.detail || ''}`).join('\n');
    return `
      <div class="admin-field">
        <label>Flow steps
          <span class="hint">One per line: Step label | Detail text shown when tapped</span>
        </label>
        <textarea id="f-type-a" rows="6">${escapeHtml(val)}</textarea>
      </div>
    `;
  }
  if(type === 'tabs'){
    const val = (b.tabs || []).map(t => `${t.label} | ${t.heading || ''} | ${t.body || ''}`).join('\n');
    return `
      <div class="admin-field">
        <label>Tabs
          <span class="hint">One per line: Tab label | Heading | Body text</span>
        </label>
        <textarea id="f-type-a" rows="6">${escapeHtml(val)}</textarea>
      </div>
    `;
  }
  if(type === 'stats'){
    const val = (b.stats || []).map(s => `${s.value} | ${s.label}`).join('\n');
    return `
      <div class="admin-field">
        <label>Stats
          <span class="hint">One per line: Value | Label, e.g. 1,240+ | Requests answered</span>
        </label>
        <textarea id="f-type-a" rows="4">${escapeHtml(val)}</textarea>
      </div>
      <div class="admin-field">
        <label>Supporting text <span class="hint">Optional, one paragraph per line</span></label>
        <textarea id="f-type-b" rows="3">${escapeHtml((b.paragraphs || []).join('\n'))}</textarea>
      </div>
    `;
  }
  // article (default)
  return `
    <div class="admin-field">
      <label>Post text
        <span class="hint">One paragraph per line</span>
      </label>
      <textarea id="f-type-a" rows="6">${escapeHtml((b.paragraphs || []).join('\n'))}</textarea>
    </div>
  `;
}

function openBlogForm(idx){
  closeBlogForm();
  const isEdit = idx !== undefined && idx !== null;
  const b = isEdit ? state.blogs[idx] : { date: todayIso(), title: '', excerpt: '', type: 'article' };

  blogsFormEl = document.createElement('div');
  blogsFormEl.className = 'admin-form';
  blogsFormEl.innerHTML = `
    <h3>${isEdit ? 'Edit post' : 'Add a new blog post'}</h3>
    <div class="admin-field-row">
      <div class="admin-field">
        <label>Date</label>
        <input type="date" id="f-date" value="${escapeHtml(b.date || todayIso())}">
      </div>
      <div class="admin-field">
        <label>Layout type</label>
        <select id="f-type">
          ${BLOG_TYPES.map(t => `<option value="${t.value}" ${t.value === (b.type || 'article') ? 'selected' : ''}>${t.label}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="admin-field">
      <label>Title</label>
      <input type="text" id="f-title" value="${escapeHtml(b.title || '')}">
    </div>
    <div class="admin-field">
      <label>Excerpt <span class="hint">Shown on the card before it's opened</span></label>
      <input type="text" id="f-excerpt" value="${escapeHtml(b.excerpt || '')}">
    </div>
    <div id="f-type-fields">${typeFieldsHtml(b.type || 'article', b)}</div>
    <div class="admin-form-actions">
      <button class="admin-btn admin-btn--primary" id="f-save" type="button">Save</button>
      <button class="admin-btn" id="f-cancel" type="button">Cancel</button>
    </div>
  `;
  blogsListEl.parentElement.insertBefore(blogsFormEl, blogsListEl);
  blogsFormEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

  blogsFormEl.querySelector('#f-type').addEventListener('change', (e) => {
    blogsFormEl.querySelector('#f-type-fields').innerHTML = typeFieldsHtml(e.target.value, {});
  });
  blogsFormEl.querySelector('#f-cancel').addEventListener('click', closeBlogForm);
  blogsFormEl.querySelector('#f-save').addEventListener('click', () => {
    const type = blogsFormEl.querySelector('#f-type').value;
    const updated = {
      date: blogsFormEl.querySelector('#f-date').value || todayIso(),
      title: blogsFormEl.querySelector('#f-title').value.trim(),
      excerpt: blogsFormEl.querySelector('#f-excerpt').value.trim(),
      type,
    };
    if(!updated.title){ alert('Please add a title.'); return; }

    if(type === 'gallery'){
      updated.images = parseLines(blogsFormEl.querySelector('#f-type-a').value).map(line => {
        const [src, caption] = parsePipe(line, 2);
        return { src, caption };
      });
    } else if(type === 'video'){
      updated.videoSrc = blogsFormEl.querySelector('#f-type-a').value.trim();
      updated.poster = blogsFormEl.querySelector('#f-type-b').value.trim();
      updated.caption = blogsFormEl.querySelector('#f-type-c').value.trim();
      updated.steps = parseLines(blogsFormEl.querySelector('#f-type-d').value);
    } else if(type === 'flow'){
      updated.steps = parseLines(blogsFormEl.querySelector('#f-type-a').value).map(line => {
        const [label, detail] = parsePipe(line, 2);
        return { label, detail };
      });
    } else if(type === 'tabs'){
      updated.tabs = parseLines(blogsFormEl.querySelector('#f-type-a').value).map(line => {
        const [label, heading, body] = parsePipe(line, 3);
        return { label, heading, body };
      });
    } else if(type === 'stats'){
      updated.stats = parseLines(blogsFormEl.querySelector('#f-type-a').value).map(line => {
        const [value, label] = parsePipe(line, 2);
        return { value, label };
      });
      updated.paragraphs = parseLines(blogsFormEl.querySelector('#f-type-b').value);
    } else {
      updated.paragraphs = parseLines(blogsFormEl.querySelector('#f-type-a').value);
    }

    if(isEdit){ state.blogs[idx] = updated; } else { state.blogs.push(updated); }
    closeBlogForm();
    renderBlogsList();
    toast('Post saved — download to publish');
  });
}

document.getElementById('blogsAddBtn').addEventListener('click', () => openBlogForm());
document.getElementById('blogsDownloadBtn').addEventListener('click', () => {
  const header = `/* =====================================================================
   MAGICHELP — BLOGS
   Generated by admin.html. Replace the blogs-data.js file in your site
   folder with this downloaded file to publish these changes.
   ===================================================================== */

`;
  const content = header + `window.MAGICHELP_BLOGS = ${JSON.stringify(state.blogs, null, 2)};\n`;
  triggerDownload('blogs-data.js', content);
  toast('Downloaded blogs-data.js');
});

// ===================== HELPED LIST =====================
const helpedListEl = document.getElementById('helpedList');
let helpedFormEl = null;

function renderHelpedList(){
  if(state.helped.length === 0){
    helpedListEl.innerHTML = '<div class="admin-empty">No entries yet. Click "Add person" to create the first one.</div>';
    return;
  }
  helpedListEl.innerHTML = '';
  state.helped.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'admin-row';
    row.innerHTML = `
      <div class="admin-row-main">
        <p class="admin-row-title"><span class="admin-pill">${p.week === 'last' ? 'Last week' : 'This week'}</span>${escapeHtml(p.name || '')}</p>
        <p class="admin-row-sub">${escapeHtml(p.phone || '')}</p>
      </div>
      <div class="admin-row-actions">
        <button class="admin-btn admin-btn--sm" data-edit="${idx}" type="button">Edit</button>
        <button class="admin-btn admin-btn--sm admin-btn--danger" data-delete="${idx}" type="button">Delete</button>
      </div>
    `;
    helpedListEl.appendChild(row);
  });
  helpedListEl.querySelectorAll('[data-edit]').forEach(el => el.addEventListener('click', () => openHelpedForm(Number(el.getAttribute('data-edit')))));
  helpedListEl.querySelectorAll('[data-delete]').forEach(el => el.addEventListener('click', () => {
    const idx = Number(el.getAttribute('data-delete'));
    if(confirm('Delete this entry?')){
      state.helped.splice(idx, 1);
      renderHelpedList();
      toast('Entry deleted — download to publish');
    }
  }));
}

function closeHelpedForm(){
  if(helpedFormEl){ helpedFormEl.remove(); helpedFormEl = null; }
}

function openHelpedForm(idx){
  closeHelpedForm();
  const isEdit = idx !== undefined && idx !== null;
  const p = isEdit ? state.helped[idx] : { week: 'this', name: '', phone: '' };

  helpedFormEl = document.createElement('div');
  helpedFormEl.className = 'admin-form';
  helpedFormEl.innerHTML = `
    <h3>${isEdit ? 'Edit entry' : 'Add a helped person'}</h3>
    <div class="admin-field-row">
      <div class="admin-field">
        <label>Week</label>
        <select id="f-week">
          <option value="this" ${p.week !== 'last' ? 'selected' : ''}>This week</option>
          <option value="last" ${p.week === 'last' ? 'selected' : ''}>Last week</option>
        </select>
      </div>
      <div class="admin-field">
        <label>Phone number</label>
        <input type="text" id="f-phone" value="${escapeHtml(p.phone || '')}" placeholder="+1 (555) 000-0000">
      </div>
    </div>
    <div class="admin-field">
      <label>Name <span class="hint">Only add someone with their OK to show this publicly</span></label>
      <input type="text" id="f-name" value="${escapeHtml(p.name || '')}" placeholder="Priya S.">
    </div>
    <div class="admin-form-actions">
      <button class="admin-btn admin-btn--primary" id="f-save" type="button">Save</button>
      <button class="admin-btn" id="f-cancel" type="button">Cancel</button>
    </div>
  `;
  helpedListEl.parentElement.insertBefore(helpedFormEl, helpedListEl);
  helpedFormEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

  helpedFormEl.querySelector('#f-cancel').addEventListener('click', closeHelpedForm);
  helpedFormEl.querySelector('#f-save').addEventListener('click', () => {
    const updated = {
      week: helpedFormEl.querySelector('#f-week').value,
      name: helpedFormEl.querySelector('#f-name').value.trim(),
      phone: helpedFormEl.querySelector('#f-phone').value.trim(),
    };
    if(!updated.name){ alert('Please add a name.'); return; }
    if(isEdit){ state.helped[idx] = updated; } else { state.helped.push(updated); }
    closeHelpedForm();
    renderHelpedList();
    toast('Entry saved — download to publish');
  });
}

document.getElementById('helpedAddBtn').addEventListener('click', () => openHelpedForm());
document.getElementById('helpedDownloadBtn').addEventListener('click', () => {
  const header = `/* =====================================================================
   MAGICHELP — PEOPLE HELPED (sidebar ticker)
   Generated by admin.html. Replace the helped-data.js file in your site
   folder with this downloaded file to publish these changes.
   ===================================================================== */

`;
  const content = header + `window.MAGICHELP_HELPED = ${JSON.stringify(state.helped, null, 2)};\n`;
  triggerDownload('helped-data.js', content);
  toast('Downloaded helped-data.js');
});

// ===================== Init =====================
renderStoriesList();
renderBlogsList();
renderHelpedList();
