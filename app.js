const $=id=>document.getElementById(id);
const cfg={
front:[['弹簧刚度 N','fspring',0,300,1,80],['预载 Turns','fpre',0,25,.25,5],['低速压缩 LSC Click','flsc',0,50,1,10],['高速压缩 HSC Turn','fhsc',0,8,.05,1.25],['低速回弹 LSR Click','freb',0,50,1,10],['高速回弹 HSR Turn','fhsr',0,8,.05,1]],
rear:[['弹簧刚度 N','rspring',0,300,1,150],['预载 mm','rpre',0,60,.5,15],['K1 初段特性','k1',0,20,1,6],['K2 中后段特性','k2',0,20,1,8],['低速压缩 LSC Click','rlsc',0,50,1,11],['高速压缩 HSC Turn','rhsc',0,8,.05,1.5],['低速回弹 LSR Click','rreb',0,60,1,14],['高速回弹 HSR Turn','rhsr',0,8,.05,1]]
};
const models={
trail:{title:'Ninebot Enduro',sub:'Electric Enduro / Off-road',front:200,rear:260,trail:108,angle:26.0,ft:'80/100-21',rt:'110/100-18'},
scooter:{title:'Ninebot Scooter Performance',sub:'Performance Electric Scooter',front:120,rear:110,trail:92,angle:25.0,ft:'120/70-12',rt:'130/70-12'},
street:{title:'Ninebot Performance Street',sub:'Performance Electric Two-Wheeler',front:150,rear:145,trail:102,angle:24.5,ft:'110/70-17',rt:'150/60-17'}
};
function controls(group){$(group+'Controls').innerHTML=cfg[group].map(x=>`<div class="control"><label>${x[0]} <output id="${x[1]}o">${x[5]}</output></label><input id="${x[1]}" type="range" min="${x[2]}" max="${x[3]}" step="${x[4]}" value="${x[5]}"></div>`).join('')}
controls('front');controls('rear');

function drawBike(type){
 const bike=$('bike'),hot=$('hotspots');
 let g='';
 if(type==='trail')g=`<circle class="wheel" cx="220" cy="292" r="82"/><circle class="wheel" cx="700" cy="292" r="82"/><path class="frame" d="M220 292 L365 165 L545 220 L700 292 M365 165 L490 115 L610 195"/><path class="body" d="M335 170 L270 80 L415 75 M610 195 L690 115 L790 145"/><path class="battery" d="M470 145 L575 135 L625 205 L520 220 Z"/><path class="hot" data-open="front" data-focus="fpre" d="M350 145 L245 274"/><path class="hot" data-open="rear" data-focus="rpre" d="M550 185 L625 270"/>`;
 if(type==='scooter')g=`<circle class="wheel" cx="245" cy="300" r="65"/><circle class="wheel" cx="710" cy="300" r="65"/><path class="frame" d="M245 300 L360 245 L580 245 L710 300"/><path class="body" d="M355 245 L405 100 L500 105 M500 105 L650 150 L710 235"/><path class="battery" d="M385 190 L590 190 L610 245 L360 245 Z"/><path class="hot" data-open="front" data-focus="flsc" d="M385 130 L285 280"/><path class="hot" data-open="rear" data-focus="rpre" d="M590 205 L650 278"/>`;
 if(type==='street')g=`<circle class="wheel" cx="220" cy="300" r="72"/><circle class="wheel" cx="720" cy="300" r="72"/><path class="frame" d="M220 300 L390 180 L570 235 L720 300 M390 180 L500 120 L650 190"/><path class="body" d="M330 185 L395 80 L530 95 M530 95 L700 145 L760 210"/><path class="battery" d="M470 155 L610 150 L645 215 L540 230 Z"/><path class="hot" data-open="front" data-focus="fhsc" d="M390 135 L250 282"/><path class="hot" data-open="rear" data-focus="rreb" d="M585 185 L650 280"/>`;
 bike.innerHTML=g;
 hot.innerHTML=`<circle class="hotCircle" data-open="front" data-focus="fpre" cx="310" cy="205" r="13"/><text class="hotspotLabel" x="275" y="185">PRELOAD</text>
 <circle class="hotCircle" data-open="front" data-focus="flsc" cx="275" cy="255" r="12"/><text class="hotspotLabel" x="230" y="280">LSC</text>
 <circle class="hotCircle" data-open="rear" data-focus="rpre" cx="620" cy="220" r="13"/><text class="hotspotLabel" x="590" y="195">PRELOAD</text>
 <circle class="hotCircle" data-open="rear" data-focus="rreb" cx="655" cy="255" r="12"/><text class="hotspotLabel" x="675" y="280">REB</text>`;
 document.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>openPage(el.dataset.open,el.dataset.focus));
}
function openPage(page,focus){
 document.querySelectorAll('#nav button,.page').forEach(x=>x.classList.remove('active'));
 document.querySelector(`#nav button[data-page="${page}"]`).classList.add('active');$(page).classList.add('active');
 if(focus){setTimeout(()=>$(focus)?.scrollIntoView({behavior:'smooth',block:'center'}),100)}
}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>openPage(b.dataset.page));
document.querySelectorAll('.modelSwitch button').forEach(b=>b.onclick=()=>selectModel(b.dataset.model));
$('vehicleModel').onchange=e=>selectModel(e.target.value);
function selectModel(m){
 const d=models[m];$('vehicleModel').value=m;$('modelTitle').textContent=d.title;$('modelSub').textContent=d.sub;
 $('frontTravel').value=d.front;$('rearTravel').value=d.rear;$('trail').value=d.trail;$('headAngle').value=d.angle;$('frontTire').value=d.ft;$('rearTire').value=d.rt;
 drawBike(m);update();
}

function val(id){return parseFloat($(id).value)||0}
function update(){
 cfg.front.concat(cfg.rear).forEach(x=>{if($(x[1]))$(x[1]+'o').textContent=$(x[1]).value});
 $('dashFPre').textContent=val('fpre').toFixed(2);$('dashFLSC').textContent=val('flsc');$('dashFHSC').textContent=val('fhsc').toFixed(2);$('dashFREB').textContent=val('freb');
 $('dashRPre').textContent=val('rpre').toFixed(1);$('dashK1').textContent=val('k1');$('dashK2').textContent=val('k2');$('dashRREB').textContent=val('rreb');
 const ft=Math.max(1,val('frontTravel')),rt=Math.max(1,val('rearTravel'));
 const fFree=val('fl0')-val('fl1'), fRide=val('fl0')-val('fl2');
 const rFree=val('rl0')-val('rl1'), rRide=val('rl0')-val('rl2');
 const fp=fRide/ft*100,rp=rRide/rt*100, trail=val('trail');
 $('frontResult').textContent=`Free SAG：${fFree.toFixed(1)} mm\nRider SAG：${fRide.toFixed(1)} mm\nRider SAG：${fp.toFixed(1)}%`;
 $('rearResult').textContent=`Free SAG：${rFree.toFixed(1)} mm\nRider SAG：${rRide.toFixed(1)} mm\nRider SAG：${rp.toFixed(1)}%`;
 $('qFrontSag').textContent=fp.toFixed(1)+'%';$('qRearSag').textContent=rp.toFixed(1)+'%';$('qTrail').textContent=trail+' mm';
 $('liveF').textContent=fp.toFixed(1)+'%';$('liveR').textContent=rp.toFixed(1)+'%';$('liveT').textContent=trail+' mm';
 $('barF').style.width=Math.min(100,fp*2.2)+'%';$('barR').style.width=Math.min(100,rp*2.2)+'%';$('barT').style.width=Math.min(100,trail/1.5)+'%';
 const score=Math.max(0,Math.min(100,100-Math.abs(fp-rp)*5-Math.abs(trail-105)*0.12));
 $('score').textContent=Math.round(score);$('qBalance').textContent=Math.round(score);
 let st='平衡良好',adv='前后悬挂基础平衡处于可调校范围。';
 if(Math.abs(fp-rp)>5){st='前后平衡偏差';adv=fp>rp?'前部下沉偏多，可检查前叉弹簧与预载。':'后部下沉偏多，可检查后弹簧与预载。'}
 if(trail<85){adv+=' 拖曳距较短，转向会更灵敏。'} else if(trail>125){adv+=' 拖曳距较大，直线稳定性更强但转向更慢。'}
 $('scoreStatus').textContent=st;$('scoreAdvice').textContent=adv;$('liveAdvice').textContent=adv;
 $('geoWheelbase').textContent=val('wheelbase')+' mm';$('geoAngle').textContent=val('headAngle').toFixed(1)+'°';$('geoTrail').textContent=trail+' mm';$('geoTires').textContent=$('frontTire').value+' / '+$('rearTire').value;
 const x=Math.max(6,Math.min(94,50+(rp-fp)*4)),y=Math.max(6,Math.min(94,50+(105-trail)*.7));
 $('matrixDot').style.left=`calc(${x}% - 8px)`;$('matrixDot').style.top=`calc(${y}% - 8px)`;
 $('matrixText').textContent=`SAG 差值 ${Math.abs(fp-rp).toFixed(1)}%，当前拖曳距 ${trail} mm。`;
}
document.addEventListener('input',e=>{if(e.target.matches('input,select'))update()});

function getState(){
 const d={};document.querySelectorAll('input,select').forEach(e=>d[e.id]=e.value);return d;
}
function save(){localStorage.setItem('nsp42_state',JSON.stringify(getState()));}
function load(){const s=localStorage.getItem('nsp42_state');if(s)Object.entries(JSON.parse(s)).forEach(([k,v])=>{if($(k))$(k).value=v})}
$('saveBtn').onclick=()=>{save();alert('当前 Setup 已保存到本机，可离线恢复。')};

function history(){return JSON.parse(localStorage.getItem('nsp42_history')||'[]')}
function drawChart(id,series,labels){
 const c=$(id),ctx=c.getContext('2d'),w=c.width=c.clientWidth*devicePixelRatio,h=c.height=c.clientHeight*devicePixelRatio;
 ctx.scale(devicePixelRatio,devicePixelRatio);const W=c.clientWidth,H=c.clientHeight;ctx.clearRect(0,0,W,H);
 ctx.strokeStyle='#293233';ctx.lineWidth=1;for(let i=1;i<5;i++){let y=i*H/5;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 const all=series.flatMap(s=>s.values);if(!all.length){ctx.fillStyle='#899391';ctx.font='13px sans-serif';ctx.fillText('暂无记录，点击“记录 Setup”生成趋势数据。',20,H/2);return}
 const min=Math.min(...all),max=Math.max(...all),range=max-min||1;
 series.forEach((s,si)=>{ctx.strokeStyle=si===0?'#caff00':si===1?'#7ea5ff':'#ffcc66';ctx.lineWidth=2;ctx.beginPath();s.values.forEach((v,i)=>{let x=s.values.length===1?W/2:i*(W-20)/(s.values.length-1)+10;let y=H-20-(v-min)/(range)*Math.max(20,H-45);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.stroke()});
 ctx.fillStyle='#899391';ctx.font='10px sans-serif';ctx.fillText('min '+min.toFixed(1),10,H-5);ctx.fillText('max '+max.toFixed(1),W-70,H-5);
}
function renderHistory(){
 const h=history(), last=h.slice(-30);
 drawChart('preloadChart',[{values:last.map(x=>x.fpre)},{values:last.map(x=>x.rpre)}]);
 drawChart('sagChart',[{values:last.map(x=>x.fp)},{values:last.map(x=>x.rp)}]);
 drawChart('compressionChart',[{values:last.map(x=>x.flsc)},{values:last.map(x=>x.rlsc)}]);
 drawChart('scoreChart',[{values:last.map(x=>x.score)}]);
 $('historyList').innerHTML=last.slice().reverse().map((x,i)=>`<div class="historyItem"><b>#${h.length-i}</b> · ${x.time} · 前预载 ${x.fpre} / 后预载 ${x.rpre} · SAG ${x.fp}% / ${x.rp}% · Trail ${x.trail} mm · Score ${x.score}</div>`).join('')||'<div class="historyItem">暂无记录。</div>';
}
$('snapshotBtn').onclick=()=>{
 const h=history();const ft=Math.max(1,val('frontTravel')),rt=Math.max(1,val('rearTravel'));
 const fp=(val('fl0')-val('fl2'))/ft*100,rp=(val('rl0')-val('rl2'))/rt*100;
 h.push({time:new Date().toLocaleString('zh-CN'),fpre:val('fpre'),rpre:val('rpre'),flsc:val('flsc'),rlsc:val('rlsc'),fp:+fp.toFixed(1),rp:+rp.toFixed(1),trail:val('trail'),score:val('score')||parseFloat($('score').textContent)});
 localStorage.setItem('nsp42_history',JSON.stringify(h.slice(-100)));renderHistory();alert('Setup 已记录。');
};
$('clearBtn').onclick=()=>{if(confirm('确定清空全部调校历史？')){localStorage.removeItem('nsp42_history');renderHistory()}};

function network(){const b=$('networkBadge');if(navigator.onLine){b.textContent='● 在线';b.className='network online'}else{b.textContent='● 离线模式';b.className='network offline'}}
window.addEventListener('online',network);window.addEventListener('offline',network);

load();network();selectModel($('vehicleModel').value||'trail');update();renderHistory();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));