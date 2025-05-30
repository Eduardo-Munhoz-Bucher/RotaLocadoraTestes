import { body, validationResult } from "express-validator";

export const validarVeiculo = [
  body("placa")
    .notEmpty()
    .withMessage("Campo obrigatório")
    .matches(/^[A-Z]{3}-\d{4}$|^[A-Z]{3}\d{1}[A-J]{1}\d{2}$/)
    .withMessage("Formato inválido da placa (ABC-1234 ou ABC1C23)"),

  body("marca")
    .notEmpty()
    .withMessage("Campo obrigatório")
    .isLength({ max: 45 })
    .withMessage("Máximo de 45 caracteres"),

  body("modelo")
    .notEmpty()
    .withMessage("Campo obrigatório")
    .isLength({ max: 45 })
    .withMessage("Máximo de 45 caracteres"),

  body("ano")
    .notEmpty()
    .withMessage("Campo obrigatório")
    .isInt({ min: 1900, max: 2025 })
    .withMessage("Ano inválido"),

  body("cor")
    .notEmpty()
    .withMessage("Campo obrigatório")
    .isLength({ max: 20 })
    .withMessage("Máximo de 20 caracteres"),

  body("proposito_uso")
    .notEmpty()
    .withMessage("Campo obrigatório")
    .isLength({ max: 45 })
    .withMessage("Máximo de 45 caracteres"),

  body("latitude")
    .notEmpty()
    .withMessage("Campo obrigatório")
    .isLength({ min: 10 })
    .withMessage("Minimo de 10 caracteres")
    .isLength({ max: 45 })
    .withMessage("Máximo de 45 caracteres"),

  body("longitude")
    .notEmpty()
    .withMessage("Campo obrigatório")
    .isLength({ min: 10 })
    .withMessage("Minimo de 10 caracteres")
    .isLength({ max: 45 })
    .withMessage("Máximo de 45 caracteres"),

  body("conforto")
    .notEmpty()
    .withMessage("Campo obrigatório")
    .isInt({ min: 1, max: 5 })
    .withMessage("O conforto deve ser um número inteiro entre 1 e 5."),

  body("veiculo_zero")
    .notEmpty()
    .withMessage("Campo obrigatório.")
    .isBoolean()
    .withMessage("O campo deve conter um valor booleano (1 / 0)."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: errors.array(),
      });
    }
    next();
  },
];
