const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        validate: {
            validator: function (v) {
                return v.length >= 3
            },
            message: props => `${props.value} is too short. Please enter a username of at least 3 letters`,
        },
    },
    passwordHash: {
        type: String,
    },
    name: String,
    rol: String,
    googleId: { type: String, unique: true },
    picture: { type: String, unique: true },
    email: { type: String, unique: true },
    incidents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Incident'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User