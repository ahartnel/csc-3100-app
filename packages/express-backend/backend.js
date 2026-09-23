// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { addUser, getUsers, findUserById, removeUser } from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.connect(MONGO_CONNECTION_STRING + "users")
    .catch((error) => console.log(error));

const app = express();
const port = 8000;
const generateId = () => Math.random().toString(36).substring(2, 7);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];

    findUserById(id)
        .then((user) => {
            if (!user) {
                res.status(404).send("Resource not found.");
            } else {
                res.send(user);
            }
        })
        .catch((error) => {
            console.error(error);
        })
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];

    removeUser(id)
        .then((user) => {
            if (!user) {
                res.status(404).send("Resource not found.")
            } else {
                res.status(204).send()
            }
        })
        .catch((error) => {
            console.error(error);
        })
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    getUsers(name, job)
        .then((users) => {
            res.send(users);
        })
        .catch((error) => {
            console.error(error);
        })
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;

    addUser(userToAdd)
        .then((newUser) => {
            res.status(201).send(newUser);
        })
        .catch((error) => {
            console.error(error);
        })
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

const deleteUserById = (id) => {
    const index = users["users_list"].findIndex((user) => user["id"] === id);
    if (index !== -1) {
        users["users_list"].splice(index, 1);
        return true;
    }
    return false;
}