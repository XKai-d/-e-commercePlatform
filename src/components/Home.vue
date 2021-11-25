<template>
  <el-container class="home_container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/images/homeico.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <div>
        <span class="span_login_user">{{ username }}</span>
        <el-button type="info" @click="logout">退出登录</el-button>
      </div>
    </el-header>
    <!-- 内容区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_button">
          <i
            v-show="menu_show"
            @click="changeStatus"
            class="el-icon-s-unfold menu_show_btn"
          ></i>
          <i
            v-show="menu_hide"
            @click="changeStatus"
            class="el-icon-s-fold menu_hide_btn"
          ></i>
        </div>
        <!--侧边栏导航菜单 -->
        <el-menu
          :default-active="pathurl"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EEF"
          unique-opened
          :collapse-transition="false"
          :router="true"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menulist"
            :index="item.id + ''"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iocnsObjct[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subitem in item.children"
              :index="'/' + subitem.path"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ subitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="(item, i) in breadList"
            :key="i"
            :to="{ path:item.path}"
            >{{ item.meta.title }}</el-breadcrumb-item
          >
        </el-breadcrumb>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },
  data() {
    return {
      username: '',
      isCollapse: false,
      menu_show: false,
      menu_hide: true,
      // 左侧菜单数据
      menulist: [],
      iocnsObjct: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      pathurl: '',
      // 路由集合
      breadList: [],
    }
  },
  methods: {
    getBreadcrumb() {
      const matched = this.$route.matched
      this.breadList = matched
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message('退出登录')
    },
    // 菜单折叠
    changeStatus() {
      if (this.isCollapse) {
        this.isCollapse = false
        this.menu_show = false
        this.menu_hide = true
      } else {
        this.isCollapse = true
        this.menu_show = true
        this.menu_hide = false
      }
    },
    // 保存当前选中的菜单项
    saveNavState(url) {
      window.sessionStorage.urlpaths = url
      this.pathurl = url
    },
    // 获取权限菜单
    async getMenulist() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.menulist = res.data
      }
    },
  },
  created() {
    this.username = '欢迎您：' + window.sessionStorage.getItem('username')
    this.pathurl = window.sessionStorage.urlpaths || ''
    this.getMenulist()
    this.getBreadcrumb()
  },
}
</script>

<style lang="less" scoped>
.home_container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: rgb(84, 92, 100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
    > img {
      width: 60px;
      height: 60px;
      align-items: center;
      border-radius: 50%;
    }
    .span_login_user {
      margin-right: 10px;
      text-align: right;
      font-size: 14px;
      color: white;
    }
  }
}
.el-aside {
  background-color: #545c64;
  > .el-menu {
    border: none;
    min-height: 90%;
  }
  > .toggle_button {
    background-color: #b9babd;
    color: white;
    font-size: 23px;
    line-height: 30px;
    > .menu_show_btn {
      margin-left: 31%;
    }
    > .menu_hide_btn {
      margin-left: 83%;
    }
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 8px;
}
</style>
