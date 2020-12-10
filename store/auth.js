import Cookie from 'cookie'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'

export const state = () => ({
  token: true,
  role: null,
})

export const mutations = {
  setToken(state, token) {
    this.$axios.setToken(token, 'Bearer')
    Cookies.set('jwt-token',token)
    state.token = token
  },
  clearToken(state) {
    this.$axios.setToken(false)
    Cookies.remove('jwt-token')
    state.token = null
  },
  setUserRole(state, role) {
    state.role = role
  }
}

export const actions = {
  async login ({commit}, formData) {
    try {
      const token = await this.$axios.$post('api/auth/login', formData)
      const { role } = jwtDecode(token)
      commit('setToken', token)
      commit('setUserRole', role)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  autoLogin({dispatch, commit}){
    const cookieStr = document.cookie
    const cookie = Cookie.parse(cookieStr || '') || {}
    const token = cookie['jwt-token']
    if (isJWTValid(token)) {
      const { role } = jwtDecode(token)
      commit('setToken', token)
      commit('setUserRole', role)
    }
    else{
      dispatch('logout')
    }
  },
  async create({commit}, formData) {
    try {
     return await this.$axios.$post('api/auth/create', formData)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findAll({commit}) {
    try {
     return await this.$axios.$get('api/auth/admins')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async deleteById({commit}, id) {
    try {
     return await this.$axios.$delete(`api/auth/admin/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findById({commit}, id) {
    try {
     return await this.$axios.$get(`api/auth/admin/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async updateById({commit}, {id, formData}) {
    try {
      return await this.$axios.$put(`api/auth/admin/${id}`, formData)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  logout({commit}) {
    commit('clearToken')
  }
}

export const getters = {
  isAuthticated: state => !!state.token,
  token: state => state.token,
  userRole: state => state.role
}

function isJWTValid(token){
  if (!token) {
    return false
  }
  const jwtData = jwtDecode(token)||{}
  const expires = jwtData.exp  || 0
  return (new Date().getTime()/1000)<expires

}
