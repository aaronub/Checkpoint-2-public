const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  due: Sequelize.DATE,
});

const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Task.belongsTo(Owner);
Owner.hasMany(Task);


Task.clearCompleted = async function() {
    await this.destroy({
      where: { complete: "true" },
    });
  }


// how to know class method or not????????
Task.completeAll = async function() {
  await Task.update(
    {complete: true}, {
     where:{
       complete: false
     } 
    }
  )
  // const tasks = await Task.findAll({
  //   where:{
  //     complete: false
  //   }
  // })
//   console.log('before:', tasks)
//   tasks.forEach(elem => {
//     elem.complete = true
//   })
//   console.log('after:', tasks)
  
//   const tasks = await Task.findAll({
//     where:{
//       complete:false
//     }
//   });
//not changing!!!!
//   console.log('all:', tasks )
}

Task.prototype.getTimeRemaining = function(){
  if (!this.due) {
    return Infinity
  } else {
    return this.due - Date.now()
  }
}

Task.prototype.isOverdue = function (){
  let timeLeft = this.getTimeRemaining()
  if((timeLeft < 0) && (!this.complete)) {
    return true
  } else {
    return false
  }
}

Task.prototype.assignOwner = async function(owner) {
  const task = await this.setOwner(owner)
  // console.log(task)
  // console.log(Object.keys(this.__proto__));
  return task;
}



Owner.getOwnersAndTasks =  async function(){
    const owners = await Owner.findAll({
      include: Task
    // include:{
    //   model: Task
    // }
  })
  // console.log(owners)
  // owners.forEach(elem => {console.log('each:', elem.Tasks)})
  return owners;
}

Owner.prototype.getIncompleteTasks = async function (){
  const tasks = await this.getTasks()
  return tasks.filter(elem => !elem.complete)
  
}

Owner.beforeDestroy(user => {
  if (user.name === 'Grace Hopper')
  throw new Error('Cannot destroy')
})

//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
