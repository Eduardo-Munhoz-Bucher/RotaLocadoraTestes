import { consulta } from "../database/conexao.js";

class historicoModel {
  async getHistorico(filtros) {
    let sql = "SELECT * FROM historico_veiculos WHERE 1=1";
    const params = [];

    if (filtros.placa) {
      sql += " AND placa LIKE ?";
      params.push(`%${filtros.placa}%`);
    }

    sql += " ORDER BY data_hora DESC"

    return consulta(sql, params, "Não foi possível encontrar o histórico dos veículos!");
  }
}

export default new historicoModel();
