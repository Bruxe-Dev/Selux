import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: [5, 'Name must not be less than 5 Characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        minLength: [10, 'Number must not be under 10 digits']
    },
    password: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Paasword is Required']
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: Product
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    }
)

sellerSchema.pre('save', async () => {
    if (!this.isModified('password')) {
        return
    }

    const salt = await bcrypt.genSalt(12)
    this.password = bcrypt.hash(this.password, salt)
})

sellerSchema.methods.matchPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}

userSchema.methods.getSignedJwtToken = function () {
    const secret = process.env.JWT_SECRET;
    const expire = process.env.JWT_EXPIRE;

    if (!secret) {
        throw new Error('JWT_SECRET is required');
    }

    const options = {
        expiresIn: expire
    };

    return jwt.sign(
        { id: this._id.toString() },
        secret,
        options
    );
};
const Seller = mongoose.model('Seller', sellerSchema)