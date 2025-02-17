import { Schema, model } from "mongoose";

const CourseSchema = Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        coordinator: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        status: {
            type: Boolean,
            default: true
        }
    }, 
    {
    timestamps: true,
    versionKey: false
    }
);

export default model("Course", CourseSchema);