import { consulta } from "../database/conexao.js";

class veiculoModel {
  async createVeiculo(veiculo) {
    const sql = "INSERT INTO veiculos SET ?";
    try {
      const resultado = await consulta(
        sql,
        veiculo,
        "Não foi possivel cadastrar o veículo!"
      );
      console.log("Veiculo adicionado com sucesso: ", resultado);
    } catch (erro) {
      console.log("Erro ao adicionar veículo: ", erro);
    }
  }

  async getVeiculos(filtros) {
    let sql = "SELECT * FROM veiculos WHERE ativo=1";
    const params = [];

    if (filtros.marca) {
      const marcas = filtros.marca.split(",");
      const marcasPlaceholders = marcas.map(() => "?").join(",");
      sql += ` AND marca IN (${marcasPlaceholders})`;
      params.push(...marcas);
    }

    if (filtros.proposito) {
      sql += " AND proposito_uso LIKE ?";
      params.push(`%${filtros.proposito}%`);
    }

    if (filtros.placa) {
      sql += " AND placa LIKE ?";
      params.push(`%${filtros.placa}%`);
    }

    sql += " ORDER BY dtCadastro DESC";

    return consulta(sql, params, "Não foi possível encontrar os veículos!");
  }

  getVeiculoId(id) {
    const sql = "SELECT * FROM veiculos WHERE id=?";
    return consulta(sql, id, "Não foi possivel encontrar o veículo!");
  }

  updateVeiculo(veiculo, id) {
    const sql = "UPDATE veiculos SET ? WHERE id=?";
    return consulta(sql, [veiculo, id], "Não foi possivel editar o veículo!");
  }
}

export default new veiculoModel();
