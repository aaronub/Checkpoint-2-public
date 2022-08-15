const express = require('express');
const router = express.Router();
const todos = require('../models/express-models/todos');
module.exports = router;

// write your routes here. Feel free to split into multiple files if you like.
router.get('/', (req,res) => {
    // res.status(200).send([]);
    // testpecs explanation?????????
    res.send(todos.listPeople());
})

router.get('/:name/tasks',  (req,res) => {
    //not req.params.name/tasks!!!!!
        const name =  req.params.name;    
        // console.log(tasks)
        // console.log('hello', todos.listPeople())
        // if (!(name in todos)) { ???????
        if (!todos.listPeople().includes(name)){
            res.sendStatus(404)
        } else {
            res.send(todos.list(name));             
        }


        // if (!todos.listPeople().includes(name)){
        //     //  res.sendStatus(404);
        //     res.status(404).send("Sorry can't find that!");
        // } else {
        //     res.send(todos.list(name));            
        // }

})

// Dear FullStack Staff, Pls help, why req.body is alwasy {}???????????????????????
router.post('/:name/tasks', (req, res) => {
    console.log('post:')
    const name = req.params.name
    const task = req.body
    console.log('hi', req.body.content)

    if (task.content) {
        todos.add(name, task)
        res.status(201).send(todos.list(name).slice(-1)[0])
    } else {
        res.sendStatus(400)
    }
})

router.put('/:name/tasks/:num', (req, res) => {
    // console.log(456)
    const name =  req.params.name
    const num = Number(req.params.num)
    // console.log('name:', name)
    // console.log(('num:', num))
    // console.log(todos.list(name)[num])
    todos.list(name)[num].complete = true;
    // For what??????????????/
    res.sendStatus(200)
})

router.delete('/:name/tasks/:num', (req, res) => {
    const name =  req.params.name
    const num = Number(req.params.num)
    todos.list(name).splice(num, 1)
    res.sendStatus(204)
    
})

router.get('/:name/tasks?status=complete', (req, res) => {
    console.log('extra')
    const name = req.params.name;
    if((req.query.status === 'complete')) {
        const rows = todos.list(name).filter(elem => elem.complete)
        res.send(rows)
    }
})

router.get('/:name/tasks?status=active', (req, res) => {

    if((req.query.status === 'active')) {
        console.log('extra2')
        const name = req.params.name;
        const rows = todos.list(name).filter(elem => !elem.complete)
        res.send(rows)
    }
})

