const { response } = require('express')
const express = require('express')
const { request } = require('http')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())
app.use(cors())

const dbPath = path.join(__dirname, 'crudDatabase.db')
let db = null
const PORT = process.env.PORT || 3030

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        })
        app.listen(PORT, () => {
            console.log("Server Running at http://localhost:3030/")
        })
    } catch (error) {
        console.log(`DB Error: ${error}`)
        process.exit(1)
    }
}

initializeDBAndServer()

app.get('/crud/user-details/', async (request, response) => {
    const getUserDetailsQuery = 'SELECT * FROM user_details;'
    const data = await db.all(getUserDetailsQuery)
    response.send(data)
})

app.post('/crud/create-user/', async (request, response) => {
    const {id, name, gender, email, mobile_number, dob} = request.body
    const getCreateUserDetailsQuery = `INSERT INTO user_details (id, name, gender, email, mobile_number, dob) VALUES (${id}, '${name}', '${gender}', '${email}', ${mobile_number}, '${dob}');`
    await db.run(getCreateUserDetailsQuery)
    response.send('User Created Successfully')
})

app.post('/crud/update-user/:userId/', async (request, response) => {
    const {userId} = request.params
    const {name, gender, email, mobile_number, dob} = request.body
    const getUpdateUserDetailsQuery = `UPDATE user_details SET name = '${name}', gender = '${gender}', email = '${email}', mobile_number = '${mobile_number}', dob = '${dob}' WHERE id = ${userId};`
    await db.run(getUpdateUserDetailsQuery)
    response.send("User Details Updated Successfully")
})

app.delete('/crud/delete-user/:userId/', async (request, response) => {
    const {userId} = request.params
    const getDeleteUserQuery = `DELETE FROM user_details WHERE id = ${userId};`
    await db.run(getDeleteUserQuery)
    response.send('User Details Deleted Successfully')
})
