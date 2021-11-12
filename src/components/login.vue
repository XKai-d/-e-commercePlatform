<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/images/R-C.png" alt="" />
      </div>
      <!-- 登录区域 -->
      <el-form
        class="login_form"
        :model="form"
        :rules="rules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入账号"
            v-model="form.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="form.password"
            prefix-icon="iconfont icon-password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitLoginForm('loginFormRef')"
            >登录</el-button
          >
          <el-button type="info" @click="resetLoginForm('loginFormRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        // 表单验证
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    submitLoginForm(ref) {
      this.$refs[ref].validate(async (dates) => {
        if (dates) {
          const { data: res } = await this.$http.post('login', this.form)
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            this.$message({
              message: '登录成功',
              type: 'success',
            })
            window.sessionStorage.setItem('username', res.data.username)
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          }
        } else {
          return this.$message.error('账号，密码输入错误')
        }
      })
    },
    // 表单重置
    resetLoginForm(ref) {
      this.$refs[ref].resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #ccccff;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50px;
  transform: translate(-50%, 50%);
}

.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid rgb(243, 241, 241);
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px white;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
