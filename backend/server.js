// import 'dotenv/config';
// import http from 'http';
// import app from './app.js';
// import { Server } from 'socket.io';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
// import projectModel from './models/project.model.js';
// import { generateResult } from './services/ai.service.js';

// const port = process.env.PORT || 3000;


// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*'
//     }
// });


// io.use(async (socket, next) => {

//     try {

//         const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
//         const projectId = socket.handshake.query.projectId;

//         if (!mongoose.Types.ObjectId.isValid(projectId)) {
//             return next(new Error('Invalid projectId'));
//         }


//         socket.project = await projectModel.findById(projectId);


//         if (!token) {
//             return next(new Error('Authentication error'))
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         if (!decoded) {
//             return next(new Error('Authentication error'))
//         }


//         socket.user = decoded;

//         next();

//     } catch (error) {
//         next(error)
//     }

// })


// io.on('connection', socket => {
//     socket.roomId = socket.project._id.toString()


//     console.log('a user connected');



//     socket.join(socket.roomId);

//     socket.on('project-message', async data => {

//         const message = data.message;

//         const aiIsPresentInMessage = message.includes('@ai');
//         socket.broadcast.to(socket.roomId).emit('project-message', data)

//         if (aiIsPresentInMessage) {


//             const prompt = message.replace('@ai', '');

//             const result = await generateResult(prompt);


//             io.to(socket.roomId).emit('project-message', {
//                 message: result,
//                 sender: {
//                     _id: 'ai',
//                     email: 'AI'
//                 }
//             })


//             return
//         }


//     })

//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         socket.leave(socket.roomId)
//     });
// });




// server.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// })

import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }

        socket.project = await projectModel.findById(projectId);

        if (!token) {
            return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'));
        }

        socket.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
});

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();
    console.log('a user connected');

    socket.join(socket.roomId);

    socket.on('project-message', async data => {
        const message = data.message;
        const aiIsPresentInMessage = message.includes('@ai');
        
        // This part is unchanged: broadcast the user's message to others
        socket.broadcast.to(socket.roomId).emit('project-message', data);

        if (aiIsPresentInMessage) {
            
            // --- START: Added for Error Handling ---
            try {
                const prompt = message.replace('@ai', '');
                
                // This will now be safely executed.
                const result = await generateResult(prompt);

                // If successful, send the AI's response
                io.to(socket.roomId).emit('project-message', {
                    message: result,
                    sender: {
                        _id: 'ai',
                        email: 'AI'
                    }
                });

            } catch (error) {
                // --- THIS CODE RUNS IF 'generateResult' FAILS ---

                // 1. Log the detailed error on the server for you to see
                console.error("AI Generation Error:", error.message);

                // 2. Send a user-friendly error message to the chat room
                io.to(socket.roomId).emit('project-message', {
                    message: "Sorry, I encountered an error and could not respond. Please check the server logs.",
                    sender: {
                        _id: 'ai-error',
                        email: 'AI System'
                    }
                });
            }
            // --- END: Added for Error Handling ---
            
            return;
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(socket.roomId);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});