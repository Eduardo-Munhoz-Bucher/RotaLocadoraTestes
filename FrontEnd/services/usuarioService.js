export class UsuarioService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async postUsuario(data) {
    const response = await this.httpClient.post("/usuarios", data);
    return response;
  }

  async postUsuarioLogin(data) {
    const response = await this.httpClient.post("/login", data);
    return response;
  }
}
