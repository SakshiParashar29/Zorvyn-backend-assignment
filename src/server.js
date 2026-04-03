require('dotenv').config();

const express = require('express');
const {connectDB} = require('./config/db')
const authRouter = require('./routes/auth-routes');
const userRouter = require('./routes/user-routes');
const transactionRouter = require('./routes/transaction-routes');
const dashboardRouter = require('./routes/dashboard-routes');
const limiter = require('./middleware/rate-limiter');

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(limiter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
