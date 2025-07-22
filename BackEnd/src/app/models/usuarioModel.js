import { consulta } from "../database/conexao.js";

class usuarioModel {
  async createUsuario(usuario) {
    const sqlInsert = "INSERT INTO usuarios SET ?";
    const sqlSelect = "SELECT * FROM usuarios WHERE id = ?";
    try {
      const resultado = await consulta(
        sqlInsert,
        usuario,
        "Usuário cadastrado com sucesso!"
      );

      console.log("Usuário adicionado com sucesso!");

      const insertId = resultado.insertId;
      const rows = await consulta(
        sqlSelect,
        [insertId],
        "Não foi possível buscar o usuário cadastrado"
      );

      return rows[0];
    } catch (error) {
      console.log("Erro ao adicionar usuário: ", error);
    }
  }

  async getUsuarioByEmail(email) {
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    const rows = await consulta(sql, [email], "Usuário não encontrado");
    return rows[0];
  }

  getUsuarios(nome_user = "") {
    let sql = "SELECT * FROM usuarios WHERE ativo=1";
    const params = [];

    if (nome_user) {
      sql += " AND nome_user LIKE ?";
      params.push(`%${nome_user}%`); // Usa LIKE para busca parcial
    }

    sql += " ORDER BY nome_user ASC";

    return consulta(sql, params, "Não foi possível encontrar os usuários!");
  }

  getUsuariosInativos(nome_user = "") {
    let sql = "SELECT * FROM usuarios WHERE ativo=0";
    const params = [];

    if (nome_user) {
      sql += " AND nome_user LIKE ?";
      params.push(`%${nome_user}%`); // Usa LIKE para busca parcial
    }

    sql += " ORDER BY nome_user ASC";

    return consulta(sql, params, "Não foi possível encontrar os usuários!");
  }

  updateUsuario(usuario, id) {
    const sql = "UPDATE usuarios SET ? WHERE id=?";
    return consulta(sql, [usuario, id], "Não foi possivel editar o usuário!");
  }
}

export default new usuarioModel();
