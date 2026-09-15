// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const generateId = () => Math.random().toString(36).substring(2, 7);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    const result = deleteUserById(id);

    if (result) {
        res.status(204).send();
    } else {
        res.status(404).send("Resource not found.");
    }
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job != undefined) {
        res.send(findUsersByNameAndJob(name, job));
    } else if (name != undefined) {
        res.send(findUserByName(name));
    } else {
        res.send(users);
    }
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    userToAdd["id"] = generateId();
    const newUser = addUser(userToAdd);
    res.status(201).send(newUser);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor",
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer",
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor",
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspring actress",
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender",
        },
    ],
};

const findUserByName = (name) => {
    return users["users_list"].filter((user) => user["name"] === name);
};

const findUsersByNameAndJob = (name, job) => {
    return users["users_list"].filter(
        (user) => user["name"] === name && user["job"] === job
    );
};


const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
};

const deleteUserById = (id) => {
    const index = users["users_list"].findIndex((user) => user["id"] === id);
    if (index !== -1) {
        users["users_list"].splice(index, 1);
        return true;
    }
    return false;
}