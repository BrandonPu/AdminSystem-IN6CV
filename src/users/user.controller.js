import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js"
import Course from "../courses/course.model.js"

export const getUsers = async (req = request, res = response) => {
    try {
        
        const { limite = 10, desde = 0} = req.query;
        const query = { estado: true};

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener usuarios",
            error
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });

        const autheticatedUser = req.user;

        res.status(200).json({
            success: true,
            msg: "Usario desactivado",
            user,
            autheticatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al Desactivar Usuario",
            error
        })
    }   
}

export const assignCourse = async (req, res) => {
    try {
        
        const { studentId, courseId } = req.body;

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Estudiante no encontrado"
            });
        }

        if (!Array.isArray(student.cursos)) {
            student.cursos = [];
        }

        const MAXCOURSES = 3;

        const totalCourses = student.cursos.length + courseId.length;

        if (totalCourses > MAXCOURSES) {
            return res.status(400).json({
                success: false,
                message: `El Estudiante Tiene El Máximo de ${MAXCOURSES} Cursos Asignados`
            });
        }

        const newCourseIds = courseId.filter(id => !student.cursos.includes(id));

        if (newCourseIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "El estudiante ya tiene los cursos seleccionados"
            });
        }

        for (const id of newCourseIds) {
            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Curso No Encontrado"
                });
            }

            if (!student.cursos.includes(id)) {
                student.cursos.push(id);
            }
        }

        await student.save();

        res.status(200).json({
            success: true,
            message: "Cursos Asignados Al Estudiante Exitosamente",
            student,
            courseId
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Al Asignar Los Cursos",
            error
        });
    }
}
