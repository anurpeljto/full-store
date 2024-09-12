const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        minLength: 3,
        trim: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },

    image: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Product', ProductSchema);