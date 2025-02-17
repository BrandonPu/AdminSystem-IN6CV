import { Router } from "express";
import { check } from "express-validator";
import { getUsers, deleteUser, assignCourse, getAssignedCourses } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-role.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

// Ruta para obtener los cursos asignados a un usuario
router.get('/assigned-courses', [validarJWT], getAssignedCourses);

router.delete(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

router.post(
    "/assign-course", 
    [
    validarJWT,    
    ], 
    assignCourse
);

export default router;