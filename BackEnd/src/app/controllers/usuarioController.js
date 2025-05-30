import usuarioModel from "../models/usuarioModel.js";

class usuarioController {
  async indexUsuarios(req, res) {
    const row = await usuarioModel.getUsuarios();
    res.status(200).json(row);
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
}

export default new usuarioController();
