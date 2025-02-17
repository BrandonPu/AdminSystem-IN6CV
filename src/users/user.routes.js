import { Router } from "express";
import { check } from "express-validator";
import { getUsers } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-role.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);


export default router;