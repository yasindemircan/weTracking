const emitter = require("../helpers/eventEmitter");
const emitterEvent = emitter.myEmitter;


let users = []

const addUser = (id, deviceId, username, roomId, color) => {
    const existingUser = users.find(user => user.deviceId === deviceId)

    if (!username && !roomId) return { error: "Username and room are required" }
    if (!username) return { error: "Username is required" }
    if (!roomId) return { error: "Room is required" }

    if (!existingUser) {
        const user = { id, deviceId, username, color, roomId, status: true }
        users.push(user)
        return { user }
    }

    var newUsers = users.map(user => {
        if (user.deviceId === deviceId) {
            return ({ ...user, id, username, color, roomId, status: true })
        }
    
        return user
    })
    users = [...newUsers]
    return { user: users.find(e => e.id === id) }




}

const getUser = (deviceId, id) => {
    const searchedUser = users.find(element => element.deviceId === deviceId)
    if (searchedUser && searchedUser.id !== id) {
        console.table(users)
        var newUsers = users.map(user => {
            if (user.deviceId === deviceId) {
                console.log(id)
                return ({ ...user, id: id, status: true })
            }
            return user
        })
        users = [...newUsers]
        console.table(newUsers)
        emitterEvent.emit('userList', searchedUser.roomId)
        return newUsers.find(e => e.id === id);

    }

    return searchedUser
}

const deleteUser = (id) => {
    const newData = users.map(user => {
        if (user.id === id && user.status) {
            return ({ ...user, status: false })
        }
        return user
    })
    users = [...newData]
    return users.find(user => user.id === id);
}


const getUsers = (roomId) => users.filter(user => user.roomId === roomId)

module.exports = { addUser, getUser, deleteUser, getUsers }

