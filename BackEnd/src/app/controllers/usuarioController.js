import usuarioModel from "../models/usuarioModel.js";

class usuarioController {
  async indexUsuarios(req, res) {
    try {
      const { nome_user } = req.query; // Extrai nome_user da query string
      const row = await usuarioModel.getUsuarios(nome_user);
      res.status(200).json(row);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  async indexUsuariosInativos(req, res) {
    try {
      const { nome_user } = req.query; // Extrai nome_user da query string
      const row = await usuarioModel.getUsuariosInativos(nome_user);
      res.status(200).json(row);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  async storyUsuario(req, res) {
    const usuario = req.body;
    const novoUsuario = await usuarioModel.createUsuario(usuario);

    delete novoUsuario.senha;

    res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      usuario: novoUsuario,
    });
  }

  async loginUsuario(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: "Campos não preenchidos!" });
    }

    const usuario = await usuarioModel.getUsuarioByEmail(email);

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ message: "E-mail ou senha incorretos!" });
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome_user: usuario.nome_user,
        email: usuario.email,
      },
    });
  }

  async updateUsuario(req, res) {
    const id = req.params.id;
    const usuario = req.body;

    try {
      const row = await usuarioModel.updateUsuario(usuario, id);

      res.status(201).json({
        message: "Usuário editado com sucesso",
        data: row,
      });
    } catch (error) {
      error("Erro ao editar usuário: ", error);
      res.status(500).json({
        message: "Erro ao editar usuário",
        error: error.message,
      });
    }
  }

  async deleteUsuario(req, res) {
    const id = req.params.id;

    const usuario = {
      ativo: false,
    };

    try {
      const row = await usuarioModel.updateUsuario(usuario, id);
      console.log("Usuário desativado com sucesso: ", row);

      res.status(200).json({
        message: "Usuário desativado com sucesso!",
        data: row,
      });
    } catch (error) {
      console.error("Erro ao desativar Usuário: ", error);
      res.status(500).json({
        message: "Erro ao desativar Usuário.",
        error: error.message,
      });
    }
  }
}

export default new usuarioController();
