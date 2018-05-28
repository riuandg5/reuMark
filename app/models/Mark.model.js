// require npm packages
var mongoose = require("mongoose");
// mark schema
var markSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    url: String,
    // get id of user logged in who created the mark
    owner: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: "User"
    },
    created: {type: Date, default: Date.now}
});
// export mark schema to use in main app
module.exports = mongoose.model("Mark", markSchema);