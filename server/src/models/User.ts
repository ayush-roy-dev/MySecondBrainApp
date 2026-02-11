import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface IUser extends mongoose.Document {
    username: string;
    password: string;
    createJWT(): string;
    comparePassword(passwd: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
})

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.createJWT = function(this: IUser) {
    const token = jwt.sign({userId: this._id.toString(), username: this.username},
        process.env.JWT_SECRET as string,
        {expiresIn: process.env.TOKEN_VALIDITY_TIME as string} as any
    )
    return token
}

userSchema.methods.comparePassword = async function(passwd: string){
    return await bcrypt.compare(passwd, this.password)
}

export default mongoose.model('User', userSchema)