<template>
  <div>
    {{ response }}
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ZeppelinLoginTest",
  data() {
    return {
      response: 'Logging into Zeppelin',
    }
  },
  async mounted() {
    this.login()

  },
  methods: {
    async login() {

      const params = {
        'userName': 'guest',
        'password': '9!MZcHEkjBU%252%248'
      }

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const url = "http://localhost:5001/api/login"

      const results = await axios.post(url, params, config);

      this.response = results
      console.log(results)
    }
  }
}
</script>

<style scoped>

</style>
