// importing the required modules
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fs = require('fs')
const app = express();

app.use(express.json());
app.use(cors());

// url to connect mongo db atlas
const uri = "mongodb+srv://kumardevada123:kumardevada123Todo@cluster0.tawaeoi.mongodb.net/?retryWrites=true&w=majority";
const uri2 = 'mongodb+srv://kumardevada123:KumarTodo2.o@cluster0.8vsx79d.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri2,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB")).catch(console.error);

const Todo = require('./models/Todo')
const loginSchema = require('./models/loginSchema')

app.get('/admin/kumar',async(req,res) => {
    const users = await loginSchema.find();
    res.send(users);
})

app.get('/users/:email',async(req,res) => {
    const user = await loginSchema.find({email: req.params.email});
    res.send(user);
})

app.get('/users/:id/todos',async(req,res) => {
    const user = await loginSchema.findById(req.params.id);
    res.json(user.todos);
})



app.post('/users/new',async(req,res) => {
    const uname = req.body.username;
    const email = req.body.email;
    const pass = req.body.password;
    if (!uname || !email || !pass) {
        return res.status(400).json({ message: 'username, email and password are required' });
    }
    const user = new loginSchema({
        username: uname,
        email: email,
        password: pass,
        todos: [],
    })
    await user.save();
    res.json(user);
})

app.post('/users/:id/todos/new',async(req,res) => {
    const user = await loginSchema.findById(req.params.id);
    const todo = new Todo({
        text: req.body.text,
    })
    user.todos.push(todo);
    await user.save();
    res.json(todo);
})

app.delete('/users/:userid/todos/delete/:todoid',async(req,res) => {
    try {
        const {userid,todoid} = req.params;
        const user = await loginSchema.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.todos.findIndex(obj => obj.id === todoid);
        if (index === -1) {
            return res.status(404).json({ message: 'Todo not found in the array' });
        }

        user.todos.splice(index,1);
        await user.save();
        res.json(user.todos);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ message: 'an error occured'});
    }
    

})

app.get('/users/:userid/todos/complete/:todoid',async(req,res) => {
    try {
        const {userid,todoid} = req.params;
        const user = await loginSchema.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.todos.findIndex(obj => obj.id === todoid);
        if (index === -1) {
            return res.status(404).json({ message: 'Todo not found in the array' });
        }

        user.todos[index].complete = !user.todos[index].complete;
        await user.save();
        res.json(user.todos);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ message: 'an error occured'});
    }
})

// app.get('/todos',async(req,res) => {
//     const todos = await Todo.find();
//     res.json(todos);
// })


// app.post('/todo/new',(req,res) => {
//     const todo = new Todo({
//         text: req.body.text
//     })
//     todo.save();
//     res.json(todo);
// })


// app.delete('/todo/delete/:id', async (req,res) => {
//     const result = await Todo.findByIdAndDelete(req.params.id);
//     res.json(result);
// })

// app.get('/todo/complete/:id',async (req,res) => {
//     const todo = await Todo.findById(req.params.id);
//     todo.complete = !todo.complete;
//     todo.save();
//     res.json(todo);
// })


// AJAX data request
// app.get('/data',(req,res) => {
//     const data = 'This is a sample data';
//     res.send(data);
// })

// AJAX sample text file request
// app.get('/data-text', (req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'})
//     fs.readFile('./sample.txt',function(error,data) {
//         if(error) {
//             res.writeHead(404)
//             res.write('Error: file not Found')
//         }
//         else {
//             res.write(data)
//         }
//         res.end();
//     })
// });

// AJAX json request
// app.get('/data-json', (req,res) => {
//     const responseData = {
//         name: 'kumar',
//         message: 'This is the data fetched via AJAX in JSON format!',
//         timestamp: new Date().toISOString()
//     };
//     res.json(responseData); // Respond with JSON data
// })

app.listen(3000, () => console.log("Server started on port 3000"));


