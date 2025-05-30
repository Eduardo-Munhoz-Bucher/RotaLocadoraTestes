export const usuarioRules = [
  (v) => !!v || "Usuário é obrigatório",
  (v) => (v && v.length > 3) || "Mínimo 3 caracteres",
];

export const aniversarioRules = [(v) => !!v || "Aniversário é obrigatório"];

export const emailRules = [
  (v) => !!v || "Email é obrigatório",
  (v) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      v
    ) || "Email inválido",
];

export const senhaRules = [
  (v) => !!v || "Senha é obrigatória",
  (v) => (v && v.length >= 8) || "Mínimo 8 caracteres",
  (v) => /[A-Za-z]/.test(v) || "Deve conter pelo menos 1 letra",
  (v) => /[0-9]/.test(v) || "Deve conter pelo menos 1 número",
  (v) =>
    /[^A-Za-z0-9]/.test(v) || "Deve conter pelo menos 1 caractere especial",
];

export const confirmarSenhaRule = (senha) => [
  (v) => !!v || "Confirmação é obrigatória",
  (v) => v === senha || "Senhas não são iguais",
];

export const placaRules = [
  (v) => !!v || "Campo obrigatório",
  (v) =>
    /^[A-Z]{3}\-\d{4}$/.test(v) ||
    /^[A-Z]{3}\d{1}[A-J]{1}\d{2}$/.test(v) ||
    "Formato inválido da placa (ABC-1234 ou ABC1C23)",
];
export const marcaRules = [(v) => !!v || "Campo obrigatório"];
export const modeloRules = [(v) => !!v || "Campo obrigatório"];
export const anoRules = [(v) => !!v || "Campo obrigatório"];
export const corRules = [(v) => !!v || "Campo obrigatório"];
export const propositoRules = [(v) => !!v || "Campo obrigatório"];
export const latitudeRules = [
  (v) => !!v || "Campo obrigatório",
  (v) => (v && v.length >= 10) || "Mínimo 10 caracteres",
  (v) =>
    /^[+-]?\d+(\.\d+)?$/.test(v) || "Use ponto (.) ao invés de vírgula (,)",
];
export const longitudeRules = [
  (v) => !!v || "Campo obrigatório",
  (v) => (v && v.length >= 10) || "Mínimo 10 caracteres",
  (v) =>
    /^[+-]?\d+(\.\d+)?$/.test(v) || "Use ponto (.) ao invés de vírgula (,)",
];
