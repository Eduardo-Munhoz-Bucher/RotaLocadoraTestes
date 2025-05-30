export class VeiculoService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async getVeiculos() {
    const response = await this.httpClient.get("/veiculos?ativo=1");
    return response.data;
  }

  async postVeiculo(data) {
    const response = await this.httpClient.post("/veiculos", data);
    return response;
  }
  async putVeiculo(id, data) {
    const response = await this.httpClient.put(`veiculos/${id}`, data);
    return response;
  }

  async deleteVeiculo(id) {
    const response = await this.httpClient.delete(`veiculos/${id}`);
    return response;
  }

  async getHistorico() {
    const response = await this.httpClient.get("/historico");
    return response;
  }
}
