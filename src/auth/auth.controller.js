import { hash, verify} from "argon2";
import Usuario from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    
    const { email, password, username } = req.body;

    try {
        
        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });

        if(!user){
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }

        if(!user.estado){
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            });
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarJWT( user.id );

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso!!',
            userDetails: {
                username: user.username,
                email: user.email,
                role: user.role,
                cursos: user.cursos,
                token: token,
                profilePicture: user.profilePicture
            }
        })
        
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const register = async (req, res) => {
    try {
        const data = req.body;

        const existingUser = await Usuario.findOne({
            $or: [{ username: data.username }, { email: data.email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'El correo o el nombre de usuario ya están registrados.'
            });
        }

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role,
            cursos: []
        });

        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            userDetails: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "El nombre de usuario o el correo ya están en uso",
                error: error.message
            });
        }

        return res.status(500).json({
            message: "Error al registrar el usuario",
            error: error.message
        });
    }
};