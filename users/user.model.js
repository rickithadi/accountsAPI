const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exercise= new Schema({
    name: { type: String, required: true },
    remarks: { type: String },
    weight:{ type: Number, required: true },
    reps:{ type: Number, required: true },
    sets:{ type: Number, required: true },
    createdDate: { type: Date, default: Date.now }
});
const schema = new Schema({
    username: { type: String, unique: true, required: true },
     hash: { type: String, required: true },
   createdDate: { type: Date, default: Date.now },
    exercises: [exercise]

});



schema.set('toJSON', { virtuals: true });
var Exercise = mongoose.model('Exercise', exercise);

module.exports = mongoose.model('User', schema);
