import { Router } from "express";
import { check } from "express-validator";
import { getUsers, deleteUser, assignCourse, getAssignedCourses, updateUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-role.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

// Ruta para obtener los cursos asignados a un usuario
router.get(
    '/assigned-courses', 
    [
        validarJWT
    ], 
    getAssignedCourses
);

router.delete(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

router.put(
    "/:id",
    validarJWT,  // Middleware para validar el JWT (asegura que el usuario está autenticado)
    [
        check("id", "No es un ID válido").isMongoId(),  // Valida que el ID sea un ID válido de MongoDB
        check("id").custom(existeUsuarioById),  // Valida que el usuario exista en la base de datos
        validarCampos  // Middleware para validar los campos, usando el resultado de `express-validator`
    ],
    updateUser  // El controlador que maneja la lógica de actualización del usuario
);

router.post(
    "/assign-course", 
    [
    validarJWT,    
    ], 
    assignCourse
);

export default router;