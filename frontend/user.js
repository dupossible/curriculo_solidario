const API = 'http://localhost:5000/api/cv';

// ------- PREVIEW (ao vivo) -------
const form = document.getElementById('cvForm');
const fields = ['name','email','phone','city','summary'];
fields.forEach(n => {
  form.elements[n].addEventListener('input', updatePreview);
});
function updatePreview(){
  const name  = form.elements['name'].value.trim();
  const email = form.elements['email'].value.trim();
  const phone = form.elements['phone'].value.trim();
  const city  = form.elements['city'].value.trim();
  const summary = form.elements['summary'].value.trim();

  document.getElementById('p_name').textContent = name || 'Nome';
  const contact = [city, phone, email].filter(Boolean).join(' • ');
  document.getElementById('p_contact').textContent = contact || 'Cidade • Telefone • Email';

  const sumWrap = document.getElementById('p_summary_wrap');
  const sumEl   = document.getElementById('p_summary');
  if (summary) { sumWrap.style.display = ''; sumEl.textContent = summary; }
  else { sumWrap.style.display = 'none'; sumEl.textContent = ''; }

  renderPreviewLists();
}

// ------- listas dinâmicas -------
const expList = document.getElementById('expList');
const eduList = document.getElementById('eduList');
const skillList = document.getElementById('skillList');

document.getElementById('addExp').addEventListener('click', ()=> addExp());
document.getElementById('addEdu').addEventListener('click', ()=> addEdu());
document.getElementById('addSkill').addEventListener('click', ()=> addSkill());

function addExp(data={company:'',from:'',to:'',description:''}) {
  const div = document.createElement('div');
  div.className = 'border rounded p-2 mb-2';
  div.innerHTML = `
  <div class="row g-2">
    <div class="col-md-12">
      <input class="form-control form-modern" placeholder="Cargo" value="${data.role || ''}">
    </div>

    <div class="col-md-6 mt-2">
      <input class="form-control form-modern" placeholder="Empresa" value="${data.company || ''}">
    </div>

    <div class="col-md-3 mt-2">
      <input class="form-control form-modern" placeholder="Admissão" type="month" value="${data.from || ''}">
    </div>

    <div class="col-md-3 mt-2">
      <input class="form-control form-modern" placeholder="Saída" type="month" value="${data.to || ''}">
    </div>
  </div>

  <textarea class="form-control form-modern mt-2" rows="3" placeholder="Atividades">${data.description || ''}</textarea>

  <div class="text-end mt-2">
    <button type="button" class="btn btn-sm btn-outline-danger">Remover</button>
  </div>
`;

  div.querySelector('button').onclick = ()=> { div.remove(); renderPreviewLists(); };
  ['input','change','keyup'].forEach(ev=> div.addEventListener(ev, renderPreviewLists));
  expList.appendChild(div);
  renderPreviewLists();
}
function addEdu(data={course:'',institution:'',conclusion:''}) {
  const div = document.createElement('div');
  div.className='border rounded p-2 mb-2';
  div.innerHTML = `
    <div class="row g-2">
      <div class="col-md-5"><input class="form-control form-modern" placeholder="Curso" value="${data.course}"></div>
      <div class="col-md-5"><input class="form-control form-modern" placeholder="Instituição" value="${data.institution}"></div>
      <div class="col-md-2"><input class="form-control form-modern" placeholder="Conclusão" value="${data.conclusion}"></div>
    </div>
    <div class="text-end mt-2"><button type="button" class="btn btn-sm btn-outline-danger">Remover</button></div>
  `;
  div.querySelector('button').onclick = ()=> { div.remove(); renderPreviewLists(); };
  div.addEventListener('input', renderPreviewLists);
  eduList.appendChild(div);
  renderPreviewLists();
}
function addSkill(data={name:'',conclusion:''}) {
  const div = document.createElement('div');
  div.className='border rounded p-2 mb-2';
  div.innerHTML = `
    <div class="row g-2">
      <div class="col-md-8"><input class="form-control form-modern" placeholder="Curso/Habilidade" value="${data.name}"></div>
      <div class="col-md-4"><input class="form-control form-modern" placeholder="Conclusão" value="${data.conclusion}"></div>
    </div>
    <div class="text-end mt-2"><button type="button" class="btn btn-sm btn-outline-danger">Remover</button></div>
  `;
  div.querySelector('button').onclick = ()=> { div.remove(); renderPreviewLists(); };
  div.addEventListener('input', renderPreviewLists);
  skillList.appendChild(div);
  renderPreviewLists();
}

// renderiza as seções do preview
function renderPreviewLists(){
  // EXPERIÊNCIAS
  const pExpWrap = document.getElementById('p_exp_wrap');
  const pExp = document.getElementById('p_exp');
  pExp.innerHTML = '';
  [...expList.children].forEach(div=>{
    const [company, from, to] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    const desc = div.querySelector('textarea').value.trim();
    if (!company && !from && !to && !desc) return;
    const block = document.createElement('div');
    block.className='mb-2';
    const bullets = (desc ? desc.split('\n').filter(Boolean).map(line=>`<li>${line}</li>`).join('') : '');
    block.innerHTML = `
      <div class="fw-bold text-uppercase">${company||'-'}</div>
      <div class="text-muted" style="font-size:12px">${from||''} - ${to||''}</div>
      <ul class="mb-1">${bullets}</ul>
    `;
    pExp.appendChild(block);
  });
  pExpWrap.style.display = pExp.children.length ? '' : 'none';

  // EDUCAÇÃO
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

  // HABILIDADES/COMPETÊNCIAS (cursos)
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
updatePreview();

document.getElementById("cvForm").addEventListener("submit", function(e){
  const email = e.target.email.value.trim();
  const phone = e.target.phone.value.trim();

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const minPhoneLength = 14; // (xx)xxxxx-xxxx

  if (!regexEmail.test(email)) {
    e.preventDefault();
    Swal.fire("E-mail inválido!", "Digite um e-mail com @ e domínio válido.", "warning");
    return;
  }

  if (phone.length < minPhoneLength) {
    e.preventDefault();
    Swal.fire("Telefone inválido!", "Preencha no formato (xx)xxxxx-xxxx.", "warning");
    return;
  }
});

// ------- submit: salva e mostra código -------
form.addEventListener('submit', async (e)=>{
  e.preventDefault();

  const payload = {
    name: form.elements['name'].value.trim(),
    email: form.elements['email'].value.trim(),
    phone: form.elements['phone'].value.trim(),
    city: form.elements['city'].value.trim(),
    summary: form.elements['summary'].value.trim(),
    experiences: [],
    education: [],
    skillCourses: []
  };

  // coletar experiências
  [...expList.children].forEach(div=>{
    const [company, from, to] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    const description = div.querySelector('textarea').value.trim();
    if (company || from || to || description) payload.experiences.push({ company, from, to, description });
  });

  // coletar educação
  [...eduList.children].forEach(div=>{
    const [course, institution, conclusion] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    if (course || institution || conclusion) payload.education.push({ course, institution, conclusion });
  });

  // coletar habilidades/competências (cursos)
  [...skillList.children].forEach(div=>{
    const [name, conclusion] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    if (name || conclusion) payload.skillCourses.push({ name, conclusion });
  });

  try {
    const r = await fetch(`${API}/create`, {
      method:'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (data.ok) {
      Swal.fire({
  icon: 'success',
  title: 'Currículo gerado com sucesso!',
  html: `
    <p>Anote o <strong>código de impressão</strong> abaixo e informe à Plugin Gráfica Digital</p>
    <h2 style="font-weight:bold;">${data.printCode}</h2>
    <p class="text-muted">para receber seu currículo por e-mail ou imprimi-lo gratuitamente</p>
  `,
  confirmButtonText: 'Ok, entendi ✏️',
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey: true
});

    } else {
      throw new Error(data.error || 'Erro ao salvar');
    }
  } catch (err) {
    Swal.fire({ icon:'error', title:'Falha', text: err.message });
  }
});
