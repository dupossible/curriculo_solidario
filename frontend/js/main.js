import { applyPhoneMask, isValidEmail, applyMonthYearMask } from './validators.js';
import { addExp, addEdu, addSkill, getExperiences, getEducation, getSkills } from './formEvents.js';
import { updatePreview, renderPreviewLists } from './preview.js';
import { saveCV } from './api.js';

const form = document.getElementById('cvForm');

['name','email','phone','city','summary'].forEach(id => {
  form.elements[id].addEventListener('input', ()=> updatePreview(form));
});
form.elements['phone'].addEventListener('input', ()=> applyPhoneMask(form.elements['phone']));
document.addEventListener('input', (e)=>{ if (e.target.classList.contains('date-mask')) applyMonthYearMask(e.target); });

document.getElementById('addExp').addEventListener('click', ()=> addExp(()=> renderPreviewLists()));
document.getElementById('addEdu').addEventListener('click', ()=> addEdu(()=> renderPreviewLists()));
document.getElementById('addSkill').addEventListener('click', ()=> addSkill(()=> renderPreviewLists()));

// Wizard
const steps = [...document.querySelectorAll('.form-step')];
let step = 0;

function showStep(){
  steps.forEach((s,i)=> s.classList.toggle('active', i===step));
  document.getElementById('stepLabel').textContent = `Etapa ${step+1} de ${steps.length}`;
  const pct = Math.round(((step+1)/steps.length)*100);
  document.getElementById('progressBar').style.width = pct + '%';
}

// Avançar
document.querySelectorAll('.next-step').forEach(btn =>
  btn.addEventListener('click', ()=>{
    step = Math.min(step+1, steps.length-1);
    showStep();
    updatePreview(form);
  })
);

// Voltar
document.querySelectorAll('.prev-step').forEach(btn =>
  btn.addEventListener('click', ()=>{
    step = Math.max(step-1, 0);
    showStep();
    updatePreview(form);
  })
);

showStep();

updatePreview(form);

form.addEventListener('submit', async (e)=>{
  e.preventDefault();

  const payload = {
    name: form.elements['name'].value.trim(),
    email: form.elements['email'].value.trim(),
    phone: form.elements['phone'].value.trim(),
    city: form.elements['city'].value.trim(),
    summary: form.elements['summary'].value.trim(),
    experiences: getExperiences(),
    education: getEducation(),
    skillCourses: getSkills()
  };

  if (!isValidEmail(payload.email)) { Swal.fire('E-mail inválido!', 'Digite um e-mail válido.', 'warning'); return; }
  if (payload.phone.length < 14) { Swal.fire('Telefone inválido!', 'Formato (xx)xxxxx-xxxx obrigatório.', 'warning'); return; }

  const dateRe = /^(0[1-9]|1[0-2])-\d{4}$|^Atual$/i;
  for (const exp of payload.experiences){
    if (exp.from && !dateRe.test(exp.from)) { Swal.fire('Data inválida','Use MM-AAAA.','warning'); return; }
    if (exp.to && !dateRe.test(exp.to)) { Swal.fire('Data inválida','Use MM-AAAA.','warning'); return; }
  }

  try {
    const data = await saveCV(payload);
    if (data.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Currículo gerado com sucesso!',
        html: `
          <p>Anote o <strong>código</strong> abaixo e informe à Plugin Gráfica para recebê-lo gratuitamente Impresso ou digital.</p>
          <h2 style="font-weight:bold;">${data.printCode}</h2>
           `,
        confirmButtonText: 'Ok, ir para a página inicial',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: true,
        showConfirmButton: true
      }).then(()=>{ window.location.href = 'index.html'; });
    } else {
      throw new Error(data.error || 'Erro ao salvar');
    }
  } catch (err) {
    Swal.fire({ icon:'error', title:'Falha', text: err.message });
  }
});
