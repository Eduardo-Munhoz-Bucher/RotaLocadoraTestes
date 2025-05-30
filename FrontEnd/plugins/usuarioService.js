import { UsuarioService } from "~/services/usuarioService";

export default ({ $axios }, inject) => {
  const usuarioService = new UsuarioService($axios);
  inject("usuarioService", usuarioService);
};
