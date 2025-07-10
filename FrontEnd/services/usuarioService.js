export class UsuarioService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async getUsuarios() {
    const response = await this.httpClient.get("/usuarios");
    return response.data;
  }

  async postUsuario(data) {
    const response = await this.httpClient.post("/usuarios", data);
    return response;
  }

  async deleteUsuario(id) {
    const response = await this.httpClient.delete(`usuarios/${id}`);
    return response;
  }

  async postUsuarioLogin(data) {
    const response = await this.httpClient.post("/login", data);
    return response;
  }
}
