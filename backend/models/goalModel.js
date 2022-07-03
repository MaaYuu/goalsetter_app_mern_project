const mongoose = require('mongoose')

// Defining the schema for the collection
const goalSchema = mongoose.Schema(
  {
    // User associated with a goal by this way
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: [true, 'Please add a text value'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Goal', goalSchema)

// First, related model added to the model
// Then, it is added under routes folder.