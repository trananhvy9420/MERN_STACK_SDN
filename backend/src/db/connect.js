const mongoose = require('mongoose');
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/MERN_STACK_SDN';
const connect = mongoose.connect(uri);
module.exports = connect;
