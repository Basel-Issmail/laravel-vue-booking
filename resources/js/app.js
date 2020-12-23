require('./bootstrap');

import VueRouter from "vue-router";
import Vuex from 'vuex';
import router from "./routes";
import Index from "./Index";
import moment from "moment";

import FatalError from "./shared/components/FatalError";
import Success from "./shared/components/Success";
import starRating from "./shared/components/StarRating";
import ValidationErrors from './shared/components/ValidationErrors';
import storeDefinition from './store';

window.Vue = require('vue');

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.filter('fromNow', value => moment(value).fromNow())
Vue.component('star-rating', starRating);
Vue.component('fatal-error', FatalError);
Vue.component('success', Success);
Vue.component('v-errors', ValidationErrors);

const store = new Vuex.Store(storeDefinition);

window.axios.interceptors.response.use(
    response => response,
    error => {
        if (401 === error.response.status) {
            store.dispatch('logout');
        }

        return Promise.reject(error);
    }
);

const app = new Vue({
    el: '#app',
    router,
    store,
    components: {
        index: Index
    },
    async beforeCreate() {
        this.$store.dispatch('loadStoredState');
        this.$store.dispatch('loadUser');
    }
});
