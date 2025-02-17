import User from "../users/user.model.js"
import Course from "./course.model.js"

export const saveCourse = async (req, res) => {
    try {
        
        const data = req.body
        const user = await User.findOne({ email: data.email })

        if (!user) {
            return req.status(404).json({
                success: false,
                message: "Profesor o encargado no encontrado"
            })
        }

        const course = new Course({
            ...data,
            coordinator: user._id
        })

        await course.save();

        res.status(200).json({
            success: true,
            course
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al guardar mascota",
            error
        })
    }
}

export const getCourseByTeacher = async (req, res) => {
    try {
        
        const { id } = req.params;

        const courses = await Course.find({ coordinator: id});

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No se encontraron cursos asignados a este profesor"
            });
        }

        res.status(200).json({
            success: true,
            courses
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los cursos",
            error
        });
    }
}