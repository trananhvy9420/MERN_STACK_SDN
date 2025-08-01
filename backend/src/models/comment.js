const mongoose = require("mongoose");
const schema = mongoose.Schema;
const commentSchema = new schema(
  {
    rating: { type: Number, min: 1, max: 3, require: true },
    content: { type: String, require: true },
    disable: { type: Boolean, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      require: true,
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
