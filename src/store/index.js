import { createApi } from "@/api";
import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const api = createApi();

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    isLogin: false,
    videoList: [],
    somedayPlan: [],
    date: "",
    user : {
      id : '',
      nickname: '',
      introduce:''
    },
    reviews: [],
    userProfile : {
      id : '',
      nickname: '',
      introduce: ''
    },
    followingList: [],
    followerList : [],
    TimelineList : [],
    check: false,
  },
  
  mutations: {
    USER_LOGIN(state, token) {
      state.isLogin = true;
      sessionStorage.setItem("access-token", token);
      api.defaults.headers["access-token"] = token;
    },
    USER_LOGOUT(state) {
      state.isLogin = false;
      sessionStorage.removeItem("access-token");
      api.defaults.headers["access-token"] = "";
      state.user = {
        id : '',
        nickname: '',
        introduce:''
      }
      state.TimelineList= [];
      state.somedayPlan = [];
      alert("로그아웃 됐습니다.");
    },
    SHOW_VIDEOS(state, videos) {
      state.videoList = videos;
    },
    GET_PLAN(state, data) {
      state.somedayPlan = data;
    },
    SET_TODAY(state, date) {
      state.date = date;
    },
    SET_DATE(state, date) {
      state.date = date;
    },
    GET_USER(state, data) {
      state.user.id = data.id;
      state.user.nickname = data.nickname;
      state.user.introduce = data.introduce;
    },
    GET_REVIEW(state, data) {
      state.reviews = data;
    },
    GET_USER_PROFILE(state, data){
      state.userProfile.id = data.id;
      state.userProfile.nickname = data.nickname;
      state.userProfile.introduce = data.introduce;
    },
    GET_FOLLOWER(state, data) {
      state.followerList = data;
    },
    GET_FOLLOWING(state, data) {
      state.followingList = data;
    },
    GET_TIMELINELIST(state, data){
      state.TimelineList = data;
      console.log(state.TimelineList);
    },
    GET_CHECK(state, data) {
      state.check = data;
    },
    UPDATE_PROFILE(state, data) {
      state.user.nickname = data.nickname;
      state.user.introduce = data.introduce;
      state.check = false;
    }
  },
  
  actions: {
    login({ commit }, user) {
      api({
        url: `/login`,
        method: "POST",
        data: user,
      }).then(({ data }) => {
        commit("USER_LOGIN", data["access-token"]);
        alert("오늘도 우리와 함께 신나게 운동해봐요!");
        router.push({ name: "home" });
        this.dispatch('who', user.id);
        this.dispatch('getFollower', user);
        this.dispatch('getFollowing', user);
      })
    },
    who({commit}, id) {
      api({
        url:`user/${id}`,
        method: "GET",
      }).then((res) =>{
        commit("GET_USER", res.data);
      })
    },
    join({ commit }, user) {
      api({
        url: `/join`,
        method: "POST",
        data: user,
      }).then(() => {
        router.push({ name: "login" });
        commit();
      });
    },

    showVideos({ commit }, condition) {
      api({
        url: `/video/search`,
        method: "POST",
        data: condition,
      })
        .then((res) => {
          commit("SHOW_VIDEOS", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getPlan({ commit }, date) {
      api({
        url: `/plan`,
        method: "POST",
        data: {date : date},
      }).then((res) => {
        commit("GET_PLAN", res.data);
        commit("SET_TODAY", date);
      }).catch((error) => {
        console.log(error);
      });
    },
    makePlan({commit}, plan) {
      api({
        url: `/plan/write`,
        method: "POST",
        data: plan,
      }).then(() => {
        router.push({ name: "home"});
        commit();
      })
    },
    changeDate({commit}, date) {
      commit("SET_DATE", date);
    },
    writeReview({commit}, data) {
      api({
        url: `review/write`,
        method: "POST",
        data: data,
      }).then((res) => {
        router.push({ name : "review"});
        commit();
        console.log(res)
      })
    },
    getReview({commit}) {
      api({
        url: `review`,
        method: "GET",
      }).then((res) => {
        commit("GET_REVIEW", res.data);
      })
    },
    follow({commit}, to){
      api({
        url: `follow/write`,
        method: "POST",
        data : to,
      }).then((res) => {
        console.log(res);
        commit('FOLLOW', to);
        this.dispatch('getFollowing', this.state.user);
      })
    },
    getMyProfile({commit}){
      api({
        url: `user`,
        method: "GET",
      }).then((res) => {
        commit('GET_USER_PROFILE',res.data);
      })
    },
    writeComment({commit}, payload) {
      api({
        url: `comment/write`,
        method: "POST",
        data: payload
      }).then((res) => {
        console.log(res);
        commit();
      })
    },
    deleteComment({commit}, no){
      api({
        url: `comment/delete/${no}`,
        method: "DELETE",
      }).then((res) => {
        console.log(res);
        commit();
      })
    },
    updateComment({commit}, payload) {
      api({
        url: `comment/update`,
        method: "PUT",
        data: payload,
      }).then(() => {
        commit();
      })
    },
    updateReview({commit}, review) {
      api({
        url: `review/update`,
        method: "PUT",
        data: review,
      }).then(() => {
        commit();
      })
    },
    deleteReview({commit}, no) {
      api({
        url: `review/delete/${no}`,
        method: "DELETE",
      }).then(() => {
        commit();
      })
    },
    getUserProfile({commit}, userId) {
      api({
        url:`user/${userId}`,
        method: "GET",
      }).then((res) =>{
        commit("GET_USER_PROFILE", res.data);
      })
    },
    getFollower({commit},user){
      api({
        url:`follower/${user.id}`,
        method: "GET",
      }).then((res) =>{
        commit("GET_FOLLOWER", res.data);
      })
    },
    getFollowing({commit}, user){
      api({
        url:`following/${user.id}`,
        method: "GET",
      }).then((res) =>{
        commit("GET_FOLLOWING", res.data);
      })
    },
    unFollow({commit}, followingUser) {
      api({
        url: `follow/delete/${followingUser}`,
        method: "DELETE",
      }).then(() => {
        this.dispatch('getFollowing', this.state.user);
        commit();
      })
    },
    getTimelineList({commit}){
      api({
        url: `review/timeline`,
        method: "GET",
      }).then((res)=>{
        commit("GET_TIMELINELIST",res.data);
      })
    },
    checkPassword({commit}, user) {
      api({
        url: `user/identify`,
        method: "POST",
        data: user,
      }).then((res) => {
        commit("GET_CHECK", res.data);
      })
    },
    updateProfile({commit}, profile) {
      api({
        url: `user/update`,
        method: "PUT",
        data: profile,
      }).then(() => {
        commit("UPDATE_PROFILE", profile);
      })
    },
    deleteUser({commit}) {
      api({
        url: `user/delete`,
        method : "DELETE",
      }).then(() =>{
        commit();
      })
    },
  },
  modules: {},
});
