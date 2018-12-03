const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
var ObjectId = require("mongodb").ObjectID;

const User = db.User;
const Exercise=db.Exercise;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    addExercise,
    deleteExercise
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}


async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function addExercise(id,  exercise) {
    const user = await User.findById(id);
    // validate
    if (!user) throw 'User not found';
        // copy exercise properties to user
    user.exercises.push(exercise);
    console.log('added', exercise);
    await user.save();
}

async function deleteExercise(id,exercise){
    // console.log('received', exercise);
    const user = await User.findById(id);
   // user.exercises.pull({_id:exercise._id});
      // const ex = await user.Exercise.findById(exercise._id);
    console.log('comparing',exercise._id,'and',user.exercises);
    // for (let i = user.exercises.length - 1; i >= 0; i--) {
    //     if(ObjectId(user.exercises[i]._id)==exercise._id){
    //   console.log('deleted exercise', user.exercises[i]);
    //         user.exercises.remove(i,1);
    //     }
    //   }

    user.exercises.remove(exercise._id);
    // console.log('now at',user.exercises);
   await user.save();
}
