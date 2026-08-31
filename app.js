const $=x=>document.getElementById(x);
const MAX=300;
const C={
front:[['弹簧刚度 N','fs',0,300,1,80],['预载','fp',0,300,.5,5],['LSC 低速压缩','flsc',0,300,1,10],['HSC 高速压缩','fhsc',0,300,.5,12],['LSR 低速回弹','flsr',0,300,1,10],['HSR 高速回弹','fhsr',0,300,.5,10],['K1 初段调节值','fk1',0,300,1,6],['K2 中后段调节值','fk2',0,300,1,8]],
rear:[['弹簧刚度 N','rs',0,300,1,150],['预载','rp',0,300,.5,15],['LSC 低速压缩','rlsc',0,300,1,11],['HSC 高速压缩','rhsc',0,300,.5,15],['LSR 低速回弹','rlsr',0,300,1,14],['HSR 高速回弹','rhsr',0,300,.5,10],['K1 初段调节值','rk1',0,300,1,6],['K2 中后段调节值','rk2',0,300,1,8]]
};
function build(g){$(g+'Controls').innerHTML=C[g].map(a=>`<div><label>${a[0]}<output id="${a[1]}o">${a[5]}</output></label><input id="${a[1]}" type="range" min="${a[2]}" max="${a[3]}" step="${a[4]}" value="${a[5]}"></div>`).join('')}
build('front');build('rear');

const M={trail:['Ninebot Enduro',200,260,26,108,'80/100-21','110/100-18'],scooter:['Ninebot Scooter',120,110,25,92,'120/70-12','130/70-12'],street:['Ninebot Performance',150,145,24.5,102,'110/70-17','150/60-17']};
function bike(m){let s='';if(m==='scooter')s='<circle class="wheel" cx="200" cy="275" r="60"/><circle class="wheel" cx="690" cy="275" r="60"/><path class="frame" d="M200 275L360 215L570 215L690 275M360 215L430 75L520 75M520 75L680 150L720 220"/><rect class="battery" x="390" y="160" width="210" height="55" rx="8"/><path class="hot" data-p="front" d="M410 105L250 250"/><path class="hot" data-p="rear" d="M600 180L650 250"/>';else if(m==='street')s='<circle class="wheel" cx="200" cy="280" r="70"/><circle class="wheel" cx="710" cy="280" r="70"/><path class="frame" d="M200 280L380 160L570 220L710 280M380 160L500 85L650 170"/><rect class="battery" x="470" y="145" width="150" height="75" rx="8"/><path class="hot" data-p="front" d="M390 125L230 260"/><path class="hot" data-p="rear" d="M590 175L650 260"/>';else s='<circle class="wheel" cx="190" cy="280" r="78"/><circle class="wheel" cx="700" cy="280" r="78"/><path class="frame" d="M190 280L360 145L550 210L700 280M360 145L480 85L610 180"/><rect class="battery" x="470" y="135" width="150" height="75" rx="8"/><path class="hot" data-p="front" d="M350 130L215 265"/><path class="hot" data-p="rear" d="M550 170L630 265"/>';
$('bike').innerHTML=s;$('hot').innerHTML='<circle class="dot" data-p="front" cx="310" cy="190" r="12"/><circle class="dot" data-p="rear" cx="620" cy="205" r="12"/>';document.querySelectorAll('[data-p]').forEach(x=>x.onclick=()=>go(x.dataset.p))}
function go(p){document.querySelectorAll('.page,nav button').forEach(x=>x.classList.remove('active'));$(p).classList.add('active');document.querySelector(`[data-p="${p}"]`)?.classList.add('active')}
document.querySelectorAll('nav button').forEach(x=>x.onclick=()=>go(x.dataset.p));

function model(m){let d=M[m];$('title').textContent=d[0];$('name').value=d[0];$('model').value=m;$('frontTravel').value=d[1];$('rearTravel').value=d[2];$('headAngle').value=d[3];$('trail').value=d[4];$('frontTire').value=d[5];$('rearTire').value=d[6];bike(m);calc()}
document.querySelectorAll('[data-model]').forEach(x=>x.onclick=()=>model(x.dataset.model));$('model').onchange=e=>model(e.target.value);
function n(id){let x=$(id);return x?(+x.value||0):0}
function clamp(v){return Math.max(0,Math.min(MAX,v))}
function calc(){
 C.front.concat(C.rear).forEach(a=>{if($(a[1]))$(a[1]+'o').textContent=$(a[1]).value});
 let fsag=(n('fl0')-n('fl2'))/Math.max(1,n('frontTravel'))*100;
 let rsag=(n('rl0')-n('rl2'))/Math.max(1,n('rearTravel'))*100;
 let t=n('trail'),ang=n('headAngle'),score=Math.max(0,Math.min(100,100-Math.abs(fsag-rsag)*5-Math.abs(t-105)*.15));
 $('fresult').textContent=`Rider SAG: ${fsag.toFixed(1)}%`;
 $('rresult').textContent=`Rider SAG: ${rsag.toFixed(1)}%`;
 $('score').textContent=Math.round(score);
 $('status').textContent=Math.abs(fsag-rsag)<5?'平衡良好':'前后平衡偏差';
 $('advice').textContent=`前后 SAG ${fsag.toFixed(1)}% / ${rsag.toFixed(1)}%，前叉倾角 ${ang.toFixed(1)}°，拖曳距 ${t} mm。`;
 $('dfpre').textContent=n('fp').toFixed(1);$('dflsc').textContent=n('flsc');$('dfk1').textContent=n('fk1');$('dfk2').textContent=n('fk2');
 $('drpre').textContent=n('rp').toFixed(1);$('drlsc').textContent=n('rlsc');$('dk1').textContent=n('rk1');$('dk2').textContent=n('rk2');
 $('dangle').textContent=ang.toFixed(1)+'°';$('dtrail').textContent=t+' mm';
 $('ga').textContent=ang.toFixed(1)+'°';$('gt').textContent=t+' mm';$('gw').textContent=n('wheelbase')+' mm';$('gtires').textContent=$('frontTire').value+' / '+$('rearTire').value;
}
document.addEventListener('input',e=>{if(e.target.matches('input,select'))calc()});

function recommend(){
 const bikeW=n('bikeWeight'), rider=n('riderWeight'), total=bikeW+rider;
 let fb=n('frontBias'), rb=n('rearBias'), sum=fb+rb||100; fb=fb/sum; rb=rb/sum;
 const fTravel=n('frontTravel'), rTravel=n('rearTravel');
 const fSagPct=n('targetFSag')/100, rSagPct=n('targetRSag')/100;
 const fLev=Math.max(.1,n('frontLeverage')), rLev=Math.max(.1,n('rearLeverage'));
 const fSag=Math.max(1,fTravel*fSagPct), rSag=Math.max(1,rTravel*rSagPct);
 const g=9.80665;
 // Approximate wheel-force spring estimate. Rear is transformed by leverage ratio.
 const fRaw=(total*g*fb)/fSag;
 const rRaw=((total*g*rb)/rSag)/(rLev*rLev);
 const fs=clamp(Math.round(fRaw)), rs=clamp(Math.round(rRaw));
 const fPre=clamp(Math.round(Math.max(0,(n('targetFSag')-30)*1.2 + total*fb/25)));
 const rPre=clamp(Math.round(Math.max(0,(n('targetRSag')-32)*1.2 + total*rb/20)));
 $('recFSpring').textContent=fs;$('recRSpring').textContent=rs;
 $('recFPreload').textContent=fPre;$('recRPreload').textContent=rPre;
 const capped=(fRaw>MAX||rRaw>MAX);
 $('calcReport').innerHTML=`<b>计算基础：</b>整车 ${bikeW.toFixed(1)} kg + 骑手 ${rider.toFixed(1)} kg = ${total.toFixed(1)} kg；前/后重量分配 ${(fb*100).toFixed(1)}% / ${(rb*100).toFixed(1)}%；目标 SAG ${n('targetFSag').toFixed(1)}% / ${n('targetRSag').toFixed(1)}%。<br><br><b>推荐：</b>前弹簧 ${fs} N、后弹簧 ${rs} N；前预载 ${fPre}、后预载 ${rPre}。${capped?'<br><br>⚠ 原始计算结果超过 300，已按“所有调节项上限 300”自动限制。':''}<br><br><small>提示：这是基于静态载荷、目标 SAG 与杠杆比的工程估算，用于初始 Setup。实际弹簧选择仍应结合实际测得的静态 SAG、骑行 SAG、减震器运动比与弹簧单位规格进行验证。</small>`;
}
$('autoCalc').onclick=recommend;
$('applyCalc').onclick=()=>{recommend();$('fs').value=$('recFSpring').textContent;$('rs').value=$('recRSpring').textContent;$('fp').value=$('recFPreload').textContent;$('rp').value=$('recRPreload').textContent;calc();go('front');alert('推荐前后弹簧刚度与预载已应用。')};

$('save').onclick=()=>{let d={};document.querySelectorAll('input,select').forEach(x=>d[x.id]=x.value);localStorage.setItem('nsp43',JSON.stringify(d));alert('已保存，本机离线可恢复。')};
function hist(){return JSON.parse(localStorage.getItem('nsp43h')||'[]')}
function chart(id,arr){let c=$(id),ctx=c.getContext('2d'),W=c.clientWidth,H=c.clientHeight;c.width=W*devicePixelRatio;c.height=H*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio);ctx.clearRect(0,0,W,H);ctx.strokeStyle='#caff00';ctx.lineWidth=2;if(!arr.length){ctx.fillStyle='#899391';ctx.fillText('暂无记录',20,H/2);return}let min=Math.min(...arr),max=Math.max(...arr),r=max-min||1;ctx.beginPath();arr.forEach((v,i)=>{let x=arr.length===1?W/2:i*(W-20)/(arr.length-1)+10,y=H-15-(v-min)/r*(H-35);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()}
function render(){let h=hist();chart('chart1',h.map(x=>x.fp));chart('chart2',h.map(x=>x.rp));chart('chart3',h.map(x=>x.score));$('list').innerHTML=h.slice().reverse().map(x=>`<div class="item">${x.time} · 前弹簧 ${x.fs}N / K1/K2 ${x.fk1}/${x.fk2} · 后弹簧 ${x.rs}N / K1/K2 ${x.rk1}/${x.rk2} · 前叉倾角 ${x.angle}° · Trail ${x.trail} mm · Score ${x.score}</div>`).join('')}
$('record').onclick=()=>{let h=hist();h.push({time:new Date().toLocaleString('zh-CN'),fp:n('fp'),rp:n('rp'),fs:n('fs'),rs:n('rs'),fk1:n('fk1'),fk2:n('fk2'),rk1:n('rk1'),rk2:n('rk2'),angle:n('headAngle'),trail:n('trail'),score:+$('score').textContent});localStorage.setItem('nsp43h',JSON.stringify(h.slice(-100)));render()};
$('clear').onclick=()=>{localStorage.removeItem('nsp43h');render()};
function net(){let x=$('net');x.textContent=navigator.onLine?'● 在线':'● 离线模式'}window.ononline=net;window.onoffline=net;
let saved=JSON.parse(localStorage.getItem('nsp43')||'{}');Object.entries(saved).forEach(([k,v])=>{$(k)&&($(k).value=v)});
net();model($('model').value||'trail');calc();recommend();render();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js');