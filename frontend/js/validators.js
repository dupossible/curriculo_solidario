export function applyPhoneMask(input){
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) input.value = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3');
  else if (v.length > 6) input.value = v.replace(/(\d{2})(\d{4})(\d+)/, '($1)$2-$3');
  else if (v.length > 2) input.value = v.replace(/(\d{2})(\d+)/, '($1)$2');
  else if (v.length > 0) input.value = v.replace(/(\d+)/, '($1');
}

export function isValidEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function applyMonthYearMask(input){
  let v = input.value.trim().toLowerCase();

  // ✅ aceita ATUAL / atual / Atual / aTuAl
  if (/^atual$/.test(v)) {
    input.value = "Atual";
    return;
  }

  // Mascara normal MM-AAAA
  v = v.replace(/\D/g, '').slice(0, 6);

  if (v.length >= 3) {
    input.value = v.slice(0, 2) + '-' + v.slice(2);
  } else {
    input.value = v;
  }
}
