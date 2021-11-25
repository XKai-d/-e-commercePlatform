<template>
  <div>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-if="scope.row.level === '2'"
              >三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表数据
      rightsList: [],
    }
  },
  created() {
    this.getrightsList()
  },
  methods: {
    // 限数据获取
    async getrightsList() {
      const { data: res } = await this.$http.get(`rights/list`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.rightsList = res.data
        return this.$message.success(res.meta.msg)
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
