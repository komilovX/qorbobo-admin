<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu df">
      <div class="avatar-wrapper" @click="$emit('onBellClick', true)">
        <el-badge :value="value" class="item">
          <img src="/bell.svg" class="bell-avatar">
        </el-badge>
      </div>
      <div class="avatar-wrapper" @click="$emit('onMessageClick', true)">
        <el-badge :value="mValue" class="item">
          <img src="/email.svg" class="bell-avatar">
        </el-badge>
      </div>
      <div class="avatar-wrapper" @click="logout">
        <img src="/user.svg" class="user-avatar">
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'

export default {
  data() {
    return {
    }
  },
  props: {
    value: String,
    mValue: String
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    sidebar() {
      return this.$store.getters['app/sidebar']
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$confirm('Вы уверены что хотите выйти из система?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(async () => {
        this.$store.dispatch('auth/logout')
        this.$router.push('/login?message=logout')
      })
    }
  }
}
</script>
<style>
  .item {
    margin-top: 5px;
    margin-right: 18px;
  }
  .item .el-badge__content.is-fixed{
    top:12px;
    right: 25px;
  }
</style>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    // &:focus {
    //   outline: none;
    // }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .avatar-wrapper {
      position: relative;
    }
    .user-avatar {
      cursor: pointer;
      width: 30px;
      height: 30px;
      margin: 0 1rem;
      margin-top: 15px;
    }
    .bell-avatar {
      cursor: pointer;
      width: 30px;
      height: 26px;
      margin: 13px .5rem 0 0;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>
