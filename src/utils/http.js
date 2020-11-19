import axios from 'axios';
import qs from 'qs';
import store from '@/store';

//请求拦截器
axios.interceptors.request.use((config) => {
    let token = localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo')).token : '';
    config.headers["Authorization"] = token;
    return config;
}, (error) => {
    return Promise.reject(error)
})

//响应拦截器
axios.interceptors.response.use((res) => {
    if (res.data.code == 403) {
        store.commit('logout')
    }
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
            data: qs.stringify(data)
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