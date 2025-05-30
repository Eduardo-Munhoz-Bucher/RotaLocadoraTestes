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

  getUsuarios() {
    const sql = "SELECT * FROM usuarios";
    return consulta(sql, "Não foi possível encontrar os usuários!");
  }
}

export default new usuarioModel();