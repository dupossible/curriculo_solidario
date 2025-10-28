import { expList, eduList, skillList } from './formEvents.js';

export function updatePreview(form){
  const name  = form.name.value.trim() || 'Nome';
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const city  = form.city.value.trim();
  const summary = form.summary.value.trim();

  document.getElementById('p_name').textContent = name;
  const contact = [city, phone, email].filter(Boolean).join(' • ');
  document.getElementById('p_contact').textContent = contact || 'Cidade • Telefone • Email';

  const wrap = document.getElementById('p_summary_wrap');
  const el   = document.getElementById('p_summary');
  if (summary){ wrap.style.display=''; el.textContent = summary; }
  else { wrap.style.display='none'; el.textContent = ''; }

  renderPreviewLists();
}

export function renderPreviewLists(){
  const pExpWrap = document.getElementById('p_exp_wrap');
  const pExp = document.getElementById('p_exp');
  pExp.innerHTML = '';
  [...expList.children].forEach(div=>{
    const [role, company, from, to] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    const desc = div.querySelector('textarea').value.trim();
    if (!role && !company && !from && !to && !desc) return;
    const block = document.createElement('div');
    block.className='mb-2';
    const end = to.toLowerCase()==='atual' ? 'Atual' : to;
    const bullets = (desc ? desc.split('\n').filter(Boolean).map(line=>`<li>${line}</li>`).join('') : '');
    block.innerHTML = `
      <div><strong>${company || ''}</strong></div>
      <div class="fw-bold text-uppercase">${role || '-'}</div>
      <div class="text-muted" style="font-size:10px">${(from||'')} a ${(end||'')}</div>
      <ul class="mb-1">${bullets}</ul>
    `;
    pExp.appendChild(block);
  });
  pExpWrap.style.display = pExp.children.length ? '' : 'none';

  const pEduWrap = document.getElementById('p_edu_wrap');
  const pEdu = document.getElementById('p_edu');
  pEdu.innerHTML = '';
  [...eduList.children].forEach(div=>{
    const [course, institution, conclusion] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    if (!course && !institution && !conclusion) return;
    const row = document.createElement('div');
    row.className='mb-1';
    row.innerHTML = `<div><strong>${course||'-'}</strong> — ${institution||''} <span class="text-muted" style="font-size:10px">${conclusion||''}</span></div>`;
    pEdu.appendChild(row);
  });
  pEduWrap.style.display = pEdu.children.length ? '' : 'none';

  const pSkillWrap = document.getElementById('p_skill_wrap');
  const pSkill = document.getElementById('p_skill');
  pSkill.innerHTML = '';
  [...skillList.children].forEach(div=>{
    const [name, conclusion] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    if (!name && !conclusion) return;
    const li = document.createElement('li');
    li.textContent = `${name}${conclusion ? ' — ' + conclusion : ''}`;
    pSkill.appendChild(li);
  });
  pSkillWrap.style.display = pSkill.children.length ? '' : 'none';
}
