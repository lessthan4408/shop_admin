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

function upload(url, data = {}) {
    return new Promise((reslove, reject) => {
        let formdata = new FormData()
        for (let key in data) {
            formdata.append(key, data[key])
        }
        axios({
            method: 'post',
            url,
            data: formdata,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((data) => {
            reslove(data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export default {
    get,
    post,
    upload
}