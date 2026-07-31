require('dotenv').config();
const app = require('./src/app');
const connectionTOdb = require('./config/database.js');

connectionTOdb();
console.log(__filename);
app.listen(3000, () => {
    console.log("🚀 MANISH SERVER STARTED");
});
app.get('/', (req, res) => {
    res.send('Welcome to the Interview AI Backend!');
});

