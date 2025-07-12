import { Router } from "express";
import express from "express";
import veiculoController from "./app/controllers/veiculoController.js";
import usuarioController from "./app/controllers/usuarioController.js";
import historicoController from "./app/controllers/historicoController.js";
import { validarVeiculo } from "./app/middlewares/veiculoMiddleware.js";

const router = Router();

router.use(express.json());

router.get("/veiculos", veiculoController.indexVeiculos);
router.get("/veiculos/:id", veiculoController.showVeiculoId);
router.post("/veiculos", validarVeiculo, veiculoController.storyVeiculo);
router.put("/veiculos/:id", validarVeiculo, veiculoController.updadeVeiculo);
router.delete("/veiculos/:id", veiculoController.deleteVeiculo);

router.post("/login", usuarioController.loginUsuario);
router.get("/usuarios", usuarioController.indexUsuarios);
router.post("/usuarios", usuarioController.storyUsuario);
router.put("/usuarios/:id", usuarioController.updateUsuario)
router.delete("/usuarios/:id", usuarioController.deleteUsuario);

router.get("/historico", historicoController.indexHistorico);

export default router;
