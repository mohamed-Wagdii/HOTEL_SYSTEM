import express from 'express';
import cors from 'cors';
import { dbConnection } from './dbConnection.js';
import { errorHandler } from './middlewares/errorHandler.js';

import userRouter from './route/user.route.js';
import hotelRouter from './route/hotel.route.js';
import placeRouter from './route/place.route.js';
import experianceRouter from './route/experiance.route.js';
import reservationRouter from './route/reservaiton.route.js';
import reviewRouter from './route/Review.route.js';
import favoriteRouter from './route/favorite.route.js';
import paymentRouter from './route/payment.route.js';
import conversationRouter from './route/conversation.route.js';
import messageRouter from './route/message.route.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/places', placeRouter);
app.use('/api/experiences', experianceRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);

app.use(errorHandler);

export default app;
