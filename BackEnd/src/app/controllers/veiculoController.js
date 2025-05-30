import moment from "moment";
import veiculoModel from "../models/veiculoModel.js";

class veiculoController {
  async indexVeiculos(req, res) {
    try {
      const { marca, proposito, placa } = req.query;

      const row = await veiculoModel.getVeiculos({ marca, proposito, placa });

      res.status(200).json(row);
    } catch (error) {
      console.error("Erro ao buscar veículos: ", error);
      res.status(500).json({
        message: "Erro ao buscar veículos.",
        error: error.message,
      });
    }
  }

  async showVeiculoId(req, res) {
    const id = req.params.id;
    const row = await veiculoModel.getVeiculoId(id);
    res.status(200).json(row);
  }

  async storyVeiculo(req, res) {
    const veiculo = req.body;

    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    veiculo.dtCadastro = dataAtual;

    try {
      const row = await veiculoModel.createVeiculo(veiculo);

      res.status(201).json({
        message: "Veículo cadastrado com sucesso!",
        data: row,
      });
    } catch (error) {
      console.error("Erro ao cadastrar veículo: ", error);
      res.status(500).json({
        message: "Erro ao cadastrar veículo.",
        error: error.message,
      });
    }
  }

  async updadeVeiculo(req, res) {
    const id = req.params.id;
    const veiculo = req.body;

    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    veiculo.dtEdicao = dataAtual;

    if (veiculo.dtCadastro) {
      veiculo.dtCadastro = moment(veiculo.dtCadastro).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }

    try {
      const row = await veiculoModel.updateVeiculo(veiculo, id);
      console.log("Veículo editado com sucesso: ", row);

      res.status(201).json({
        message: "Veículo editado com sucesso!",
        data: row,
      });
    } catch (error) {
      console.error("Erro ao editar veículo: ", error);
      res.status(500).json({
        message: "Erro ao editar veículo.",
        error: error.message,
      });
    }
  }

  async deleteVeiculo(req, res) {
    const id = req.params.id;

    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    const veiculo = {
      ativo: false,
      dtExclusao: dataAtual,
    };

    try {
      const row = await veiculoModel.updateVeiculo(veiculo, id);
      console.log("Veículo desativado com sucesso: ", row);

      res.status(200).json({
        message: "Veículo desativado com sucesso!",
        data: row,
      });
    } catch (error) {
      console.error("Erro ao desativar veículo: ", error);
      res.status(500).json({
        message: "Erro ao desativar veículo.",
        error: error.message,
      });
    }
  }
}

export default new veiculoController();
