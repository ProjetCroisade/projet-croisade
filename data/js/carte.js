const REGIONS = {
  'path9': {
    label: 'Territoire des Nains',
    url: 'lore/nains.html',
    color: '#8B6525',
    desc: 'Maîtres forgerons renfermés dans leur grande forteresse de Vil Faldur, perchée dans les montagnes du nord. Leur forge légendaire est aujourd\'hui éteinte.'
  },
  'path10': {
    label: 'Territoire des Elfes',
    url: 'lore/elfes-monde.html',
    color: '#2D8A4E',
    desc: 'Peuple ancien bâti autour de l\'Arbre Monde, réparti entre les cités de Vyshad (capitale), Heilona et Jansalri. Créés par les dieux à l\'aube des temps.'
  },
  'g2': {
    label: 'Territoire des Drakeïdes',
    url: 'lore/drakeides.html',
    color: '#8B2222',
    desc: 'Descendants des anciens dragons ayant adopté une forme humanoïde. Réputés pour leur force colossale et leur inébranlable attrait pour les trésors.'
  },
  'path20': {
    label: 'Territoire des Hybrides',
    url: 'lore/hybrides.html',
    color: '#6B3A8B',
    desc: 'Peuple mi-humain mi-animal réuni à Löftina, autrefois carrefour diplomatique du continent. Frôlèrent l\'extinction avant d\'être sauvés par la famille Voldak.'
  },
  'path21': {
    label: 'Territoire des Orcs',
    url: 'lore/orcs.html',
    color: '#3D5A1A',
    desc: 'Tribus guerrières éparpillées dans des terres arides au sud-ouest. L\'honneur et les duels à mort régissent leur société, fragmentée par d\'incessantes guerres de territoire.'
  },
  'path22': {
    label: "Territoire des Aïshas",
    url: 'lore/aisha.html',
    color: '#B8860B',
    desc: 'Peuple mystérieux vivant à Atlante, cité d\'or érigée au cœur de la mer. Leur chant sacré, don de leur dieu marin, est redouté de tous les marins.'
  },
  'path23': {
    label: 'Territoire des Elfes des Ténèbres',
    url: 'lore/elfes-tenebres.html',
    color: '#3A3A9A',
    desc: 'Elfes ayant perdu la foi en l\'Arbre Monde après la trahison des dieux. Retirés dans une forêt plongée dans l\'obscurité, au nord des montagnes.'
  },
  'path24': {
    label: 'Territoire des Gobelins',
    url: 'lore/gobelins.html',
    color: '#4A6B2A',
    desc: 'Peuple tribal vivant dans de petits villages reliés par un réseau de galeries menant à Bolargyr, leur cité secrète souterraine. Souvent victimes d\'esclavage.'
  },
  'path25': {
    label: 'Territoire des Humains',
    url: 'lore/humains.html',
    color: '#7A3A1A',
    desc: 'Empire central fondé par Julius le Grand, jadis rayonnant depuis les grandes cités de Jularia et KoeurValloie. Repliés sur eux-mêmes depuis la fin des Voldak.'
  },
  'path26': {
    label: 'Territoire des Demi-Elfes',
    url: 'lore/demi-elfes.html',
    color: '#2A6B7A',
    desc: 'Race la plus jeune du continent, née de l\'union humaine-elfique. Rejetés des deux côtés depuis les exterminations, ils errent seuls à travers le monde.'
  }
};

// ── Layer toggles ─────────────────────────────────────────────
const layers     = { map: true, colors: true };
const tooltip    = document.getElementById('map-tooltip');
const tipDot     = document.getElementById('tip-dot');
const tipName    = document.getElementById('tip-name');
const tipDesc    = document.getElementById('tip-desc');
const mapImg     = document.getElementById('map-img');
let svgRegionEls = {};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function setFill(el, color) {
  if (el.tagName.toLowerCase() === 'g') {
    el.querySelectorAll('path').forEach(p => { p.style.fill = color; });
  } else {
    el.style.fill = color;
  }
}

function getIdleFill(data) {
  return layers.colors ? hexToRgba(data.color, 0.72) : 'transparent';
}

function applyIdleFills() {
  Object.values(svgRegionEls).forEach(({ el, data }) => setFill(el, getIdleFill(data)));
}

function moveTip(e) {
  if (window.innerWidth <= 600) return;
  const tw = tooltip.offsetWidth;
  const th = tooltip.offsetHeight;
  const margin = 14;
  const left = Math.min(e.clientX + margin, window.innerWidth  - tw - 8);
  const top  = Math.max(8, Math.min(e.clientY - th - margin, window.innerHeight - th - 8));
  tooltip.style.left = left + 'px';
  tooltip.style.top  = top  + 'px';
}

function initInteractivity(svgEl) {
  Object.entries(REGIONS).forEach(([id, data]) => {
    const el = svgEl.querySelector('#' + id);
    if (!el) return;

    svgRegionEls[id] = { el, data };
    setFill(el, getIdleFill(data));
    el.style.cursor = 'pointer';

    el.addEventListener('mouseenter', e => {
      setFill(el, hexToRgba(data.color, 0.85));
      tipDot.style.background = data.color;
      tipName.textContent     = data.label;
      tipDesc.textContent     = data.desc;
      tooltip.style.display   = 'block';
      moveTip(e);
    });

    el.addEventListener('mousemove', moveTip);

    el.addEventListener('mouseleave', () => {
      setFill(el, getIdleFill(data));
      tooltip.style.display = 'none';
    });

    el.addEventListener('click', () => {
      window.location.href = data.url;
    });
  });
}

document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const layer = btn.dataset.layer;
    layers[layer] = !layers[layer];
    btn.classList.toggle('off', !layers[layer]);
    if (layer === 'map')    mapImg.style.opacity = layers.map ? '1' : '0';
    if (layer === 'colors') applyIdleFills();
  });
});

// ── Zoom & pan ────────────────────────────────────────────────
const container = document.getElementById('map-container');
const inner     = document.getElementById('map-inner');
const zoomReset = document.getElementById('zoom-reset');

let scale = 1, tx = 0, ty = 0;
let isDragging = false, dragStartX, dragStartY, dragMoved = false;

const MIN_SCALE = 1, MAX_SCALE = 5;

function clampTranslate(s, x, y) {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  return {
    x: Math.min(0, Math.max(x, cw - cw * s)),
    y: Math.min(0, Math.max(y, ch - ch * s))
  };
}

function applyTransform(animate) {
  inner.style.transition = animate ? 'transform 0.2s ease' : 'none';
  inner.style.transform  = `translate(${tx}px,${ty}px) scale(${scale})`;
  zoomReset.classList.toggle('visible', scale > 1.01);
}

function zoomAt(cx, cy, newScale) {
  newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
  const ratio   = newScale / scale;
  const clamped = clampTranslate(newScale, cx - ratio * (cx - tx), cy - ratio * (cy - ty));
  scale = newScale;
  tx = clamped.x;
  ty = clamped.y;
  applyTransform(false);
}

function zoomCenter(factor) {
  zoomAt(container.clientWidth / 2, container.clientHeight / 2, scale * factor);
}

container.addEventListener('wheel', e => {
  e.preventDefault();
  const rect   = container.getBoundingClientRect();
  const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  zoomAt(e.clientX - rect.left, e.clientY - rect.top, scale * factor);
}, { passive: false });

container.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  isDragging = true;
  dragMoved  = false;
  dragStartX = e.clientX - tx;
  dragStartY = e.clientY - ty;
  container.classList.add('dragging');
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  if (Math.abs(dx - tx) > 3 || Math.abs(dy - ty) > 3) dragMoved = true;
  const clamped = clampTranslate(scale, dx, dy);
  tx = clamped.x;
  ty = clamped.y;
  applyTransform(false);
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  container.classList.remove('dragging');
});

container.addEventListener('click', e => {
  if (dragMoved) e.stopImmediatePropagation();
  dragMoved = false;
}, true);

container.addEventListener('dblclick', e => {
  const rect = container.getBoundingClientRect();
  if (scale > 1.5) {
    scale = 1; tx = 0; ty = 0;
    applyTransform(true);
  } else {
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, scale * 2);
  }
});

zoomReset.addEventListener('click', () => {
  scale = 1; tx = 0; ty = 0;
  applyTransform(true);
});

document.getElementById('zoom-in') .addEventListener('click', () => zoomCenter(1.4));
document.getElementById('zoom-out').addEventListener('click', () => zoomCenter(1 / 1.4));

let lastTouches = null;
container.addEventListener('touchstart', e => { lastTouches = e.touches; }, { passive: true });

container.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1 && lastTouches?.length === 1) {
    const dx = e.touches[0].clientX - lastTouches[0].clientX;
    const dy = e.touches[0].clientY - lastTouches[0].clientY;
    const clamped = clampTranslate(scale, tx + dx, ty + dy);
    tx = clamped.x; ty = clamped.y;
    applyTransform(false);
  } else if (e.touches.length === 2 && lastTouches?.length === 2) {
    const prev = Math.hypot(lastTouches[0].clientX - lastTouches[1].clientX, lastTouches[0].clientY - lastTouches[1].clientY);
    const curr = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    const rect  = container.getBoundingClientRect();
    const cx = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
    const cy = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
    zoomAt(cx, cy, scale * (curr / prev));
  }
  lastTouches = e.touches;
}, { passive: false });

container.addEventListener('touchend', e => { lastTouches = e.touches; }, { passive: true });

// ── Load SVG ──────────────────────────────────────────────────
fetch('images/carte incomplète.svg')
  .then(res => res.text())
  .then(svgText => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgEl  = svgDoc.querySelector('svg');

    const refGroup = svgEl.querySelector('#g1');
    if (refGroup) refGroup.remove();
    const namedview = svgEl.querySelector('[id="namedview1"]');
    if (namedview) namedview.remove();

    svgEl.removeAttribute('width');
    svgEl.removeAttribute('height');
    svgEl.setAttribute('preserveAspectRatio', 'none');

    document.getElementById('svg-overlay').appendChild(svgEl);
    initInteractivity(svgEl);
  });
