require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');


const PORT = process.env.PORT || 3000;

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Task Manager API running on port ${PORT}`);
    });
}

startServer();
