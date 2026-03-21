import mongoose from "mongoose"

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["seller", "client", "admin"],
        default: "seller"
    },
    phone: {
        type: String,
        required: false
    }
})

export default mongoose.model("Seller", sellerSchema)
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