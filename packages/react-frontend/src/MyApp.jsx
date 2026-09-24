// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function removeOneCharacter(index) {

        fetch(`http://localhost:8000/users/${characters[index].id}`, {
            method: "DELETE",
        })
            .then(res => {
                if (res.status === 204) {
                    const updated = characters.filter((character, i) => {
                        return i !== index;
                    });
                    setCharacters(updated);
                } else {
                    console.log("Failed to delete user.");
                }
            })
            .catch((error) => console.log(error))

    }

    function updateList(person) {
        postUser(person)
            .then((res) => {
                if (res.status === 201) {
                    return res.json();
                }
            })
            .then((newUser) => {
                if (newUser) {
                    setCharacters([...characters, newUser]);
                }
            })
            .catch((error) => console.log(error));
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="container">
            <Table characterData={characters} removeCharacter={removeOneCharacter} />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;