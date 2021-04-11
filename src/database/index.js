import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/ufespay', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.on('open', () => console.log('Conected to mongoDB with success!'));