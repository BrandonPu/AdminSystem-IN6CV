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

export const deleteCourse = async (req, res) => {
    
    const { id } = req.params;

    try {
        // Buscar el curso a eliminar
        const course = await Course.findById(id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        // Desasignar a los estudiantes del curso
        await User.updateMany(
            { cursos: id },  // Buscar estudiantes que tengan este curso asignado
            { $pull: { cursos: id } }  // Eliminar el curso de su lista de cursos
        );

        // Cambiar el estado del curso a 'false' (marcarlo como eliminado)
        await Course.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            message: "Curso eliminado y estudiantes desasignados exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar curso, intente de nuevo",
            error
        });
    }
};


export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener ID del curso
        const { name, description, status } = req.body;  // Los campos a actualizar

        // Verificar si el curso existe
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        // Actualizar el curso con los nuevos datos
        const updatedCourse = await Course.findByIdAndUpdate(id, { name, description, status }, { new: true });

        // Si el curso tiene estudiantes asignados, actualizar la relación en los estudiantes
        if (updatedCourse) {
            const students = await User.find({ cursos: id });

            if (students.length > 0) {
                // Actualizar el curso en cada estudiante
                for (const student of students) {
                    const index = student.cursos.indexOf(id);
                    if (index !== -1) {
                        student.cursos[index] = updatedCourse._id;  // Reemplazar el curso por el actualizado
                        await student.save();  // Guardar el cambio en el estudiante
                    }
                }
            }
        }

        // Responder con el curso actualizado
        res.status(200).json({
            success: true,
            message: "Curso actualizado con éxito",
            updatedCourse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el curso",
            error: error.message
        });
    }
};
