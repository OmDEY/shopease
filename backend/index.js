const express = require('express');
const bannerImageRoutes = require('./routes/bannerImagesRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/UserRoutes');
const connect = require('./config/db');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// MongoDB connection
connect().then(() => {

    app.use('/api/bannerImages', bannerImageRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/users', userRoutes);

    app.get('/', async (req, res) => {
        res.send('Hello World');
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.log('An Error Occured while connecting to the database', err)
});
