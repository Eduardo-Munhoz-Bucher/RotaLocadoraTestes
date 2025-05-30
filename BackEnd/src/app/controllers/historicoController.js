import historicoModel from "../models/historicoModel.js";

class historicoController {
  async indexHistorico(req, res) {
    try {
      const { placa } = req.query;

      const row = await historicoModel.getHistorico({ placa });

      console.log("Histórico encontrado: ", row);
      res.status(200).json(row);
    } catch (error) {
      console.error("Erro ao buscar histórico: ", error);
      res.status(500).json({
        message: "Erro ao buscar histórico.",
        error: error.message,
      });
    }
  }
}

export default new historicoController();
