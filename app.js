import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';

/* ---------------- data ---------------- */
const COUNTRIES = {
  NL:{en:'Netherlands',nl:'Nederland'}, DE:{en:'Germany',nl:'Duitsland'}, PT:{en:'Portugal',nl:'Portugal'},
  HR:{en:'Croatia',nl:'Kroatië'}, ES:{en:'Spain',nl:'Spanje'}, XX:{en:'Other country',nl:'Ander land'}
};
const GATES = [
  {id:'A1', cc:'NL', city:'Groningen', key:'lounge_A1_netherlands', landmark:{en:'Martinitoren',nl:'Martinitoren'}},
  {id:'A2', cc:'DE', city:'Berlin',    key:'lounge_A2_germany',     landmark:{en:'Brandenburg Gate',nl:'Brandenburger Tor'}},
  {id:'A3', cc:'PT', city:'Lisboa',    key:'lounge_A3_portugal',    landmark:{en:'25 de Abril bridge',nl:'25 de Abril-brug'}},
  {id:'A4', cc:'HR', city:'Dubrovnik', key:'lounge_A4_croatia',     landmark:{en:'City walls',nl:'Stadsmuren'}},
  {id:'A5', cc:'ES', city:'Barcelona', key:'lounge_A5_spain',       landmark:{en:'Sagrada Família',nl:'Sagrada Família'}},
];
const SEED_TEAMS = {
  A1:[{n:'Lena',cc:'DE',s:'intl'},{n:'Tiago',cc:'PT',s:'intl'},{n:'Daan',cc:'NL',s:'hanze'}],
  A2:[{n:'Ana',cc:'HR',s:'intl'},{n:'Fleur',cc:'NL',s:'hanze'},{n:'Javier',cc:'ES',s:'intl'}],
  A3:[{n:'Sem',cc:'NL',s:'hanze'},{n:'Mia',cc:'DE',s:'intl'}],
  A4:[{n:'Lucía',cc:'ES',s:'intl'},{n:'Jesse',cc:'NL',s:'hanze'},{n:'Inês',cc:'PT',s:'intl'}],
  A5:[{n:'Luka',cc:'HR',s:'intl'},{n:'Noa',cc:'NL',s:'hanze'}],
};
const SEED_IDEAS = [
  {id:'s1',n:'Lena',cc:'DE',likes:12,en:'A buddy map: pin your favourite study spot so newcomers find it on day one.',nl:'Een buddykaart: prik je favoriete studieplek, zodat nieuwkomers die op dag één vinden.'},
  {id:'s2',n:'Ana',cc:'HR',likes:11,en:'A 10-minute bike lesson for internationals in week one.',nl:'Een fietsles van 10 minuten voor internationals in week één.'},
  {id:'s3',n:'Tiago',cc:'PT',likes:10,en:'Swap a snack from home at the first meeting. Food breaks the ice.',nl:'Ruil een snack van thuis bij de eerste ontmoeting. Eten breekt het ijs.'},
  {id:'s4',n:'Fleur',cc:'NL',likes:8,en:'Pictogram signs from the station to campus: no Dutch needed.',nl:'Bordjes met pictogrammen van station naar campus: geen Nederlands nodig.'},
  {id:'s5',n:'Javier',cc:'ES',likes:6,en:'Voice notes instead of long e-mails in the welcome week.',nl:'Spraakberichten in plaats van lange e-mails in de introweek.'},
  {id:'s6',n:'Sem',cc:'NL',likes:4,en:'Every gate gets a playlist with songs from all five countries.',nl:'Elke gate krijgt een playlist met nummers uit alle vijf landen.'},
];
const STATUS_SEED = {A1:'d',A2:'b',A3:'o',A4:'b',A5:'o'};

/* ---------------- i18n ---------------- */
const T = {
 en:{title:'Departure Lounge',subtitle:'Your next journey starts here',loading:'Preparing the lounge…',
  z_checkin:'Check-in',z_ideas:'Idea Arrivals Board',z_stage:'Final Call',z_stories:'Stories',z_board:'Departures',z_gate:'Gate',
  s_checkin:'Checked in',s_gate:'Met your gate',s_idea:'Idea posted',s_final:'Final call',
  ob1_k:'Step 1 of 3 · Scan',ob1_h:'Scan your <em>boarding pass</em>',
  ob1_p:'You got a paper boarding pass at the kick-off (or in the mystery box). The QR code on it opens this lounge. Type the code under the QR, or use the demo pass.',
  code:'Pass code',demo:'Use demo pass',next:'Next',back:'Back',
  how1:'Check in',how2:'Meet your gate',how3:'Post one idea',how4:'Final call',
  ob2_k:'Step 2 of 3 · Check in',ob2_h:'Who is <em>travelling</em>?',ob2_p:'Only your first name and country are shown to others.',
  fname:'First name',country:'Where are you from?',study:'Where do you study?',
  hanze:'Hanze, Groningen',hanze_s:'Hosting the new arrivals',intl:'Partner university',intl_s:'Joining from abroad',
  err_name:'Fill in your first name.',err_code:'This code does not look like a pass code (INC-XXXX).',err_study:'Choose where you study.',
  ob3_k:'Step 3 of 3 · Boarding pass',ob3_h:'You fly from <em>gate {g}</em>',
  why:'Your gate mixes Hanze students and students from abroad, and sends you to a city that is not your own.',
  enter:'Enter the lounge',passenger:'Passenger',gate:'Gate',dest:'Destination',seat:'Team',
  ck_h:'Check-in desk',ck_p:'This is where your physical boarding pass becomes digital. Every step you take here gives you a stamp, just like the paper passport at the kick-off.',
  ck_me:'Your boarding pass',ck_go:'Go to your gate',ck_reset:'Reset demo',ck_none:'You have not checked in yet.',ck_start:'Check in',
  id_k:'Idea Arrivals Board',id_h:'One brief. Five countries.',id_p:'How would you help a new student feel at home in a new city? Post one idea. Like the ideas you believe in (max 3, not your own).',
  id_post:'Post my idea',id_update:'Update my idea',id_ph:'My idea is…',id_need:'Check in first to post an idea.',likes_left:'{n} like(s) left',
  g_k:'Gate {g} · {city}',g_h:'Your team for this journey',g_other:'This is gate {g}. Your own gate is {mine}.',
  g_task:'Team task · 15 minutes',
  t1:'Say hi',t1s:'Name + one photo of your city',t2:'Share',t2s:'What surprised you as a new student?',t3:'Make',t3s:'One idea together. Post it on the board.',
  g_start:'Start timer',g_pause:'Pause',g_call:'Open video call',g_done:'We are done: board the flight',g_isdone:'Departed. Nice work!',
  g_call_note:'The call opens in a new tab (Jitsi, no account needed).',
  st_k:'Stories from past travellers',st_h:'They arrived. So will you.',
  b_k:'Departures',b_h:'ProjectINc: your next journey',b_dest:'Destination',b_gate:'Gate',b_team:'Team',b_status:'Status',
  stat_b:'Boarding',stat_d:'Departed',stat_o:'On time',
  f_k:'Golden Boarding Pass · Final call',f_h:'And the winner is…',f_p:'The idea with the most likes wins the Golden Boarding Pass: a €100 travel voucher and a spot on the stage at the kick-off.',
  f_btn:'Final call: reveal the winner',f_again:'Reveal again',f_lead:'Leading now',
  toast_stamp:'Stamp collected: {s}',toast_posted:'Your idea landed on the board',you:'you',
  zones_hint:'Drag to look around · click a sign',
 },
 nl:{title:'Departure Lounge',subtitle:'Je volgende reis begint hier',loading:'De lounge wordt klaargezet…',
  z_checkin:'Check-in',z_ideas:'Ideeënbord',z_stage:'Final Call',z_stories:'Verhalen',z_board:'Vertrekbord',z_gate:'Gate',
  s_checkin:'Ingecheckt',s_gate:'Team ontmoet',s_idea:'Idee geplaatst',s_final:'Final call',
  ob1_k:'Stap 1 van 3 · Scannen',ob1_h:'Scan je <em>boarding pass</em>',
  ob1_p:'Je kreeg bij de kick-off (of in de mysterybox) een papieren boarding pass. De QR-code daarop opent deze lounge. Typ de code onder de QR, of gebruik de demopas.',
  code:'Code van je pas',demo:'Demopas gebruiken',next:'Volgende',back:'Terug',
  how1:'Inchecken',how2:'Ontmoet je gate',how3:'Plaats één idee',how4:'Final call',
  ob2_k:'Stap 2 van 3 · Inchecken',ob2_h:'Wie gaat er <em>mee</em>?',ob2_p:'Anderen zien alleen je voornaam en land.',
  fname:'Voornaam',country:'Waar kom je vandaan?',study:'Waar studeer je?',
  hanze:'Hanze, Groningen',hanze_s:'Je ontvangt de nieuwkomers',intl:'Partneruniversiteit',intl_s:'Je doet mee vanuit het buitenland',
  err_name:'Vul je voornaam in.',err_code:'Dit lijkt geen code van een pas (INC-XXXX).',err_study:'Kies waar je studeert.',
  ob3_k:'Stap 3 van 3 · Boarding pass',ob3_h:'Je vertrekt vanaf <em>gate {g}</em>',
  why:'Elke gate mengt Hanze-studenten en studenten uit het buitenland, en stuurt je naar een stad die niet de jouwe is.',
  enter:'Naar de lounge',passenger:'Passagier',gate:'Gate',dest:'Bestemming',seat:'Team',
  ck_h:'Check-in balie',ck_p:'Hier wordt je papieren boarding pass digitaal. Elke stap levert een stempel op, net als het papieren paspoort bij de kick-off.',
  ck_me:'Jouw boarding pass',ck_go:'Naar je gate',ck_reset:'Demo opnieuw',ck_none:'Je bent nog niet ingecheckt.',ck_start:'Inchecken',
  id_k:'Ideeënbord',id_h:'Eén opdracht. Vijf landen.',id_p:'Hoe help jij een nieuwe student zich thuis te voelen in een nieuwe stad? Plaats één idee. Like de ideeën waar je in gelooft (max. 3, niet je eigen).',
  id_post:'Plaats mijn idee',id_update:'Idee bijwerken',id_ph:'Mijn idee is…',id_need:'Check eerst in om een idee te plaatsen.',likes_left:'nog {n} like(s) over',
  g_k:'Gate {g} · {city}',g_h:'Je team voor deze reis',g_other:'Dit is gate {g}. Jouw gate is {mine}.',
  g_task:'Teamopdracht · 15 minuten',
  t1:'Zeg hoi',t1s:'Naam + één foto van je stad',t2:'Deel',t2s:'Wat verraste jou als nieuwe student?',t3:'Maak',t3s:'Samen één idee. Zet het op het bord.',
  g_start:'Start timer',g_pause:'Pauze',g_call:'Open videogesprek',g_done:'Klaar: boarden maar',g_isdone:'Vertrokken. Goed gedaan!',
  g_call_note:'Het gesprek opent in een nieuw tabblad (Jitsi, geen account nodig).',
  st_k:'Verhalen van eerdere reizigers',st_h:'Zij kwamen aan. Jij ook.',
  b_k:'Vertrekbord',b_h:'ProjectINc: je volgende reis',b_dest:'Bestemming',b_gate:'Gate',b_team:'Team',b_status:'Status',
  stat_b:'Boarding',stat_d:'Vertrokken',stat_o:'Op tijd',
  f_k:'Golden Boarding Pass · Final call',f_h:'En de winnaar is…',f_p:'Het idee met de meeste likes wint de Golden Boarding Pass: een reisvoucher van €100 en een plek op het podium bij de kick-off.',
  f_btn:'Final call: maak de winnaar bekend',f_again:'Nog een keer',f_lead:'Nu aan kop',
  toast_stamp:'Stempel verdiend: {s}',toast_posted:'Je idee is geland op het bord',you:'jij',
  zones_hint:'Sleep om rond te kijken · klik op een bord',
 }
};
const STORIES = [
  {n:'Sol',cc:'ES',en:'“I was scared my Dutch was not good enough. At my gate nobody cared: we drew our ideas.”',nl:'“Ik was bang dat mijn Nederlands niet goed genoeg was. Bij mijn gate maakte dat niemand uit: we tekenden onze ideeën.”'},
  {n:'Bram',cc:'NL',en:'“I only joined for the credits. I left with three friends in Lisbon.”',nl:'“Ik deed mee voor de studiepunten. Ik ging weg met drie vrienden in Lissabon.”'},
  {n:'Jonas',cc:'PT',en:'“The board made it easy: I always knew where to go next.”',nl:'“Door het bord wist ik altijd waar ik heen moest.”'},
];

/* ---------------- state ---------------- */
const KEY='projectinc-lounge-v1';
const fresh = () => ({lang:'en', me:null, ideas:SEED_IDEAS.map(i=>({...i})), liked:[], stamps:{}, done:{}, timer:{}, revealed:false});
let S = fresh();
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch(e){}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} };
const t = (k, v={}) => (T[S.lang][k] ?? T.en[k] ?? k).replace(/\{(\w+)\}/g, (_,x)=>v[x] ?? '');
const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const flag = cc => `<span class="flag f-${cc}"></span>`;
const cname = cc => COUNTRIES[cc][S.lang];
const gateById = id => GATES.find(g=>g.id===id);
const ideaText = i => i.text ?? i[S.lang] ?? i.en;
const team = id => { const m = SEED_TEAMS[id].map(x=>({...x})); if (S.me && S.me.gate===id) m.push({n:S.me.name,cc:S.me.cc,s:S.me.s,me:true}); return m; };
const status = id => S.done[id] ? 'd' : (S.me && S.me.gate===id ? 'b' : STATUS_SEED[id]);
const ranked = () => [...S.ideas].sort((a,b)=>b.likes-a.likes);

/* ---------------- three.js scene ---------------- */
const host = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f6f0df');
scene.fog = new THREE.Fog('#f6f0df', 45, 90);
const camera = new THREE.PerspectiveCamera(40, innerWidth/innerHeight, 0.1, 200);
const HOME = {pos:new THREE.Vector3(2, 15, 27), tgt:new THREE.Vector3(-0.5, 1, 0)};
camera.position.copy(HOME.pos);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(HOME.tgt);
controls.enableDamping = true;
controls.maxPolarAngle = 1.42;
controls.minDistance = 3; controls.maxDistance = 48;
controls.screenSpacePanning = true;

scene.add(new THREE.HemisphereLight('#fffaf0', '#cdbfa8', 1.6));
const sun = new THREE.DirectionalLight('#ffffff', 2.1);
sun.position.set(-14, 22, 14);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, {left:-20,right:20,top:16,bottom:-16,near:1,far:70});
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
scene.add(sun);

const COLORS = {
  floor_cream:'#f3ead8', wall_paper:'#e6dcc8', purple:'#2c1650', glass:'#bcd6e6', apron:'#a7a59f',
  white:'#fbf8f2', aircraft_white:'#f5f5f8', sand:'#d9c49c', projectinc_yellow:'#f7d558', projectinc_orange:'#f07148',
  steel:'#8e8b9c', flag_red:'#cf2e36', flag_blue:'#24468f', flag_green:'#1f7a3e', flag_gold:'#f2c230', flag_black:'#232026',
  rug_lilac:'#e4d8f0', fabric_violet:'#5a3b8f', fabric_lilac:'#b9a2dd', landmark_ink:'#3b2566'
};

/* canvas textures for every printable face */
const prints = {};
function makePrint(key, w, h){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  prints[key] = {c, ctx:c.getContext('2d'), tex, w, h};
  return prints[key];
}
const SIZES = {
  board_face_print:[1200,610], stage_screen_print:[1024,576], stories_screen_print:[896,506], idea_wall_header_print:[1440,120],
  control_sign_face_print:[760,204], lectern_logo_space_print:[256,256], passport_print_left_print:[300,212], passport_print_right_print:[300,212]
};
for (const g of GATES) SIZES[g.key+'_sign_face_print'] = [520,210];
for (let i=1;i<=18;i++) SIZES[`polaroid_${String(i).padStart(2,'0')}_print_print`] = [280,330];

const hitboxes = [];
let BB = {};
async function loadModel(){
  const meta = await fetch('lounge.json').then(r=>r.json());
  const raw = atob(meta.bin); const bytes = new Uint8Array(raw.length); for (let i=0;i<raw.length;i++) bytes[i] = raw.charCodeAt(i); const bin = bytes.buffer;
  BB = meta.bbox;
  for (const m of meta.meshes){
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(bin, m.pos, m.count*3), 3));
    let mat;
    if (m.key.startsWith('print:')){
      const k = m.key.slice(6);
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(bin, m.uv, m.count*2), 2));
      g.computeVertexNormals();
      const [w,h] = SIZES[k] || [256,256];
      const p = makePrint(k, w, h);
      mat = new THREE.MeshBasicMaterial({map:p.tex, side:THREE.DoubleSide, toneMapped:false});
      g.translate(0,0,0);
    } else {
      g.computeVertexNormals();
      const glass = m.key==='glass';
      mat = new THREE.MeshStandardMaterial({color:COLORS[m.key]||'#cccccc', roughness:glass?0.1:0.82, metalness:m.key==='steel'?0.35:0,
        flatShading:true, transparent:glass, opacity:glass?0.28:1});
    }
    const mesh = new THREE.Mesh(g, mat);
    mesh.castShadow = !m.key.startsWith('print:') && !['floor_cream','apron','glass','wall_paper','rug_lilac'].includes(m.key);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
}

/* ---------------- zones ---------------- */
const ctr = (k, dy=0) => { const b = BB[k]; return new THREE.Vector3((b[0]+b[3])/2, (b[1]+b[4])/2+dy, (b[2]+b[5])/2); };
let ZONES = [];
function buildZones(){
  ZONES = [
    {id:'checkin', num:'1', label:()=>t('z_checkin'), pin:ctr('control_sign',0.75), look:ctr('desk_top',0.6), from:[-1.5,4.2,8.5], box:'desk_body'},
    {id:'ideas',   num:'2', label:()=>t('z_ideas'),  pin:ctr('idea_wall_header',0.65), look:ctr('idea_wall_panel').setX(-10.3), from:[-10.3,3.0,2.8], box:'idea_wall_panel'},
    ...GATES.map(g=>({id:g.id, num:g.id, gate:g, label:()=>`${t('z_gate')} ${g.id} · ${g.city}`, pin:ctr(g.key+'_sign',0.6), look:ctr(g.key+'_rug',0.8),
       from:null, box:g.key+'_rug'})),
    {id:'stage',   num:'★', label:()=>t('z_stage'), pin:ctr('stage_screen',2.1), look:ctr('stage_screen',-0.4), from:[0,3.6,2.2], box:'stage_platform'},
    {id:'stories', num:'♪', label:()=>t('z_stories'), pin:ctr('stories_screen',1.3), look:ctr('stories_screen',-0.3), from:[8.4,3.2,-2.2], box:'stories_rug'},
    {id:'board',   num:'✈', label:()=>t('z_board'), pin:ctr('board_frame',1.9), look:ctr('board_face'), from:[8.6,4.8,19.5], box:'board_frame'},
  ];
  for (const z of ZONES){
    if (!z.from){ const c = z.look; z.from = [c.x*0.85, 8.2, c.z+7.2]; }
    const b = BB[z.box];
    const geo = new THREE.BoxGeometry(Math.max(b[3]-b[0],0.6), Math.max(b[4]-b[1],1.8), Math.max(b[5]-b[2],0.6));
    const hb = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({visible:false}));
    hb.position.set((b[0]+b[3])/2, Math.max((b[1]+b[4])/2, 0.9), (b[2]+b[5])/2);
    hb.userData.zone = z.id; scene.add(hb); hitboxes.push(hb);
  }
}

/* camera fly */
let fly = null;
function flyTo(pos, tgt, ms=1100){
  fly = {t0:performance.now(), ms, p0:camera.position.clone(), q0:controls.target.clone(), p1:pos.clone(), q1:tgt.clone()};
}
function flyZone(id){ const z = ZONES.find(z=>z.id===id); if (z) flyTo(new THREE.Vector3(...z.from), z.look); }

/* ---------------- avatars ---------------- */
const avatarGroup = new THREE.Group(); scene.add(avatarGroup);
const bodyGeo = new THREE.CapsuleGeometry(0.22, 0.62, 4, 10);
const headGeo = new THREE.SphereGeometry(0.2, 16, 12);
const AV_COL = {hanze:'#f07148', intl:'#57368b'};
let meMarker = null;
function makeAvatar(col, isMe){
  const g = new THREE.Group();
  const b = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({color:col, roughness:.7}));
  b.position.y = 0.53; b.castShadow = true;
  const h = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({color:'#f1d7c0', roughness:.8}));
  h.position.y = 1.25; h.castShadow = true;
  g.add(b, h);
  if (isMe){
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.06, 8, 32), new THREE.MeshBasicMaterial({color:'#f7d558'}));
    ring.rotation.x = Math.PI/2; ring.position.y = 0.04; g.add(ring);
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.32, 4), new THREE.MeshBasicMaterial({color:'#f7d558'}));
    arrow.rotation.x = Math.PI; arrow.position.y = 1.85; g.add(arrow); g.userData.arrow = arrow;
  }
  return g;
}
function placeAvatars(){
  avatarGroup.clear(); meMarker = null;
  for (const g of GATES){
    const c = ctr(g.key+'_rug'); const m = team(g.id);
    m.forEach((p,i)=>{
      const a = makeAvatar(p.me ? '#f7d558' : AV_COL[p.s], p.me);
      const ang = -Math.PI/2 + (i - (m.length-1)/2) * 0.9;
      a.position.set(c.x + Math.cos(ang)*1.15, 0, c.z + 1.1 + Math.sin(ang)*0.2 + 0.3);
      a.lookAt(c.x, 0, c.z);
      avatarGroup.add(a); if (p.me) meMarker = a;
    });
  }
}

/* ---------------- canvas drawing ---------------- */
const FONT_H = "'Space Grotesk', 'DM Sans', Arial, sans-serif";
const FONT_B = "'DM Sans', Arial, sans-serif";
function wrap(ctx, text, x, y, maxW, lh, maxLines=9){
  const words = String(text).split(/\s+/); let line = '', n = 0;
  for (let i=0;i<words.length;i++){
    const test = line ? line+' '+words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line){
      if (n === maxLines-1){ ctx.fillText(line+'…', x, y); return; }
      ctx.fillText(line, x, y); line = words[i]; y += lh; n++;
    } else line = test;
  }
  ctx.fillText(line, x, y);
}
function drawFlag(ctx, cc, x, y, w, h){
  const st = {NL:['h','#ae1c28','#ffffff','#21468b'],DE:['h','#000','#dd0000','#ffce00'],HR:['h','#ff0000','#ffffff','#171796'],
    ES:['h3','#aa151b','#f1bf00','#aa151b'],PT:['v','#006600','#ff0000'],XX:['h','#d4e9e5','#9b85c4','#57368b']}[cc];
  if (st[0]==='v'){ ctx.fillStyle=st[1]; ctx.fillRect(x,y,w*0.4,h); ctx.fillStyle=st[2]; ctx.fillRect(x+w*0.4,y,w*0.6,h); }
  else if (st[0]==='h3'){ ctx.fillStyle=st[1]; ctx.fillRect(x,y,w,h); ctx.fillStyle=st[2]; ctx.fillRect(x,y+h*.25,w,h*.5); }
  else for (let i=0;i<3;i++){ ctx.fillStyle=st[i+1]; ctx.fillRect(x, y+i*h/3, w, h/3+0.5); }
}
let logoImg = null;
function drawAll(){
  const P = prints;
  // departures board
  if (P.board_face_print){ const {ctx,w,h} = P.board_face_print;
    ctx.fillStyle='#281048'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#f07148'; ctx.font=`700 26px ${FONT_H}`; ctx.fillText('✈  DEPARTURES', 44, 64);
    ctx.fillStyle='#fff'; ctx.font=`700 54px ${FONT_H}`; ctx.fillText('ProjectINc – Your next journey', 44, 124);
    if (logoImg) ctx.drawImage(logoImg, w-150, 26, 110, 110);
    ctx.font=`700 20px ${FONT_H}`; ctx.fillStyle='#cbb9e6';
    ctx.fillText('DESTINATION', 44, 186); ctx.fillText('GATE', 620, 186); ctx.fillText('TEAM', 760, 186); ctx.fillText('STATUS', 900, 186);
    GATES.forEach((g,i)=>{ const y = 236 + i*72;
      ctx.fillStyle='rgba(255,255,255,.08)'; ctx.fillRect(36, y-44, w-72, 60);
      ctx.font=`700 38px ${FONT_H}`; ctx.fillStyle='#fff';
      let x = 52; for (const ch of g.city.toUpperCase()){ ctx.fillStyle='#3d2363'; ctx.fillRect(x-4, y-36, 34, 46); ctx.fillStyle='#fff'; ctx.fillText(ch, x, y); x += 38; }
      ctx.font=`700 34px ${FONT_H}`; ctx.fillStyle='#fff'; ctx.fillText(g.id, 620, y);
      ctx.fillText(String(team(g.id).length), 775, y);
      const s = status(g.id); ctx.fillStyle = s==='b'?'#f7d558':s==='d'?'#8ee0c3':'#ffffff';
      ctx.fillText(t('stat_'+s), 900, y);
    });
    P.board_face_print.tex.needsUpdate = true; }
  // stage screen
  if (P.stage_screen_print){ const {ctx,w,h} = P.stage_screen_print;
    ctx.fillStyle='#281048'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#f07148'; ctx.font=`700 24px ${FONT_H}`; ctx.fillText('CASE CHALLENGE · GOLDEN BOARDING PASS', 60, 80);
    if (!S.revealed){
      ctx.fillStyle='#fff'; ctx.font=`700 104px ${FONT_H}`; ctx.fillText('AWARD', 60, 210); ctx.fillText('CEREMONY', 60, 316);
      ctx.fillStyle='#f7d558'; ctx.font=`700 44px ${FONT_H}`; ctx.fillText('And the winner is…', 60, 400);
      ctx.fillStyle='#cbb9e6'; ctx.font=`500 26px ${FONT_B}`; ctx.fillText(`${S.ideas.length} ideas on the board · most likes wins`, 60, 500);
    } else { const win = ranked()[0];
      ctx.fillStyle='#f7d558'; ctx.font=`700 40px ${FONT_H}`; ctx.fillText('And the winner is…', 60, 150);
      drawFlag(ctx, win.cc, 60, 182, 72, 48);
      ctx.fillStyle='#fff'; ctx.font=`700 92px ${FONT_H}`; ctx.fillText(win.n, 150, 236);
      ctx.font=`500 34px ${FONT_B}`; ctx.fillStyle='#e5ddee'; wrap(ctx, ideaText(win), 60, 320, w-120, 44, 4);
      ctx.fillStyle='#f07148'; ctx.font=`700 30px ${FONT_H}`; ctx.fillText(`♥ ${win.likes} likes`, 60, 520);
    }
    P.stage_screen_print.tex.needsUpdate = true; }
  // stories screen
  if (P.stories_screen_print){ const {ctx,w,h} = P.stories_screen_print;
    ctx.fillStyle='#281048'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#f07148'; ctx.font=`700 22px ${FONT_H}`; ctx.fillText('STORIES', 50, 70);
    ctx.fillStyle='#fff'; ctx.font=`700 56px ${FONT_H}`; ctx.fillText('Stories from', 50, 150); ctx.fillText('past travellers', 50, 214);
    ctx.fillStyle='#f7d558'; ctx.beginPath(); ctx.arc(90, 330, 40, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='#281048'; ctx.beginPath(); ctx.moveTo(78,308); ctx.lineTo(78,352); ctx.lineTo(112,330); ctx.fill();
    ctx.fillStyle='#e5ddee'; ctx.font=`500 26px ${FONT_B}`; ctx.fillText('Sol · Bram · Jonas', 150, 340);
    P.stories_screen_print.tex.needsUpdate = true; }
  // idea wall header
  if (P.idea_wall_header_print){ const {ctx,w,h} = P.idea_wall_header_print;
    ctx.fillStyle='#fffaf0'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#f07148'; ctx.font=`700 26px ${FONT_H}`; ctx.fillText('NOW OPEN · IDEA ARRIVALS BOARD', 30, 44);
    ctx.fillStyle='#281048'; ctx.font=`700 50px ${FONT_H}`; ctx.fillText('SAME BRIEF. DIFFERENT ROUTES.', 30, 100);
    P.idea_wall_header_print.tex.needsUpdate = true; }
  // polaroids = ideas, then empty slots inviting a new idea
  const rk = ranked(); const win = S.revealed ? rk[0] : null;
  const ideas = [...rk.filter(i=>i.mine), ...rk.filter(i=>!i.mine)];
  for (let i=1;i<=18;i++){ const p = P[`polaroid_${String(i).padStart(2,'0')}_print_print`]; if (!p) continue;
    const {ctx,w,h} = p; const idea = ideas[i-1];
    if (!idea){ ctx.fillStyle='#f1e9fa'; ctx.fillRect(0,0,w,h);
      ctx.strokeStyle='#b9a2dd'; ctx.setLineDash([12,10]); ctx.lineWidth=5; ctx.strokeRect(22,90,w-44,h-150); ctx.setLineDash([]);
      ctx.fillStyle='#8a73b3'; ctx.font=`700 64px ${FONT_H}`; ctx.textAlign='center'; ctx.fillText('+', w/2, h/2+30);
      ctx.font=`700 22px ${FONT_H}`; ctx.fillText('YOUR IDEA?', w/2, h-24); ctx.textAlign='left'; p.tex.needsUpdate = true; continue; }
    const mine = !!idea.mine;
    ctx.fillStyle = idea===win ? '#f7d558' : mine ? '#fff3c4' : '#ffffff'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#281048'; ctx.font=`700 30px ${FONT_H}`; ctx.fillText(idea.n, 20, 112);
    ctx.font=`500 23px ${FONT_B}`; ctx.fillStyle='#24113c'; wrap(ctx, ideaText(idea), 20, 150, w-40, 28, 5);
    ctx.fillStyle='#f07148'; ctx.font=`700 26px ${FONT_H}`; ctx.fillText(`♥ ${idea.likes}`, 20, h-20);
    if (idea===win){ ctx.fillStyle='#281048'; ctx.font=`700 20px ${FONT_H}`; ctx.fillText('WINNER', w-110, h-22); }
    p.tex.needsUpdate = true; }
  // gate signs
  for (const g of GATES){ const p = P[g.key+'_sign_face_print']; if (!p) continue; const {ctx,w,h} = p;
    const mine = S.me && S.me.gate===g.id;
    ctx.fillStyle = mine ? '#f7d558' : '#281048'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = mine ? '#281048' : '#f7d558'; ctx.font=`700 92px ${FONT_H}`; ctx.fillText(g.id, 26, 120);
    drawFlag(ctx, g.cc, 170, 48, 90, 60);
    ctx.fillStyle = mine ? '#281048' : '#fff'; ctx.font=`700 44px ${FONT_H}`; ctx.fillText(g.city, 26, 186);
    if (mine){ ctx.font=`700 30px ${FONT_H}`; ctx.fillText('YOUR GATE', 290, 92); }
    p.tex.needsUpdate = true; }
  // check-in sign
  if (P.control_sign_face_print){ const {ctx,w,h} = P.control_sign_face_print;
    ctx.fillStyle='#281048'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#f7d558'; ctx.font=`700 92px ${FONT_H}`; ctx.fillText('CHECK-IN', 34, 128);
    ctx.fillStyle='#fff'; ctx.font=`500 28px ${FONT_B}`; ctx.fillText('Scan your boarding pass', 34, 178);
    P.control_sign_face_print.tex.needsUpdate = true; }
  if (P.lectern_logo_space_print){ const {ctx,w,h} = P.lectern_logo_space_print;
    ctx.fillStyle='#281048'; ctx.fillRect(0,0,w,h); if (logoImg) ctx.drawImage(logoImg, 18, 18, w-36, h-36);
    P.lectern_logo_space_print.tex.needsUpdate = true; }
  for (const side of ['left','right']){ const p = P[`passport_print_${side}_print`]; if (!p) continue; const {ctx,w,h} = p;
    ctx.fillStyle='#fbf3df'; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#57368b'; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(w/2, h/2, 62, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle='#57368b'; ctx.font=`700 26px ${FONT_H}`; ctx.textAlign='center'; ctx.fillText(side==='left'?'INC':'GRQ', w/2, h/2+9); ctx.textAlign='left';
    p.tex.needsUpdate = true; }
}

/* ---------------- UI ---------------- */
const $ = id => document.getElementById(id);
function toast(msg){ const el = $('toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(()=>el.classList.remove('on'), 2400); }
function stamp(k){ if (S.stamps[k]) return; S.stamps[k] = Date.now(); save(); toast(t('toast_stamp',{s:t('s_'+k)})); renderRoute(); }

function applyStatic(){
  document.documentElement.lang = S.lang;
  document.querySelectorAll('[data-t]').forEach(el => el.textContent = t(el.dataset.t));
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang===S.lang));
  if (S.me){ $('btnPass').hidden = false; $('passChip').textContent = innerWidth < 760 ? S.me.gate : `${S.me.name} · ${t('gate')} ${S.me.gate}`; } else $('btnPass').hidden = true;
}
function renderZones(){
  $('zones').innerHTML = ZONES.filter(z=>!z.gate || !S.me || z.id===S.me.gate || true).map(z =>
    `<button data-zone="${z.id}" class="${current===z.id?'on':''}"><span class="n">${z.num}</span><span class="${z.gate?'lbl-long':''}">${esc(z.gate ? z.gate.city : z.label())}</span></button>`).join('');
}
function renderRoute(){
  const order = ['checkin','gate','idea','final'];
  const icons = {checkin:'✓',gate:'☺',idea:'✎',final:'★'};
  const next = order.find(k=>!S.stamps[k]);
  $('route').innerHTML = order.map(k =>
    `<button class="stamp ${S.stamps[k]?'got':''} ${k===next?'next':''}" data-step="${k}"><span class="i">${icons[k]}</span><span class="t">${t('s_'+k)}</span></button>`).join('');
}
function renderPins(){
  $('pins').innerHTML = ZONES.map(z => {
    const mine = z.gate && S.me && S.me.gate===z.id; const done = z.gate && S.done[z.id];
    return `<div class="pin ${mine?'me':''} ${done?'done':''}" data-zone="${z.id}"><span class="n">${z.gate?'':z.num}${z.gate?z.id:''}</span><span class="lbl">${esc(z.gate ? z.gate.city : z.label())}</span></div>`;
  }).join('');
}
const tmp = new THREE.Vector3();
function updatePins(){
  const els = $('pins').children;
  ZONES.forEach((z,i)=>{ const el = els[i]; if (!el) return;
    tmp.copy(z.pin).project(camera);
    const vis = tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1;
    el.style.display = vis && (!current || current===z.id) ? '' : 'none';
    el.style.left = ((tmp.x+1)/2*innerWidth)+'px'; el.style.top = ((1-tmp.y)/2*innerHeight)+'px';
  });
}

/* panels */
let current = null;
function openZone(id, fly=true){
  current = id; if (fly) flyZone(id);
  const z = ZONES.find(z=>z.id===id);
  const html = z.gate ? gatePanel(z.gate) : ({checkin:checkinPanel, ideas:ideasPanel, stage:stagePanel, stories:storiesPanel, board:boardPanel})[id]();
  $('panelBody').innerHTML = html; $('panel').hidden = false; $('panel').scrollTop = 0; setOffset();
  renderZones();
  if (z.gate && S.me && S.me.gate===id) stamp('gate');
  tickTimer();
}
function closePanel(){ $('panel').hidden = true; current = null; renderZones(); setOffset(); }
function setOffset(){
  const open = !$('panel').hidden && innerWidth > 760;
  if (open) camera.setViewOffset(innerWidth, innerHeight, Math.min(220, ($('panel').offsetWidth+14)/2), 0, innerWidth, innerHeight); else camera.clearViewOffset();
}
function passHTML(){ const g = gateById(S.me.gate);
  return `<div class="pass"><div class="hd"><span>ProjectINc · Boarding pass</span><span>${esc(S.me.code)}</span></div>
  <div class="bd"><div><div class="k">${t('passenger')}</div><div class="v">${esc(S.me.name)}</div></div>
  <div><div class="k">${t('gate')}</div><div class="v gate">${g.id}</div></div>
  <div><div class="k">${t('dest')}</div><div class="v">${g.city}</div></div></div>
  <div class="ft"><span>${flag(S.me.cc)} ${esc(cname(S.me.cc))} · ${S.me.s==='hanze'?t('hanze'):t('intl')}</span><span>${t('seat')}: ${team(g.id).length}</span></div></div>`; }
function checkinPanel(){
  return `<p class="kicker">${t('z_checkin')}</p><h2>${t('ck_h')}</h2><p class="lead">${t('ck_p')}</p>
  ${S.me ? `<p class="kicker" style="margin-top:14px">${t('ck_me')}</p>${passHTML()}
    <div class="row"><button class="btn" data-go="${S.me.gate}">${t('ck_go')} →</button><button class="btn alt" data-act="reset">${t('ck_reset')}</button></div>`
  : `<div class="card">${t('ck_none')}</div><button class="btn" data-act="onboard">${t('ck_start')}</button>`}`;
}
function ideasPanel(){
  const mine = S.ideas.find(i=>i.mine); const left = 3 - S.liked.length;
  return `<p class="kicker">${t('id_k')}</p><h2>${t('id_h')}</h2><p class="lead">${t('id_p')}</p>
  ${S.me ? `<div class="card"><textarea id="ideaTxt" maxlength="140" placeholder="${t('id_ph')}">${mine?esc(mine.text):''}</textarea>
     <div class="row" style="justify-content:space-between;margin-top:8px"><span class="count" id="ideaCount">${mine?mine.text.length:0}/140</span>
     <button class="btn" data-act="post">${mine?t('id_update'):t('id_post')}</button></div></div>`
   : `<div class="card">${t('id_need')} <button class="btn alt" data-act="onboard" style="margin-top:8px">${t('ck_start')}</button></div>`}
  <p class="muted" style="margin:6px 0 8px">${t('likes_left',{n:left})}</p>
  ${ranked().map((i,ix)=>{ const on = S.liked.includes(i.id); const own = !!i.mine;
    return `<div class="idea ${own?'mine':''} ${S.revealed&&ix===0?'win':''}"><div><div class="who">${flag(i.cc)} <b>${esc(i.n)}</b>${own?` · ${t('you')}`:''}</div><div class="txt">${esc(ideaText(i))}</div></div>
    <button class="like ${on?'on':''}" data-like="${i.id}" ${own||!S.me||(!on&&left<=0)?'disabled':''} aria-pressed="${on}"><span>♥</span><span>${i.likes}</span></button></div>`; }).join('')}`;
}
function gatePanel(g){
  const mine = S.me && S.me.gate===g.id; const tm = S.timer[g.id] || {};
  return `<p class="kicker">${t('g_k',{g:g.id,city:g.city})}</p><h2>${t('g_h')}</h2>
  ${S.me && !mine ? `<p class="lead">${t('g_other',{g:g.id,mine:S.me.gate})}</p>` : ''}
  <div class="team">${team(g.id).map(m=>`<span class="mate ${m.me?'me':''}">${flag(m.cc)} ${esc(m.n)} <span class="tag">${m.s==='hanze'?'Hanze':'intl'}</span></span>`).join('')}</div>
  <p class="kicker">${t('g_task')}</p>
  <ul class="steps">
    <li><span class="ic">👋</span><span><b>${t('t1')}</b><small>${t('t1s')}</small></span><span class="min">2′</span></li>
    <li><span class="ic">💬</span><span><b>${t('t2')}</b><small>${t('t2s')}</small></span><span class="min">5′</span></li>
    <li><span class="ic">💡</span><span><b>${t('t3')}</b><small>${t('t3s')}</small></span><span class="min">8′</span></li>
  </ul>
  <div class="card row" style="justify-content:space-between"><span class="timer" id="timer">15:00</span>
    <button class="btn alt" data-timer="${g.id}">${tm.endsAt?t('g_pause'):t('g_start')}</button></div>
  <div class="row" style="margin-bottom:6px"><a class="btn gold" href="https://meet.jit.si/ProjectINc-Gate-${g.id}-${g.city}" target="_blank" rel="noopener">🎥 ${t('g_call')}</a></div>
  <p class="muted">${t('g_call_note')}</p>
  ${mine ? (S.done[g.id] ? `<div class="card" style="background:var(--mint)">✈ ${t('g_isdone')}</div>` : `<button class="btn" data-act="done" data-g="${g.id}">✈ ${t('g_done')}</button>`) : ''}`;
}
function storiesPanel(){
  return `<p class="kicker">${t('st_k')}</p><h2>${t('st_h')}</h2>${STORIES.map(s=>`<div class="card"><div class="who muted">${flag(s.cc)} <b>${s.n}</b></div><p style="margin:6px 0 0">${s[S.lang]}</p></div>`).join('')}`;
}
function boardPanel(){
  return `<p class="kicker">${t('b_k')}</p><h2>${t('b_h')}</h2>
  <table class="board"><thead><tr><th>${t('b_dest')}</th><th>${t('b_gate')}</th><th>${t('b_team')}</th><th>${t('b_status')}</th></tr></thead><tbody>
  ${GATES.map(g=>{ const s = status(g.id); return `<tr data-go="${g.id}" style="cursor:pointer"><td>${flag(g.cc)} ${g.city}</td><td>${g.id}</td><td>${team(g.id).length}</td><td class="st-${s}">${t('stat_'+s)}</td></tr>`; }).join('')}
  </tbody></table>`;
}
function stagePanel(){
  const top = ranked()[0];
  return `<p class="kicker">${t('f_k')}</p><h2>${t('f_h')}</h2><p class="lead">${t('f_p')}</p>
  ${S.revealed ? `<div class="reveal"><div class="muted" style="color:#cbb9e6">${t('f_h')}</div><div class="big">${esc(top.n)}</div><p style="margin:8px 0 0">${flag(top.cc)} ${esc(ideaText(top))}</p><p style="margin:6px 0 0;color:var(--yellow);font-weight:700">♥ ${top.likes}</p></div>
    <button class="btn alt" data-act="final">${t('f_again')}</button>`
  : `<div class="card"><span class="muted">${t('f_lead')}:</span> ${flag(top.cc)} <b>${esc(top.n)}</b> · ♥ ${top.likes}</div><button class="btn gold" data-act="final">★ ${t('f_btn')}</button>`}`;
}

/* timer */
function tickTimer(){
  const el = $('timer'); if (!el || !current) return; const tm = S.timer[current]; let rem = 15*60;
  if (tm){ rem = tm.endsAt ? Math.max(0, Math.round((tm.endsAt - Date.now())/1000)) : tm.rem ?? rem; }
  el.textContent = `${String(Math.floor(rem/60)).padStart(2,'0')}:${String(rem%60).padStart(2,'0')}`;
}
setInterval(tickTimer, 1000);

/* onboarding */
let ob = {step:1, code:'', name:'', cc:'NL', s:null};
function openOnboard(){ ob = {step:1, code:'', name:'', cc:'PT', s:null}; renderOnboard(); $('onboard').hidden = false; }
function drawQR(c, seed){
  const ctx = c.getContext('2d'); const n = 25, s = c.width/n; ctx.fillStyle='#fff'; ctx.fillRect(0,0,c.width,c.height);
  let x = 0; for (const ch of seed) x = (x*31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => (x = (x*1664525 + 1013904223) >>> 0) / 4294967296;
  ctx.fillStyle = '#281048';
  for (let i=0;i<n;i++) for (let j=0;j<n;j++) if (rnd() > .52) ctx.fillRect(i*s, j*s, s, s);
  for (const [a,b] of [[0,0],[n-7,0],[0,n-7]]){ ctx.fillStyle='#fff'; ctx.fillRect((a-1)*s,(b-1)*s,9*s,9*s); ctx.fillStyle='#281048'; ctx.fillRect(a*s,b*s,7*s,7*s); ctx.fillStyle='#fff'; ctx.fillRect((a+1)*s,(b+1)*s,5*s,5*s); ctx.fillStyle='#281048'; ctx.fillRect((a+2)*s,(b+2)*s,3*s,3*s); }
}
function assignGate(cc, s){
  // mix: prefer gates where your group is the minority, away from your own country, and smallest teams
  let best = null, bestScore = 1e9;
  for (const g of GATES){
    const m = SEED_TEAMS[g.id]; const same = m.filter(x=>x.s===s).length, other = m.length - same;
    const score = m.length*2 + (same - other)*3 + (g.cc===cc ? 6 : 0) + (m.some(x=>x.cc===cc) ? 1 : 0);
    if (score < bestScore){ bestScore = score; best = g; }
  }
  return best.id;
}
function renderOnboard(){
  const prog = `<div class="progress">${[1,2,3].map(i=>`<i class="${i<=ob.step?'on':''}"></i>`).join('')}</div>`;
  let h = '';
  if (ob.step===1){
    h = `${prog}<p class="kicker">${t('ob1_k')}</p><h1>${t('ob1_h')}</h1>
    <div class="how"><div><span class="e">🎫</span>${t('how1')}</div><div><span class="e">🧳</span>${t('how2')}</div><div><span class="e">💡</span>${t('how3')}</div><div><span class="e">🏆</span>${t('how4')}</div></div>
    <div class="scan"><div class="qr"><canvas id="qr" width="125" height="125"></canvas></div><div><p style="margin:0 0 8px">${t('ob1_p')}</p></div></div>
    <label for="obCode">${t('code')}</label><input type="text" id="obCode" placeholder="INC-7Q2K" value="${esc(ob.code)}" autocomplete="off">
    <div class="err" id="obErr"></div>
    <div class="row" style="justify-content:space-between"><button class="btn alt" data-ob="demo">${t('demo')}</button><button class="btn" data-ob="next">${t('next')} →</button></div>`;
  } else if (ob.step===2){
    h = `${prog}<p class="kicker">${t('ob2_k')}</p><h1>${t('ob2_h')}</h1><p class="lead">${t('ob2_p')}</p>
    <label for="obName">${t('fname')}</label><input type="text" id="obName" maxlength="20" value="${esc(ob.name)}" autocomplete="given-name">
    <label for="obCc">${t('country')}</label><select id="obCc">${Object.keys(COUNTRIES).map(c=>`<option value="${c}" ${c===ob.cc?'selected':''}>${COUNTRIES[c][S.lang]}</option>`).join('')}</select>
    <label>${t('study')}</label><div class="seg"><button data-s="hanze" class="${ob.s==='hanze'?'on':''}">${t('hanze')}<small>${t('hanze_s')}</small></button><button data-s="intl" class="${ob.s==='intl'?'on':''}">${t('intl')}<small>${t('intl_s')}</small></button></div>
    <div class="err" id="obErr"></div>
    <div class="row" style="justify-content:space-between"><button class="btn alt" data-ob="back">← ${t('back')}</button><button class="btn" data-ob="next">${t('next')} →</button></div>`;
  } else {
    h = `${prog}<p class="kicker">${t('ob3_k')}</p><h1>${t('ob3_h',{g:S.me.gate})}</h1>${passHTML()}<div class="why">${t('why')}</div>
    <button class="btn gold" data-ob="enter">${t('enter')} →</button>`;
  }
  $('onboardBody').innerHTML = h;
  const q = $('qr'); if (q) drawQR(q, ob.code || 'INC-7Q2K');
  const f = $('obCode') || $('obName'); if (f) setTimeout(()=>f.focus({preventScroll:true}), 30);
}
function obNext(){
  const err = $('obErr');
  if (ob.step===1){ ob.code = $('obCode').value.trim().toUpperCase();
    if (!/^INC-?[A-Z0-9]{3,6}$/.test(ob.code)){ err.textContent = t('err_code'); return; }
    if (!ob.code.includes('-')) ob.code = 'INC-'+ob.code.slice(3);
    ob.step = 2; return renderOnboard(); }
  if (ob.step===2){ ob.name = $('obName').value.trim(); ob.cc = $('obCc').value;
    if (!ob.name){ err.textContent = t('err_name'); return; }
    if (!ob.s){ err.textContent = t('err_study'); return; }
    S.me = {code:ob.code, name:ob.name, cc:ob.cc, s:ob.s, gate:assignGate(ob.cc, ob.s)};
    save(); placeAvatars(); drawAll(); applyStatic(); renderPins();
    ob.step = 3; return renderOnboard(); }
}

/* confetti */
function confetti(){
  const c = $('confetti'), ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#f7d558','#f07148','#57368b','#d4e9e5','#ffffff'];
  const ps = Array.from({length:180}, ()=>({x:Math.random()*c.width, y:-20-Math.random()*c.height*.5, vx:(Math.random()-.5)*3, vy:2+Math.random()*4, r:Math.random()*6.28, w:6+Math.random()*6, c:cols[Math.random()*5|0]}));
  const t0 = performance.now();
  (function frame(now){ ctx.clearRect(0,0,c.width,c.height);
    for (const p of ps){ p.x+=p.vx; p.y+=p.vy; p.r+=.1; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c; ctx.fillRect(-p.w/2,-p.w/4,p.w,p.w/2); ctx.restore(); }
    if (now - t0 < 4200) requestAnimationFrame(frame); else ctx.clearRect(0,0,c.width,c.height); })(t0);
}

/* events */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-zone],[data-go],[data-act],[data-like],[data-timer],[data-ob],[data-s],[data-lang],[data-step],#btnPass,#panelClose');
  if (!el) return;
  if (el.id==='panelClose') return closePanel();
  if (el.id==='btnPass') return openZone('checkin');
  if (el.dataset.lang){ S.lang = el.dataset.lang; save(); applyStatic(); renderZones(); renderPins(); renderRoute(); drawAll(); if (current) openZone(current,false); if (!$('onboard').hidden) renderOnboard(); return; }
  if (el.dataset.zone) return openZone(el.dataset.zone);
  if (el.dataset.go) return openZone(el.dataset.go);
  if (el.dataset.step){ const k = el.dataset.step;
    if (k==='checkin') return S.me ? openZone('checkin') : openOnboard();
    if (k==='gate') return S.me ? openZone(S.me.gate) : openOnboard();
    if (k==='idea') return openZone('ideas');
    if (k==='final') return openZone('stage'); }
  if (el.dataset.s){ ob.s = el.dataset.s; ob.name = $('obName').value; ob.cc = $('obCc').value; return renderOnboard(); }
  if (el.dataset.ob){ const a = el.dataset.ob;
    if (a==='demo'){ ob.code = 'INC-7Q2K'; ob.step = 2; return renderOnboard(); }
    if (a==='next') return obNext();
    if (a==='back'){ ob.step = 1; return renderOnboard(); }
    if (a==='enter'){ $('onboard').hidden = true; stamp('checkin'); openZone(S.me.gate); return; } }
  if (el.dataset.like){ const id = el.dataset.like; const i = S.ideas.find(x=>x.id===id); const on = S.liked.includes(id);
    if (on){ S.liked = S.liked.filter(x=>x!==id); i.likes--; } else if (S.liked.length < 3){ S.liked.push(id); i.likes++; }
    save(); drawAll(); return openZone('ideas', false); }
  if (el.dataset.timer){ const id = el.dataset.timer; const tm = S.timer[id] || {rem:900};
    if (tm.endsAt){ tm.rem = Math.max(0, Math.round((tm.endsAt-Date.now())/1000)); tm.endsAt = null; } else tm.endsAt = Date.now() + (tm.rem ?? 900)*1000;
    S.timer[id] = tm; save(); return openZone(id, false); }
  const a = el.dataset.act;
  if (a==='onboard') return openOnboard();
  if (a==='reset'){ const lang = S.lang; S = fresh(); S.lang = lang; save(); placeAvatars(); drawAll(); applyStatic(); renderPins(); renderRoute(); closePanel(); flyTo(HOME.pos, HOME.tgt); return openOnboard(); }
  if (a==='post'){ const txt = $('ideaTxt').value.trim(); if (txt.length < 5) return $('ideaTxt').focus();
    let mine = S.ideas.find(i=>i.mine);
    if (mine) mine.text = txt; else S.ideas.push({id:'me', n:S.me.name, cc:S.me.cc, likes:0, text:txt, mine:true});
    save(); drawAll(); toast(t('toast_posted')); stamp('idea'); return openZone('ideas', false); }
  if (a==='done'){ S.done[el.dataset.g] = true; stamp('gate'); save(); drawAll(); renderPins(); return openZone(el.dataset.g, false); }
  if (a==='final'){ S.revealed = true; stamp('final'); save(); drawAll(); confetti(); return openZone('stage', false); }
});
document.addEventListener('input', e => { if (e.target.id==='ideaTxt') $('ideaCount').textContent = `${e.target.value.length}/140`; });
document.addEventListener('keydown', e => {
  if (e.key==='Escape' && !$('panel').hidden) closePanel();
  if (e.key==='Enter' && !$('onboard').hidden && e.target.tagName==='INPUT') obNext();
});

/* click on 3D objects */
const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2(); let down = null;
renderer.domElement.addEventListener('pointerdown', e => down = [e.clientX, e.clientY]);
renderer.domElement.addEventListener('pointerup', e => {
  if (!down || Math.hypot(e.clientX-down[0], e.clientY-down[1]) > 6) return;
  ptr.set(e.clientX/innerWidth*2-1, -(e.clientY/innerHeight)*2+1); ray.setFromCamera(ptr, camera);
  const hit = ray.intersectObjects(hitboxes)[0]; if (hit) openZone(hit.object.userData.zone);
});
addEventListener('resize', () => { camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); setOffset(); });
window.__dbg = {camera, controls, flyTo, THREE};

/* loop */
const ease = x => x<.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2;
function loop(now){
  requestAnimationFrame(loop);
  if (fly){ const k = Math.min(1, (now-fly.t0)/fly.ms), e = ease(k);
    camera.position.lerpVectors(fly.p0, fly.p1, e); controls.target.lerpVectors(fly.q0, fly.q1, e); if (k>=1) fly = null; }
  if (meMarker && meMarker.userData.arrow) meMarker.userData.arrow.position.y = 1.85 + Math.sin(now/300)*0.08;
  controls.update(); renderer.render(scene, camera); updatePins();
}

/* boot */
(async function(){
  try {
    await loadModel();
  } catch(err){ console.error(err); }
  if (innerWidth < 760){ HOME.pos.set(0, 20, 34); camera.position.copy(HOME.pos); }
  buildZones(); placeAvatars();
  logoImg = new Image(); logoImg.onload = drawAll; logoImg.src = 'logo.png';
  applyStatic(); renderZones(); renderPins(); renderRoute(); drawAll();
  try { await document.fonts.ready; drawAll(); } catch(e){}
  requestAnimationFrame(loop);
  $('loading').style.opacity = 0; setTimeout(()=>$('loading').remove(), 450);
  if (!S.me) openOnboard();
})();
