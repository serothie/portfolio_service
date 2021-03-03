import React from "react";
import axios from "axios"

const apiUrl = 'http://localhost:5000/'

export function createInfo(url, data, token) {
    axios.post(apiUrl+url, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export function readInfo(url, email) {
    axios.get(apiUrl+url, {
        params: {
            user_email: email
        }
    })
}

// export function update(url, data) {
//     axios.put(apiUrl+url, data)
// }

export function deleteInfo(url, id) {
    axios.delete(apiUrl+url, {
        params: {
            id: id
        }
    })
}