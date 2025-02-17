import { Router } from "express";
import { check } from "express-validator";
import { saveCourse, getCourseByTeacher } from "./course.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("email", "Este no es correo válido").not().isEmpty(),
        validarCampos    
    ],
    saveCourse
)

router.get(
    "/findcourses/:id",
    [
        validarJWT
    ],
    getCourseByTeacher
)
export default router;