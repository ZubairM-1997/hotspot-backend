const express = require('express');

const connectDB = require('./config/db')

const app = express();

//connect database
connectDB();

// 	Init Middleware
app.use(express.json({extended: false}));


app.get('/', (req, res) => res.json({message: "Hello world"}))



//define our routes
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/destinations', require('./routes/destinations'))





const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server started on port ${PORT}`));

