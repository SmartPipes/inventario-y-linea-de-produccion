import axios from 'axios'

export const getAllInventory = () => {
    return axios.get('http://127.0.0.1:8080/api/inventory/')
}