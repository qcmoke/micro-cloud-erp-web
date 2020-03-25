<template>
  <div>
    <div class="getTest">
      <div><button @click="urlGet">urlGet</button></div>
    </div>

    <div class="postTest">
      <div><button @click="jsonPost">jsonPost</button></div>
      <div><button @click="urlPost">urlPost</button></div>
      <div><button @click="formPost">formPost</button></div>
      <div>
        <!-- 添加单文件 -->
        <div>添加单文件<input type="file" @change="getFile($event)"></div>
        <!-- 添加多文件，加属性multiple即可选择多文件 -->
        <div>
          添加多文件<input type="file" multiple @change="getFiles($event)">
        </div>
        <button @click="formDataPost">formDataPost</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  urlGetApi,
  jsonPostAPi,
  urlPostApi,
  formPostApi,
  formDataPostApi
} from '@/api/test'
export default {
  data() {
    return {
      msg: '',
      // 文件
      file: {},
      files: []
    }
  },
  methods: {
    urlGet() {
      urlGetApi({ name: 'zhangsan', age: 24 }).then(res => {
        console.log(res)
      })
    },
    getFile(event) {
      this.file = event.target.files[0]
    },
    getFiles(event) {
      this.files = event.target.files
    },
    jsonPost() {
      jsonPostAPi({ name: 'zhangsan', age: 24 })
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })
    },
    urlPost() {
      urlPostApi({ name: 'zhangsan', age: 24 })
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })
    },
    formPost() {
      formPostApi({ name: 'zhangsan', age: 24 })
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })
    },
    formDataPost() {
      const input = this.$refs
      console.log(input)

      const formData = new FormData()
      const user = { name: 'zhangsan', age: 24 }
      Object.keys(user).forEach(key => {
        formData.append(key, user[key])
      })

      // 添加文件
      // 向 formData 对象中添加文件
      formData.append('files', this.file)
      // formData重复的往一个值添加数据并不会被覆盖掉，可以全部接收到

      const files = this.files
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      // 可以通过formData.getAll('files')来查看所有插入的文件
      console.log(formData.getAll('files'))

      formDataPostApi(formData)
        .then(res => {
          // console.log(res)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.postTest,
.getTest {
  background-color: antiquewhite;
}
.postTest {
  margin-top: 50px;
}

.postTest > div {
  margin-bottom: 30px;
}

.getTest > div {
  margin-bottom: 30px;
}
</style>
