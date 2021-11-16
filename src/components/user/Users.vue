<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部搜索、添加区 -->
      <el-row :gutter="20">
        <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserslist"
          >
            <el-button
              slot="append"
              @click="getUserslist"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-button type="primary" @click="dialogFormVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="Userlist" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="statusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="success"
              size="mini"
              icon="el-icon-edit"
              @click="updateDialogShow(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUserDate(scope.row.id)"
            ></el-button>
            <!-- 分配角色权限 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-setting"
                @click="SetRolesAllt(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20, 30, 40, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 弹窗对话框区域，新增用户 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogFormVisible"
        width="36%"
        @close="resetAddUserForm('ruleForm')"
      >
        <el-form
          :model="addUserFrom"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="addUserFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="addUserFrom.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="addUserFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input v-model="addUserFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNewUser()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="dialogFormVisibleupdate"
        width="36%"
        @close="resetAddUserForm('ruleupdateForm')"
      >
        <el-form
          :model="UpdatUserFrom"
          :rules="UpdatUserFromrules"
          ref="ruleupdateForm"
          label-width="100px"
        >
          <el-form-item label="用户名：">
            <el-input v-model="UpdatUserFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="UpdatUserFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input v-model="UpdatUserFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleupdate = false">取 消</el-button>
          <el-button type="primary" @click="updateUserDate">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配角色 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="dialogFormVisibleuRight"
        width="36%"
        @close="dialogRightClose()"
      >
        <div>
          <p>当前的用户：{{ userInfoRow.username }}</p>
          <p>用户的角色：{{ userInfoRow.role_name }}</p>
          <p>
            分配新角色：
            <template>
              <el-select v-model="selectRolesid" placeholder="请选择">
                <el-option
                  v-for="item in rightlist"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleuRight = false">取 消</el-button>
          <el-button type="primary" @click="chageUserRight()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱验证
    var checkEmail = (rule, value, cb) => {
      const regEmail =
        /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!regEmail.test(value)) {
        this.addUserFrom.email = ''
        return cb(new Error('请输入合法的邮箱'))
      } else {
        return cb()
      }
    }
    // 自定义手机验证
    var checkMobeils = (rule, value, cb) => {
      const regMobils =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!regMobils.test(value)) {
        this.addUserFrom.mobile = ''
        return cb(new Error('请输入合法的手机号'))
      } else {
        return cb()
      }
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      Userlist: [],
      total: 0,
      // 控制添加对话框的显示和隐藏
      dialogFormVisible: false,
      // 控制修改对话框的显示和隐藏
      dialogFormVisibleupdate: false,
      // 控制分配角色对话框的显示和隐藏
      dialogFormVisibleuRight: false,
      // 分角色的用户数据
      userInfoRow: {},
      // 角色列表选中项
      selectRolesid: '',
      // 角色列表
      rightlist: [],
      // 新增的用户信息
      addUserFrom: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 修改的用户信息
      UpdatUserFrom: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
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
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobeils, trigger: 'blur' },
        ],
      },
      UpdatUserFromrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobeils, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserslist()
  },
  methods: {
    // 分页刷新数据初始化
    Pageinitial() {
      this.queryInfo.pagenum = this.queryInfo.pagenum - 1
    },
    // 加载用户列表数据
    async getUserslist() {
      // 初始化数据
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.Userlist = res.data.users
        this.total = res.data.total
        return this.$message.success('数据获取成功')
      }
    },
    // 监听：每页多少条数据
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserslist()
    },
    // 监听：页码
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserslist()
    },
    // 监听：状态改变事件
    async statusChange(userdate) {
      const { data: res } = await this.$http.put(
        `users/${userdate.id}/state/${userdate.mg_state}`
      )
      if (res.meta.status !== 200) {
        userdate.mg_state = !userdate.mg_state
        return this.$message.error(res.meta.msg)
      } else {
        return this.$message.success(res.meta.msg)
      }
    },
    // 监听对话框关闭，表单重置
    resetAddUserForm(ref) {
      this.$refs[ref].resetFields()
    },
    // 添加用户信息
    addNewUser() {
      this.$refs.ruleForm.validate(async (results) => {
        if (results) {
          const { data: res } = await this.$http.post('users', this.addUserFrom)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          } else {
            this.getUserslist()
            this.dialogFormVisible = false
            return this.$message.success(res.meta.msg)
          }
        }
      })
    },
    // 修改用户信息绑定
    async updateDialogShow(userdate) {
      const { data: res } = await this.$http.get(`users/${userdate.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.dialogFormVisibleupdate = true
        this.UpdatUserFrom = res.data
      }
    },
    // 修改用户信息
    async updateUserDate() {
      this.$refs.ruleupdateForm.validate(async (results) => {
        if (results) {
          const { data: res } = await this.$http.put(
            'users/' + this.UpdatUserFrom.id,
            {
              email: this.UpdatUserFrom.email,
              mobile: this.UpdatUserFrom.mobile,
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.getUserslist()
            this.dialogFormVisibleupdate = false
            return this.$message.success('修改成功')
          }
        }
      })
    },
    // 删除用户信息
    deleteUserDate(id) {
      // 删除预提示
      this.$messagebox
        .confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.Pageinitial()
            this.getUserslist()
            return this.$message.success(res.meta.msg)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 给用户分配角色对话框
    async SetRolesAllt(rowuser) {
      this.userInfoRow = rowuser
      // 获取所有的角色
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('角色列表获取失败')
      } else {
        this.rightlist = res.data
        this.dialogFormVisibleuRight = true
      }
    },
    // 改变用户的角色
    async chageUserRight() {
      if (!this.selectRolesid) {
        return this.$message.error('请选择角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfoRow.id}/role`,
        { rid: this.selectRolesid }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('角色重分配失败')
      } else {
        this.getUserslist()
        this.dialogFormVisibleuRight = false
        return this.$message.success('角色分配成功')
      }
    },
    // 监听对话框关闭事件
    dialogRightClose() {
      this.selectRolesid = ''
    },
  },
}
</script>

<style lang="less" scoped></style>
