<template>
    <body>
        <img class="wave" src="../assets/img/wave.png">
        <div class="container">
            <div class="img">
                <img src="../assets/img/bg.svg">
            </div>
            <div class="login-content">
                <!-- class="login-content" -->

                <form @submit.prevent="login">
                    <img src="../assets/img/avatar.svg">
                    <br />
                    <br />
                    <br />
                    <br />
                    <!-- <h2 class="title">Welcome</h2> -->
                    <div class="input-div one">
                        <div class="i">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="div">
                            <h5>Username</h5>
                            <input type="text" class="input">
                        </div>
                    </div>
                    <div class="input-div pass">
                        <div class="i">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="div">
                            <h5>Password</h5>
                            <input type="password" class="input">
                        </div>
                    </div>
                    <a href="#">Forgot Password?</a>
                    <br />
                    <br />
                    <input type="submit" class="btn" value="Login">
                </form>
            </div>
        </div>
    </body>
</template>

<script>
// import axios from "axios";

export default {
    name: "myLogin",

    data() {
        return {
            form: this.initForm()
        }
    },

    methods: {
        login() {
            //   axios.post('api/auth/login', this.form).then((response) => {
            //     localStorage.setItem('token', response.data.access_token)
            //     this.$store.dispatch('user', response.data)
            //     this.$router.push('/')
            //   }).catch(error => {
            //     console.log(error)
            //   })

            this.$router.push('/')
        },

        initForm() {
            return {
                email: null,
                password: null
            }
        }
    }
}
</script>

<style scoped>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: -30px;
}

</style>