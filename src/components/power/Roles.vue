<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色 -->
          <el-button type="primary" @click="dialogFormAdd = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="Roleslist" border stripe="">
        <!-- 展开列 -->
        <el-table-column type="expand" width="50px">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item, i1) in scope.row.children"
              :key="item.id"
              align="middle"
              style="width: 92%; margin: auto"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRolesById(item.id, scope.row)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二、三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 !== 0 ? 'bdtop' : '', 'vcenter']"
                  v-for="(item2, i2) in item.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRolesById(item2.id, scope.row)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRolesById(item3.id, scope.row)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column property="roleName" label="角色名称">
        </el-table-column>
        <el-table-column property="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="updateRoles(scope.row.id)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限 -->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogFormAllot"
        width="46%"
        @close="setRightsDilalogClose()"
      >
        <!-- 树形权限展示 -->
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          ref="rightTreelist"
          :default-checked-keys="rowRightList"
          :props="defaultProps"
          :default-expand-all="true"
        >
        </el-tree>
        <div slot="footer">
          <el-button @click="dialogFormAllot = false">取 消</el-button>
          <el-button type="primary" @click="rowRoleRightAllt()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 添加角色 -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogFormAdd"
        width="36%"
        @close="resetAddRolesForm('fromRolesAdd')"
      >
        <el-form
          :model="addRoles"
          ref="fromRolesAdd"
          :rules="reulsadd"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogFormAdd = false">取 消</el-button>
          <el-button type="primary" @click="rolesFromAdd()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑角色 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="dialogFormUpdate"
        width="36%"
        @close="resetAddRolesForm('fromRolesUpdate')"
      >
        <el-form
          :model="updateRoleslist"
          ref="fromRolesUpdate"
          :rules="reulsupadate"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="updateRoleslist.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="updateRoleslist.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogFormUpdate = false">取 消</el-button>
          <el-button type="primary" @click="updateRolesfrom()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // watch: {
  //   Roleslist: {
  //     deep: true
  //   }
  // },
  data() {
    return {
      // 角色列表
      Roleslist: [],
      // 所有权限列表
      rightsList: [],
      // 当前角色的权限列表
      rowRightList: [],
      // 当前角色的id
      rowRightsRoleId: 0,
      // 树形控件配置绑定
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      // 添加Dialog显示控制
      dialogFormAdd: false,
      // 编辑Dialog显示控制
      dialogFormUpdate: false,
      // 分配权限Dialog显示控制
      dialogFormAllot: false,
      // 添加角色存放
      addRoles: {
        roleName: '',
        roleDesc: '',
      },
      // 修改角色存放
      updateRoleslist: {
        roleId: '',
        roleName: '',
        roleDesc: '',
      },
      // 添加角色验证
      reulsadd: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 修改角色验证
      reulsupadate: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 角色列表初始化数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.Roleslist = res.data
        console.log(res.data)
        this.$message.success(res.meta.msg)
      }
    },
    // 删除角色
    async deleteRoles(reid) {
      const result = await this.$messagebox
        .confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch((err) => err)
      if (result === 'confirm') {
        const { data: res } = await this.$http.delete('roles/' + reid)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        } else {
          console.log(2)
          this.getRolesList()
          this.$message.success(res.meta.msg)
        }
      } else {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      }
    },
    // 监听对话框关闭，表单重置
    resetAddRolesForm(ref) {
      this.$refs[ref].resetFields()
    },
    // 添加角色
    rolesFromAdd() {
      this.$refs.fromRolesAdd.validate(async (results) => {
        if (results) {
          const { data: res } = await this.$http.post('roles', this.addRoles)
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg)
          } else {
            this.dialogFormAdd = false
            this.getRolesList()
            this.$message.success(res.meta.msg)
          }
        }
      })
    },
    // 修改角色获取
    async updateRoles(reid) {
      const { data: res } = await this.$http.get(`roles/${reid}`)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.dialogFormUpdate = true
        this.updateRoleslist = res.data
      }
    },
    // 修改角色保存
    updateRolesfrom() {
      this.$refs.fromRolesUpdate.validate(async (resrult) => {
        if (resrult) {
          const { data: res } = await this.$http.put(
            'roles/' + this.updateRoleslist.roleId,
            {
              roleName: this.updateRoleslist.roleName,
              roleDesc: this.updateRoleslist.roleDesc,
            }
          )
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            this.dialogFormUpdate = false
            this.getRolesList()
            this.$message.success('修改成功')
          }
        }
      })
    },
    // 下拉tag关闭删除权限事件
    removeRolesById(rightid, roles) {
      this.$messagebox
        .confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${roles.id}/rights/${rightid}`
          )
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            // 重新赋值数据，防止刷新
            roles.children = res.data
            this.$message.success(res.meta.msg)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 分配权限
    async showSetRightDialog(rowright) {
      // 获取全部的权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.rightsList = res.data
        // 获取角色的id
        this.rowRightsRoleId = rowright.id
        // 获取底层节点的id
        this.getLeafRightKeys(rowright, this.rowRightList)
        this.dialogFormAllot = true
        this.$message.success('权限获取渲染成功')
      }
    },
    // 获取角色的权限--递归
    getLeafRightKeys(node, arrlist) {
      // 如果当前节点不包括children属性，为底层节点，加入arrlist中
      if (!node.children) {
        return arrlist.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafRightKeys(item, arrlist)
      })
    },
    // 监听权限分配对话框关闭事件，重置 rowRightList 集合
    setRightsDilalogClose() {
      this.rowRightList = []
    },
    // 保存重新分配的权限
    async rowRoleRightAllt() {
      // 选中数据集获取
      const rightkeys = [
        ...this.$refs.rightTreelist.getCheckedKeys(),
        ...this.$refs.rightTreelist.getHalfCheckedKeys(),
      ]
      // join格式化
      const rightids = rightkeys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.rowRightsRoleId}/rights`,
        { rids: rightids }
      )
      if (res.meta.status !== 200) {
        this.$message.error('分配权限失败')
      } else {
        this.dialogFormAllot = false
        this.getRolesList()
        this.$message.success('分配权限成功')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
