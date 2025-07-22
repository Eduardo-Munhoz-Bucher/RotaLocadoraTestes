export class UsuarioService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async getUsuarios() {
    const response = await this.httpClient.get("/usuarios");
    return response.data;
  }

  async getUsuariosInativos() {
    const response = await this.httpClient.get("/usuarios_inativos");
    return response.data;
  }

  async postUsuario(data) {
    const response = await this.httpClient.post("/usuarios", data);
    return response;
  }

  async putUsuario(id, data) {
    const response = await this.httpClient.put(`/usuarios/${id}`, data);
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
