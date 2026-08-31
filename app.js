const $ = id => document.getElementById(id);
const fields = [
  'vehicleName','vehicleType','bikeWeight','riderWeight','gearWeight','batteryWeight','frontWeight','rearWeight','frontTravel','rearTravel','rideMode','terrain',
  'frontSpring','frontPreload','frontLSC','frontHSC','frontRebound','frontHSR',
  'rearSpring','rearPreload','k1','k2','rearLSC','rearHSC','rearRebound','rearHSR',
  'frontL0','frontL1','frontL2','rearL0','rearL1','rearL2'
];

function v(id){ return $(id).value; }
function n(id){ return Number(v(id)) || 0; }
function clamp(x,a,b){ return Math.max(a,Math.min(b,x)); }

function updateOutputs(){
  const pairs = [
    ['frontSpring','frontSpringOut'],['frontPreload','frontPreloadOut'],['frontLSC','frontLSCOut'],
    ['frontHSC','frontHSCOut'],['frontRebound','frontReboundOut'],['frontHSR','frontHSROut'],
    ['rearSpring','rearSpringOut'],['rearPreload','rearPreloadOut'],['k1','k1Out'],['k2','k2Out'],
    ['rearLSC','rearLSCOut'],['rearHSC','rearHSCOut'],['rearRebound','rearReboundOut'],['rearHSR','rearHSROut']
  ];
  pairs.forEach(([a,b]) => {
    let value = n(a);
    $(b).textContent = ['frontHSC','frontHSR','rearHSC','rearHSR'].includes(a) ? value.toFixed(2) : value;
  });
}

function calcSag(){
  const frontFree = Math.max(0,n('frontL0')-n('frontL1'));
  const frontRider = Math.max(0,n('frontL0')-n('frontL2'));
  const rearFree = Math.max(0,n('rearL0')-n('rearL1'));
  const rearRider = Math.max(0,n('rearL0')-n('rearL2'));
  const fp = n('frontTravel') ? frontRider/n('frontTravel')*100 : 0;
  const rp = n('rearTravel') ? rearRider/n('rearTravel')*100 : 0;

  $('frontFreeSag').textContent = frontFree.toFixed(0)+' mm';
  $('frontRiderSag').textContent = frontRider.toFixed(0)+' mm';
  $('frontRatio').textContent = fp.toFixed(1)+'%';
  $('rearFreeSag').textContent = rearFree.toFixed(0)+' mm';
  $('rearRiderSag').textContent = rearRider.toFixed(0)+' mm';
  $('rearRatio').textContent = rp.toFixed(1)+'%';

  $('dashFrontSag').textContent = frontRider.toFixed(0)+' mm';
  $('dashRearSag').textContent = rearRider.toFixed(0)+' mm';
  $('frontSagPercent').textContent = fp.toFixed(1)+'%';
  $('rearSagPercent').textContent = rp.toFixed(1)+'%';
  $('frontSagBar').style.width = clamp(fp,0,100)+'%';
  $('rearSagBar').style.width = clamp(rp,0,100)+'%';

  const diff = fp-rp;
  const score = clamp(100-Math.abs(diff)*5-Math.abs(fp-33)*1.2-Math.abs(rp-30)*1.2,0,100);
  $('balanceScore').textContent = score.toFixed(0);
  if(Math.abs(diff)<=3){
    $('balanceStatus').textContent='前后平衡良好';
    $('balanceAdvice').textContent='前后 SAG 比例处于较均衡状态，可继续根据路况微调阻尼。';
  }else if(diff>3){
    $('balanceStatus').textContent='前部下沉偏多';
    $('balanceAdvice').textContent='前部 SAG 明显大于后部。可检查前叉预载或弹簧支撑，并结合实际转向反馈调整。';
  }else{
    $('balanceStatus').textContent='后部下沉偏多';
    $('balanceAdvice').textContent='后部 SAG 明显大于前部。可检查后减震预载和弹簧支撑，再进行阻尼微调。';
  }
}

function updateDashboard(){
  $('dashFrontPreload').textContent=n('frontPreload').toFixed(1)+' Turns';
  $('dashFrontLSC').textContent=n('frontLSC')+' Click';
  $('dashFrontHSC').textContent=n('frontHSC').toFixed(2)+' Turn';
  $('dashFrontRebound').textContent=n('frontRebound')+' Click';
  $('dashRearPreload').textContent=n('rearPreload')+' mm';
  $('dashK1').textContent=n('k1');
  $('dashK2').textContent=n('k2');
  $('dashRearLSC').textContent=n('rearLSC')+' Click';
  $('dashRearRebound').textContent=n('rearRebound')+' Click';
  $('setupName').textContent=v('vehicleName') || '我的专业减震设定';
  $('setupMeta').textContent=(v('vehicleName')||'Ninebot / 自定义车型')+' · '+v('rideMode');
}

function refresh(){
  updateOutputs(); calcSag(); updateDashboard();
  localStorage.setItem('ninebotSuspensionProCurrent',JSON.stringify(getData()));
}

function getData(){
  const data={};
  fields.forEach(id=>data[id]=v(id));
  return data;
}
function setData(data){
  fields.forEach(id=>{ if(data[id]!==undefined) $(id).value=data[id]; });
  refresh();
}

function diagnose(){
  const selected=[...document.querySelectorAll('#symptomGrid input:checked')].map(x=>x.value);
  if(!selected.length){ $('diagnosisResult').textContent='请选择一个或多个症状。'; return; }
  const map={
    frontBottom:'前叉容易到底：优先增加前叉支撑。建议先小幅增加预载，并增加低速/高速压缩阻尼。',
    brakeDive:'刹车点头严重：可小幅增加前叉预载与低速压缩阻尼；一次只调整一个方向。',
    frontHard:'前叉小颠簸太硬：优先减少低速压缩阻尼，并检查弹簧刚度、轮胎压力与摩擦阻力。',
    frontGrip:'前轮抓地不足：检查 SAG 平衡；可尝试减少过强压缩阻尼或微调回弹。',
    rearSquat:'加速后部下沉：可增加后预载，并根据反馈适度增加低速压缩支撑。',
    rearBottom:'后减震容易到底：检查 Rider SAG；必要时增加预载、弹簧刚度或高速压缩支撑。',
    rearKick:'后轮弹跳：优先检查回弹阻尼是否过强或过弱，建议小步调整并测试。',
    rearGrip:'后轮抓地不足：检查回弹恢复速度与压缩阻尼，避免悬挂在连续颠簸中“打包”。',
    push:'转弯推头：检查前后 SAG 比例、前叉支撑和轮胎状态，再进行阻尼微调。',
    unstable:'高速不稳定：检查前后 SAG、轮胎、轴承和车架状态；确认机械安全后再微调阻尼。'
  };
  $('diagnosisResult').textContent='专业调教建议：\n\n'+selected.map(x=>'• '+map[x]).join('\n\n')+
    '\n\n原则：每次只做小幅调整，并记录调整前后表现。';
  $('smartRecommendation').textContent=selected.slice(0,3).map(x=>map[x]).join(' ');
}

function snapshot(){
  const history=JSON.parse(localStorage.getItem('ninebotSuspensionProHistory')||'[]');
  const item={date:new Date().toLocaleString('zh-CN'),data:getData()};
  history.unshift(item);
  localStorage.setItem('ninebotSuspensionProHistory',JSON.stringify(history.slice(0,50)));
  renderHistory();
}

function renderHistory(){
  const history=JSON.parse(localStorage.getItem('ninebotSuspensionProHistory')||'[]');
  $('historyList').innerHTML=history.length ? history.map((h,i)=>`
    <div class="history-item">
      <strong>SETUP #${history.length-i}</strong> · ${h.date}<br>
      ${h.data.vehicleName||'车辆'} · ${h.data.rideMode}<br>
      前：预载 ${h.data.frontPreload} Turns / LSC ${h.data.frontLSC} Click / 回弹 ${h.data.frontRebound} Click<br>
      后：预载 ${h.data.rearPreload} mm / K1 ${h.data.k1} / K2 ${h.data.k2} / 回弹 ${h.data.rearRebound} Click
    </div>`).join('') : '<div class="history-item">暂无记录，点击“保存当前 Setup”创建第一条调教档案。</div>';
}

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tab-page').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active'); $(btn.dataset.tab).classList.add('active');
}));

fields.forEach(id=>$(id).addEventListener('input',refresh));
$('diagnoseBtn').addEventListener('click',diagnose);
$('snapshotBtn').addEventListener('click',snapshot);
$('clearHistoryBtn').addEventListener('click',()=>{if(confirm('确定清空全部调教记录吗？')){localStorage.removeItem('ninebotSuspensionProHistory');renderHistory();}});
$('saveBtn').addEventListener('click',()=>{localStorage.setItem('ninebotSuspensionProCurrent',JSON.stringify(getData()));alert('当前设定已保存到本设备。');});
$('exportBtn').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),setup:getData(),history:JSON.parse(localStorage.getItem('ninebotSuspensionProHistory')||'[]')},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Ninebot-Suspension-Pro-Setup.json';a.click();URL.revokeObjectURL(a.href);
});

const saved=localStorage.getItem('ninebotSuspensionProCurrent');
if(saved){try{setData(JSON.parse(saved));}catch(e){refresh();}}else refresh();
renderHistory();

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
}