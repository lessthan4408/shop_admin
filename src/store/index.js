// import Vue from 'vue';
// import Vuex from 'vuex';
// import axios from "axios";
// import router from '../router'
// import { Message } from "element-ui"
// Vue.use(Vuex);



// let store = new Vuex.Store({
//     strict: true,
//     state: {
//         userinfo: localStorage.getItem('userinfo') ? localStorage.getItem('userinfo') : {}
//     },
//     getters: {
//         username(state) {
//             return state.userinfo.username
//         },
//         menus(state) {
//             return state.userinfo.menus
//         }
//     },
//     mutations: {
//         setinfo(state, info) {
//             state.userinfo = info
//         },
//         logout(state) {
//             localStorage.clear()
//             state.userinfo = {}
//             router.replace('/login')
//         }
//     },
//     actions: {
//         login(context, formdata) {
//             axios.post("/api/userlogin", formdata).then((res) => {
//                 console.log(res.data);
//                 if (res.data.code == 200) {
//                     localStorage.setItem("userinfo", JSON.stringify(res.data.list));
//                     context.commit('setinfo', res.data.list)
//                     router.replace("/");
//                 } else {
//                     Message({
//                         message: res.data.msg,
//                         type: "error",
//                     });
//                 }
//             });
//         }
//     }
// })

// console.log(JSON.parse(localStorage.getItem("userinfo")));

// export default store
import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import router from "@/router"
import { Message } from "element-ui"
Vue.use(Vuex)

let store = new Vuex.Store({
    state: {
        userinfo: localStorage.getItem("userinfo") ? JSON.parse(localStorage.getItem("userinfo")) : {}
    },
    getters: {
        username(state) {
            return state.userinfo.username;
        },
        menus(state) {
            return state.userinfo.menus;
        }
    },
    mutations: {
        setinfo(state, info) {
            state.userinfo = info;
        },
        logout(state) {
            localStorage.clear();
            state.userinfo = {};
            router.replace("/login")
        }
    },
    actions: {
        login(context, formdata) {
            axios.post("/api/userlogin", formdata).then((res) => {
                if (res.code == 200) {
                    localStorage.setItem("userinfo", JSON.stringify(res.list))
                    context.commit("setinfo", res.list)
                    router.replace("/")
                } else {
                    Message({
                        message: res.msg,
                        type: "error"
                    })
                }
            })
        }
    }

})
// console.log(store.state.userinfo);
console.log(JSON.parse(localStorage.getItem('userinfo')));

export default store