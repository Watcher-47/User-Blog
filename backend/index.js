import express from 'express';
import routes from './src/routes/index.js';
import { env } from './src/utils/dotenv.js';
import cors from 'cors';
import { connectDb } from './src/utils/db.js';

const server = express();

server.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
server.use(express.json());

server.use('/api', routes);

const startServer = async () => {

    try {
        const conn = await connectDb();

        server.listen(env.port, () => {
            console.log(`http://localhost:${env.port}`);
        });

    } catch (error) {
        console.error('Error starting the server:', error);
    }
}

startServer();

server.get('/health', (req, res) => {
    res.status(200).json({ message: 'server is running!', success: true });
});


//get users
// server.get('/users', (req, res) => {
//     try {
//         if (users.length === 0) {
//             res.status(200).json({ data: users, success: true, message: 'no users found!' });
//         } else {
//             res.status(200).json({ data: users, success: true, message: 'users fetched successfully' });
//         }

//     } catch (error) {
//         res.status(500).json({ data: [], success: false, message: error.message });
//     }
// });

//create user
// server.post('/users', (req, res) => {
//     try {
//         //1
//         const { id, name } = req.body;

//         //2
//         // const user = req.body;
//         // const id = user.id;
//         // const name = user.name;

//         if (!name || !id) {
//             res.status(400).json({
//                 data: [],
//                 success: false,
//                 message: 'name and id are required!'
//             });
//         } else {
//             const newUser = { id, name };

//             users.push(newUser);
//             res.status(201).json({
//                 data: newUser,
//                 success: true,
//                 message: 'user created successfully'
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             data: [],
//             success: false,
//             message: error.message
//         });
//     }
// });


//update user
// server.put('/users/:id', (req, res) => {
//     try {
//         const id = Number(req.params.id);
//         // console.log(typeof id);
//         // console.log(id);

//         // const id = req.params.id;
//         const { name } = req.body;

//         if (!name || !id) {
//             res.status(400).json({
//                 data: [],
//                 success: false,
//                 message: 'name and id are required!'
//             });
//         } else {
//             const userIndex = users.findIndex(user => user.id === id);

//             if (userIndex === -1) {
//                 res.status(404).json({
//                     data: [],
//                     success: false,
//                     message: 'user not found!'
//                 });
//             } else {
//                 users[userIndex].name = name;
//                 res.status(200).json({
//                     data: users[userIndex],
//                     success: true,
//                     message: 'user updated successfully'
//                 });
//             }
//         }
//     } catch (error) {
//         res.status(500).json({
//             data: [],
//             success: false,
//             message: error.message
//         });
//     }
// });

//delete user
// server.delete('/users/:id', (req, res) => {
//     try {
//         const id = Number(req.params.id);

//         if (!id) {
//             res.status(400).json({
//                 data: [],
//                 success: false,
//                 message: 'id is required!'
//             });
//         } else {
//             const userIndex = users.findIndex(user => user.id === id);

//             if (userIndex === -1) {
//                 res.status(404).json({
//                     data: [],
//                     success: false,
//                     message: 'user not found!'
//                 });
//             } else {
//                 const deletedUser = users.splice(userIndex, 1);
//                 res.status(200).json({
//                     data: deletedUser[0],
//                     success: true,
//                     message: 'user deleted successfully'
//                 });
//             }
//         }
//     } catch (error) {
//         res.status(500).json({
//             data: [],
//             success: false,
//             message: error.message
//         });
//     }
// });

// server.get('/parameters/:name/:id', (req, res, next) => {
//     console.log("name: " + req.params.name);
//     console.log("id: " + req.params.id);
//     console.log("query: " + req.query.search);
//     console.log("query: " + req.query.q);

//     // console.log("hello");
//     next();
// });
