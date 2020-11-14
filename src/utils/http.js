import axios from 'axios';
axios.interceptors.response.use((res) => {
    return res.data
}, (error) => {
    return Promise.reject(error)
})

function get(url, params = {}) {
    return new Promise((reslove, reject) => {
        axios({
            method: 'get',
            url,
            params
        }).then((data) => {
            reslove(data)
        }).catch((err) => {
            reject(err)
        })
    })
}

function post(url, data = {}) {
    return new Promise((reslove, reject) => {
        axios({
            method: 'post',
            url,
            data
        }).then((data) => {
            reslove(data)
        }).catch((err) => {
            reject(err)
        })
    })
}

export default {
    get,
    post
}