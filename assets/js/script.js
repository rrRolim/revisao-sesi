'use strict';

// Interface compartilhada por todas as páginas. Funciona também sem servidor.
const app=document.querySelector('#app');
const root=document.body.dataset.root||'';
const standalone=document.body.dataset.page==='standalone';
const storageKey='sesi-revisao-checklist-v2';
const labels={conteudo:'Conteúdo',quiz:'Quiz',checklist:'Checklist'};
const letters=['A','B','C','D','E'];
const quizSessions=new Map();
let storageReady=true;
let completed={};
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))completed=saved;}catch{storageReady=false;}
const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function route(){
 const hash=location.hash.replace(/^#\/?/,'');
 if(standalone){
  if(['geometria','quiz','revisao'].includes(hash))return {grade:'3',area:'matematica',tab:hash==='quiz'?'quiz':'conteudo'};
  const [grade,area,tab]=hash.split('/');
  if(!curriculum[grade])return {};
  if(!areaInfo[area])return {grade};
  return {grade,area,tab:labels[tab]?tab:'conteudo'};
 }
 const {grade,area,page}=document.body.dataset;
 if(page==='home')return {};
 if(page==='grade')return {grade};
 return {grade,area,tab:labels[hash]?hash:'conteudo'};
}
function href(grade,area,tab='conteudo'){
 if(standalone)return '#/'+[grade,area,area?tab:null].filter(Boolean).join('/');
 if(!grade)return root+'index.html';
 if(!area)return root+'pages/'+grade+'ano.html';
 return root+'pages/areas/'+grade+'ano/'+area+'.html#'+tab;
}
function key(grade,area,id){return grade+':'+area+':'+id;}
function stats(grade,area){
 const lessons=area?curriculum[grade][area].lessons:Object.keys(areaInfo).flatMap(a=>curriculum[grade][a].lessons.map(l=>({...l,area:a})));
 const done=lessons.filter(l=>completed[key(grade,area||l.area,l.id)]===true).length;
 return {done,total:lessons.length,percent:Math.round(done/lessons.length*100)};
}
function progressHTML(grade,area,large=false){
 if(area===true){large=true;area=undefined;}
 const s=stats(grade,area);
 return `<div class="progress-block ${large?'large':''}" data-progress-block><div class="progress-caption"><span>${area?'Conteúdos revisados':'Progresso do '+grade+'º ano'}</span><strong data-percent>${s.percent}%</strong></div><progress value="${s.done}" max="${s.total}" aria-label="${area?'Progresso de '+areaInfo[area].name:'Progresso do '+grade+'º ano'}"></progress><span class="progress-count" data-count>${s.done} de ${s.total} assuntos concluídos</span></div>`;
}
function announce(text){document.querySelector('#announcer').textContent=text;}
function breadcrumb(grade,area){
 document.querySelector('#breadcrumbs').innerHTML=`<a href="${href()}">Início</a>${grade?`<span aria-hidden="true">/</span>${area?`<a href="${href(grade)}">${grade}º ano</a><span aria-hidden="true">/</span><span aria-current="page">${areaInfo[area].name}</span>`:`<span aria-current="page">${grade}º ano</span>`}`:''}`;
 document.querySelector('#home-link').href=href();
 document.querySelector('#header-home').href=href();
 document.querySelector('#header-year').textContent=grade?grade+'º ANO':'ENSINO MÉDIO';
}
function home(){
 breadcrumb();
 app.innerHTML=`<section class="home-intro"><div><p class="eyebrow">3º BIMESTRE · SEMANA DE TESTES</p><h1>Um lugar para<br>revisar <em>e aprender.</em></h1><p class="lead">Escolha seu ano. Explore os conteúdos, pratique com o quiz e acompanhe o que já estudou.</p></div><div class="semester-note"><span class="note-symbol" aria-hidden="true">✓</span><span>CONTEÚDO + PRÁTICA</span><p>Sua revisão,<br>um assunto de cada vez.</p></div></section><section aria-labelledby="choose-title"><div class="section-heading"><h2 id="choose-title">Qual é o seu ano?</h2><span>Comece por aqui</span></div><div class="grade-grid">${['2','3'].map(grade=>`<a class="grade-card grade-${grade}" href="${href(grade)}"><div class="grade-top"><span>ENSINO MÉDIO</span><span class="circle-arrow" aria-hidden="true">↗</span></div><div class="grade-name"><span class="big-grade">${grade}<sup>º</sup></span><div><h3>${grade}º ano</h3><p>${grade==='3'?'Revisão ENEM e Geometria Analítica em Matemática.':'Conceitos, exemplos e exercícios para consolidar sua base.'}</p></div></div>${progressHTML(grade)}<span class="card-action">Acessar áreas do ${grade}º ano <span aria-hidden="true">→</span></span></a>`).join('')}</div></section><section class="how-to" aria-label="Como estudar"><article><span>01</span><div><h2>Entenda o conteúdo</h2><p>Leia os resumos e acompanhe os exemplos.</p></div></article><article><span>02</span><div><h2>Coloque em prática</h2><p>Receba a correção assim que responder.</p></div></article><article><span>03</span><div><h2>Veja seu progresso</h2><p>Marque os assuntos no checklist.</p></div></article></section>`;
}
function gradePage(grade){
 breadcrumb(grade);
 app.innerHTML=`<a class="back-link" href="${href()}">← Trocar ano</a><div class="page-heading"><div><p class="eyebrow">ENSINO MÉDIO · ${grade}º ANO</p><h1>Escolha sua<br><em>área de revisão.</em></h1><p class="lead">Conteúdos, quiz e checklist em cada área do conhecimento.</p></div><aside class="grade-progress">${progressHTML(grade,true)}</aside></div><div class="area-grid">${Object.entries(areaInfo).map(([area,info])=>{const data=curriculum[grade][area];return `<a href="${href(grade,area)}" class="area-card ${info.color}"><div class="area-card-top"><span class="subject-icon" aria-hidden="true">${info.icon}</span><span aria-hidden="true">↗</span></div><h2>${info.name}</h2><p>${info.description}</p><div class="area-meta">${data.lessons.length} assuntos <span>·</span> ${data.questions.length} questões</div>${progressHTML(grade,area)}<span class="card-action">Abrir área <span aria-hidden="true">→</span></span></a>`;}).join('')}`;
}
function areaPage(grade,area,tab){
 const info=areaInfo[area], data=curriculum[grade][area];
 breadcrumb(grade,area);
 app.innerHTML=`<a class="back-link" href="${href(grade)}">← Voltar às áreas do ${grade}º ano</a><div class="area-heading ${info.color}"><div class="area-title"><span class="subject-icon" aria-hidden="true">${info.icon}</span><div><p class="eyebrow">${grade}º ANO · 3º BIMESTRE</p><h1>${info.name}</h1></div></div><p class="lead">${data.intro}</p></div><div class="study-layout"><div class="study-main"><div class="tabs" role="tablist" aria-label="Revisão de ${info.name}">${Object.entries(labels).map(([id,label])=>`<button type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${id===tab}" tabindex="${id===tab?'0':'-1'}" data-tab="${id}">${label}</button>`).join('')}</div>${Object.keys(labels).map(id=>`<section class="tab-panel" id="panel-${id}" role="tabpanel" aria-labelledby="tab-${id}" tabindex="0" ${id!==tab?'hidden':''}></section>`).join('')}</div><aside class="study-sidebar"><div class="progress-card"><p class="eyebrow">SEU ANDAMENTO</p>${progressHTML(grade,area,true)}<p class="small">Marque no checklist os assuntos que você já revisou.</p><p id="storage-note" class="storage-note">${storageReady?'Salvo neste navegador.':'O navegador não permitiu salvar. O progresso ficará nesta sessão.'}</p></div><nav class="other-areas" aria-label="Outras áreas do ${grade}º ano"><h2>Outras áreas</h2>${Object.entries(areaInfo).filter(([a])=>a!==area).map(([a,i])=>`<a href="${href(grade,a)}"><span>${i.name}</span><span aria-hidden="true">↗</span></a>`).join('')}</nav></aside></div>`;
 renderContent(grade,area);
 renderChecklist(grade,area);
 renderQuiz(grade,area);
 document.querySelectorAll('[data-tab]').forEach(button=>{
  button.addEventListener('click',()=>selectTab(grade,area,button.dataset.tab));
  button.addEventListener('keydown',event=>{
   const order=Object.keys(labels),index=order.indexOf(button.dataset.tab);
   let next;if(event.key==='ArrowRight')next=(index+1)%order.length;if(event.key==='ArrowLeft')next=(index+order.length-1)%order.length;if(event.key==='Home')next=0;if(event.key==='End')next=order.length-1;
   if(next!==undefined){event.preventDefault();selectTab(grade,area,order[next]);document.querySelector('#tab-'+order[next]).focus();}
  });
 });
}
function selectTab(grade,area,tab,updateURL=true){
 document.querySelectorAll('[data-tab]').forEach(button=>{const selected=button.dataset.tab===tab;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});
 document.querySelectorAll('.tab-panel').forEach(panel=>{panel.hidden=panel.id!=='panel-'+tab;});
 if(updateURL){const hash=standalone?href(grade,area,tab):'#'+tab;history.replaceState(null,'',hash);}
}
function renderContent(grade,area){
 const data=curriculum[grade][area];
 document.querySelector('#panel-conteudo').innerHTML=`<div class="panel-intro"><h2>Conteúdos de revisão</h2><span>${data.lessons.length} assuntos</span></div><p class="scope-note">${data.note}</p>${grade==='3'&&area==='matematica'?'<div class="focus-banner"><span aria-hidden="true">π</span><div><strong>Foco extra em Geometria Analítica</strong><p>Além do panorama ENEM, revise pontos, retas e circunferências nos assuntos 12 a 18.</p></div></div>':''}<div class="lesson-list">${data.lessons.map((topic,index)=>`<details class="lesson" id="assunto-${topic.id}"><summary><span class="lesson-number">${String(index+1).padStart(2,'0')}</span><span><strong>${topic.title}</strong><small>${topic.subtitle}</small></span><span class="expand" aria-hidden="true">+</span></summary><div class="lesson-body">${topic.content}<div class="example"><span class="eyebrow">EXEMPLO PARA ENTENDER</span><p>${topic.example}</p></div>${topic.tip?`<p class="tip"><strong>Atenção:</strong> ${topic.tip}</p>`:''}</div></details>`).join('')}</div><div class="next-step"><p>Terminou de ler? Pratique ou marque o que revisou.</p><button class="button" type="button" data-go-quiz>Abrir quiz →</button></div>`;
 document.querySelector('[data-go-quiz]').addEventListener('click',()=>{selectTab(grade,area,'quiz');document.querySelector('#tab-quiz').focus();});
}
function renderChecklist(grade,area){
 const data=curriculum[grade][area];
 document.querySelector('#panel-checklist').innerHTML=`<div class="panel-intro"><h2>Meu checklist</h2><span>${data.lessons.length} assuntos</span></div><p class="scope-note">Marque quando conseguir explicar o assunto e acompanhar o exemplo. Você pode desmarcar a qualquer momento.</p><fieldset class="checklist"><legend class="sr-only">Assuntos revisados em ${areaInfo[area].name}</legend>${data.lessons.map((topic,index)=>`<label class="check-row ${completed[key(grade,area,topic.id)]===true?'done':''}"><input type="checkbox" data-check="${topic.id}" ${completed[key(grade,area,topic.id)]===true?'checked':''}><span class="check-index">${String(index+1).padStart(2,'0')}</span><span><strong>${topic.title}</strong><small>${topic.subtitle}</small></span><span class="check-state">${completed[key(grade,area,topic.id)]===true?'Revisado':'A revisar'}</span></label>`).join('')}</fieldset><p class="checklist-finish" id="checklist-finish" ${stats(grade,area).percent===100?'':'hidden'}>✓ Você revisou todos os assuntos desta área. Bom trabalho!</p>`;
 document.querySelectorAll('[data-check]').forEach(input=>input.addEventListener('change',()=>{
  const id=key(grade,area,input.dataset.check);if(input.checked)completed[id]=true;else delete completed[id];
  try{localStorage.setItem(storageKey,JSON.stringify(completed));storageReady=true;}catch{storageReady=false;}
  const row=input.closest('.check-row');row.classList.toggle('done',input.checked);row.querySelector('.check-state').textContent=input.checked?'Revisado':'A revisar';
  refreshProgress(grade,area);
  const topic=data.lessons.find(l=>l.id===input.dataset.check);
  const s=stats(grade,area);announce(`${topic.title}: ${input.checked?'revisado':'a revisar'}. ${s.done} de ${s.total} assuntos concluídos.`);
 }));
}
function refreshProgress(grade,area){
 const s=stats(grade,area);
 document.querySelectorAll('[data-progress-block]').forEach(block=>{block.querySelector('[data-percent]').textContent=s.percent+'%';block.querySelector('progress').value=s.done;block.querySelector('[data-count]').textContent=`${s.done} de ${s.total} assuntos concluídos`;});
 document.querySelector('#checklist-finish').hidden=s.percent!==100;
 document.querySelector('#storage-note').textContent=storageReady?'Salvo neste navegador.':'O navegador não permitiu salvar. O progresso ficará nesta sessão.';
}
function quizState(grade,area){
 const k=grade+':'+area;
 if(!quizSessions.has(k))quizSessions.set(k,{index:0,answers:Array(curriculum[grade][area].questions.length).fill(null),result:false});
 return quizSessions.get(k);
}
function renderQuiz(grade,area){
 const data=curriculum[grade][area], state=quizState(grade,area), panel=document.querySelector('#panel-quiz');
 const total=data.questions.length,answered=state.answers.filter(a=>a!==null).length,score=state.answers.filter((a,i)=>a===data.questions[i].answer).length;
 if(state.result){
  panel.innerHTML=`<div class="quiz-result"><p class="eyebrow">TREINO CONCLUÍDO</p><h2>${score}<span> / ${total} acertos</span></h2><p>${score===total?'Você acertou todas! Continue praticando com outros exercícios.':'Releia as explicações e retome os assuntos das questões que errou.'}</p><button type="button" class="button" id="restart-quiz">Refazer quiz</button></div><h3>Reveja as respostas</h3>${data.questions.map((q,i)=>`<details class="answer-review"><summary><span class="${state.answers[i]===q.answer?'success-text':'error-text'}">${state.answers[i]===q.answer?'✓ Acertou':'↺ Revisar'}</span> · ${i+1}. ${q.title}</summary><p>${q.text}</p><p>Sua resposta: ${state.answers[i]===null?'Não respondida':letters[state.answers[i]]+') '+q.options[state.answers[i]]}<br><strong>Correta: ${letters[q.answer]}) ${q.options[q.answer]}</strong></p><p>${q.explanation}</p></details>`).join('')}`;
  document.querySelector('#restart-quiz').addEventListener('click',()=>{state.index=0;state.answers.fill(null);state.result=false;renderQuiz(grade,area);announce('Quiz reiniciado. O checklist foi mantido.');});return;
 }
 const q=data.questions[state.index],selected=state.answers[state.index],submitted=selected!==null;
 panel.innerHTML=`<div class="panel-intro"><h2>Quiz de ${areaInfo[area].short}</h2><span>${score} ${score===1?'acerto':'acertos'}</span></div><p class="scope-note">Selecione uma alternativa para ver a correção na hora. Questões autorais de treino.</p><div class="quiz-counter"><span>Questão ${state.index+1} de ${total}</span><span>${answered} respondidas</span></div><progress value="${answered}" max="${total}" aria-label="Questões respondidas"></progress><article class="question-card"><span class="eyebrow">${q.topic}</span><h3 id="question-title" tabindex="-1">${q.title}</h3><p class="question-text">${q.text}</p><fieldset class="options" ${submitted?'disabled':''}><legend class="sr-only">Selecione sua resposta</legend>${q.options.map((option,i)=>`<label class="option ${submitted&&i===q.answer?'correct':''} ${submitted&&i===selected&&i!==q.answer?'incorrect':''}"><input type="radio" name="quiz-answer" value="${i}" ${selected===i?'checked':''}><span class="option-letter">${letters[i]}</span><span>${option}</span>${submitted&&i===q.answer?'<span class="answer-badge">Correta</span>':''}</label>`).join('')}</fieldset><div id="question-feedback" tabindex="-1">${submitted?`<div class="feedback ${selected===q.answer?'correct':'incorrect'}"><strong>${selected===q.answer?'✓ Resposta correta!':'A resposta correta é '+letters[q.answer]+'.'}</strong><p>${q.explanation}</p></div>`:''}</div><div class="quiz-navigation"><button class="button secondary" type="button" id="prev-question" ${state.index===0?'disabled':''}>← Anterior</button><button class="button" type="button" id="next-question" ${submitted?'':'disabled'}>${state.index===total-1?'Ver resultado':'Próxima →'}</button></div></article><p class="small">A pontuação conta acertos; não representa uma nota do ENEM. O quiz reinicia ao recarregar a página.</p>`;
 panel.querySelectorAll('input[name="quiz-answer"]').forEach(input=>input.addEventListener('change',()=>{
  if(state.answers[state.index]!==null)return;
  const choice=Number(input.value);state.answers[state.index]=choice;renderQuiz(grade,area);
  document.querySelector('#question-feedback').focus({preventScroll:true});
  announce((choice===q.answer?'Resposta correta. ':'Resposta incorreta. A correta é '+letters[q.answer]+'. ')+q.explanation);
 }));
 document.querySelector('#prev-question').addEventListener('click',()=>{if(state.index>0){state.index--;renderQuiz(grade,area);document.querySelector('#question-title').focus({preventScroll:true});}});
 document.querySelector('#next-question').addEventListener('click',()=>{if(!submitted)return;if(state.index===total-1){state.result=true;renderQuiz(grade,area);announce(`Quiz concluído: ${score} de ${total} acertos.`);}else{state.index++;renderQuiz(grade,area);document.querySelector('#question-title').focus({preventScroll:true});}});
}
let activeRoute='';
function render(focus=false){
 const {grade,area,tab}=route();
 const identity=(grade||'')+':'+(area||'');
 if(identity===activeRoute&&area&&document.querySelector('.tabs')){selectTab(grade,area,tab,false);return;}
 activeRoute=identity;
 if(!grade)home();else if(!area)gradePage(grade);else areaPage(grade,area,tab);
 document.title=area?`${areaInfo[area].name} | ${grade}º Ano | Revisão SESI`:grade?`${grade}º Ano | Revisão SESI`:'Revisão SESI · 3º Bimestre';
 if(focus){app.focus({preventScroll:true});window.scrollTo(0,0);}
}
window.addEventListener('hashchange',()=>render(true));
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();app.focus();});
document.querySelector('#current-year').textContent=new Date().getFullYear();
render();
