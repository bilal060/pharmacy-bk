const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const globalErrorHandler = require('./Controllers/errorController');
const drugRoutes = require('./Routes/drugRoutes');
const ddiRoutes = require('./Routes/ddiRoutes');
const icdRoutes = require('./Routes/icdRoutes');
const clinicRoutes = require('./Routes/clinicRoutes');
const userRoutes = require('./Routes/userRoutes');

const app = express()
app.use(cors())
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
app.use(express.json())
app.use('/api/v1/drug', drugRoutes);
app.use('/api/v1/ddi', ddiRoutes);
app.use('/api/v1/icd', icdRoutes);
app.use('/api/v1/clinic', clinicRoutes);
app.use('/api/v1/user', userRoutes);


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log(`Connected to db on port ${process.env.PORT}`)
    app.listen(process.env.PORT || 4000)
  })
  .catch((err) => {
    console.log(err)
  })
  app.use(globalErrorHandler)