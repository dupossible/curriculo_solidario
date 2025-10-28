export const expList  = document.getElementById('expList');
export const eduList  = document.getElementById('eduList');
export const skillList= document.getElementById('skillList');

export function addExp(onChange, data={role:'',company:'',from:'',to:'',description:''}){
  const div = document.createElement('div');
  div.className = 'border rounded p-2 mb-2';
  div.innerHTML = `
    <div class="row g-2">
      <div class="col-md-12"><input class="form-control form-modern" placeholder="Cargo" value="${data.role || ''}"></div>
      <div class="col-md-6 mt-2"><input class="form-control form-modern" placeholder="Empresa" value="${data.company || ''}"></div>
      <div class="col-md-3 mt-2"><input class="form-control form-modern date-mask" placeholder="MM-AAAA (início)" value="${data.from || ''}" autocomplete="off"></div>
      <div class="col-md-3 mt-2"><input class="form-control form-modern date-mask" placeholder="MM-AAAA (fim ou 'Atual')" value="${data.to || ''}" autocomplete="off"></div>
    </div>
    <textarea class="form-control form-modern mt-2" rows="3" placeholder="Atividades (uma por linha)">${data.description || ''}</textarea>
    <div class="text-end mt-2"><button type="button" class="btn btn-sm btn-outline-danger">Remover</button></div>
  `;
  div.querySelector('button').onclick = ()=>{ div.remove(); onChange && onChange(); };
  ['input','change','keyup'].forEach(ev=> div.addEventListener(ev, ()=> onChange && onChange()));
  expList.appendChild(div);
  onChange && onChange();
}

export function addEdu(onChange, data={course:'',institution:'',conclusion:''}){
  const div = document.createElement('div');
  div.className='border rounded p-2 mb-2';
  div.innerHTML = `
    <div class="row g-2">
      <div class="col-md-5"><input class="form-control form-modern" placeholder="Curso" value="${data.course||''}"></div>
      <div class="col-md-5"><input class="form-control form-modern" placeholder="Instituição" value="${data.institution||''}"></div>
      <div class="col-md-2"><input class="form-control form-modern" placeholder="Ano" value="${data.conclusion||''}"></div>
    </div>
    <div class="text-end mt-2"><button type="button" class="btn btn-sm btn-outline-danger">Remover</button></div>
  `;
  div.querySelector('button').onclick = ()=>{ div.remove(); onChange && onChange(); };
  div.addEventListener('input', ()=> onChange && onChange());
  eduList.appendChild(div);
  onChange && onChange();
}

export function addSkill(onChange, data={name:'',conclusion:''}){
  const div = document.createElement('div');
  div.className='border rounded p-2 mb-2';
  div.innerHTML = `
    <div class="row g-2">
      <div class="col-md-8"><input class="form-control form-modern" placeholder="Curso/Habilidade" value="${data.name||''}"></div>
      <div class="col-md-4"><input class="form-control form-modern" placeholder="Ano" value="${data.conclusion||''}"></div>
    </div>
    <div class="text-end mt-2"><button type="button" class="btn btn-sm btn-outline-danger">Remover</button></div>
  `;
  div.querySelector('button').onclick = ()=>{ div.remove(); onChange && onChange(); };
  div.addEventListener('input', ()=> onChange && onChange());
  skillList.appendChild(div);
  onChange && onChange();
}

export function getExperiences(){
  const arr = [];
  [...expList.children].forEach(div=>{
    const [role, company, from, to] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    const description = div.querySelector('textarea').value.trim();
    if (role || company || from || to || description) arr.push({ role, company, from, to, description });
  });
  return arr;
}
export function getEducation(){
  const arr = [];
  [...eduList.children].forEach(div=>{
    const [course, institution, conclusion] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    if (course || institution || conclusion) arr.push({ course, institution, conclusion });
  });
  return arr;
}
export function getSkills(){
  const arr = [];
  [...skillList.children].forEach(div=>{
    const [name, conclusion] = [...div.querySelectorAll('input')].map(i=>i.value.trim());
    if (name || conclusion) arr.push({ name, conclusion });
  });
  return arr;
}
