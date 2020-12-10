import Vue from "vue";
Vue.directive("image", {
  bind: (el, binding, vnode) => {
    el.setAttribute("src", `${process.env.baseUrl}/uploads/${binding.value}`);
  },
  update: (el, binding, vnode) => {
    el.setAttribute("src", `${process.env.baseUrl}/uploads/${binding.value}`);
  }
});
