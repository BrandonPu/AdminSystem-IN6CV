import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El Nombre es obligatorio"]
    },
    surname: {
        type: String,
        required: [true, "El apellido es obligatorio"]
    },
    username: {
        type: String,
        required: [true, "El Nombre de usuario es obligatorio"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "El correo es Obligatorio"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatorio"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    },
    role: {
        type: String,
        enum: ["STUDENT_ROLE", "TEACHER_ROLE"], 
        default: "STUDENT_ROLE",
    },
    cursos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course",
        default: [] 
    }],
    estado: {
        type: Boolean,
        default: true
    }
});

UserSchema.methods.toJSON = function() {
    const {__v,password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default mongoose.model("User", UserSchema);