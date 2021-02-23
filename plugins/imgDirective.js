import Vue from "vue";
Vue.directive("image", {
  bind: (el, binding, vnode) => {
    el.setAttribute(
      "src",
      `${window.location.origin}/uploads/${binding.value}`
    );
  },
  update: (el, binding, vnode) => {
    el.setAttribute(
      "src",
      `${window.location.origin}/uploads/${binding.value}`
    );
  }
});
