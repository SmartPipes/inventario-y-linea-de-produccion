import axios from 'axios'

export const getAllInventory = () => {
    //return axios.get('https://smartpipes.cloud/api/inventory/')
    return axios.get('https://smartpipes.cloud/api/inventory/')
}