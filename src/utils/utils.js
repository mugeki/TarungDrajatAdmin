export default function validateForm(form, validationTarget) {
  let newError = {...validationTarget};
  for (const key in validationTarget) {
    if (form[key] === '') {
      newError[key] = 'Field tidak boleh kosong';
    } else {
      newError[key] = '';
    }
  }
  return newError;
}
