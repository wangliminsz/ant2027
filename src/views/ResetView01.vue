<template>
    <div>
        <!-- Spinner -->
        <div v-if="loading">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <mySpinner />
                    </div>
                </div>
            </div>
        </div>
        <div class="container" v-if="!loading">
            <div>
                <div class="login-content-center">
                    <img src="../assets/img/ant.jpg" style="border-radius: 50%;">
                </div>

                <div class="login-content">
                    <form @submit.prevent="resetPass01">
                        <!-- <img src="../assets/img/ant.jpg" class="antlogo"> -->
                        <br />
                        <br />

                        <div class="input-div pass">
                            <div class="i">
                                <i class="fas fa-lock"></i>
                            </div>
                            <div class="div">
                                <input type="password" class="input" placeholder="New Password" v-model="password"
                                    :class="{ 'is-invalid': password && !isValidPassword }">
                                <div v-if="password && !isValidPassword" class="invalid-feedback"><br /><br /><br />
                                    At least 6 digits
                                </div>
                            </div>
                        </div>

                        <div class="input-div pass">
                            <div class="i">
                                <i class="fas fa-lock"></i>
                            </div>
                            <div class="div">
                                <input type="password" class="input" placeholder="Confirm Password"
                                    v-model="confirm_password"
                                    :class="{ 'is-invalid': confirm_password && !isPasswordMatch }">
                                <div v-if="!isPasswordMatch" class="invalid-feedback"><br /><br /><br />
                                    Please ensure passwords match.
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />
                        <input type="submit" class="btn_blue" value="Reset" :disabled="!isFormValid">
                    </form>
                    <!-- <pre>{{ isFormValid }}</pre> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { ref } from 'vue'
import { supabase } from '../clients/supabase'
import { ContactService } from '@/services/ContactService'
import { mapActions } from 'vuex'

// import mySpinner from '@/components/Spinner.vue'

export default {

    name: 'myLogin',

    components: {
        // mySpinner
    },

    data() {
        return {
            email: '',
            password: '',
            confirm_password: '',
            username: '',

            loading: false,
        }
    },

    computed: {
        isValidEmail() {
            //  const emailPattern = /^\S+@\S+\.\S+$/;
            //  return emailPattern.test(this.email);
            return true;
        },
        isValidPassword() {
            // const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            const passwordPattern = /^.{6,}$/;
            return passwordPattern.test(this.password);
        },
        isValidConfirmPassword() {
            // const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            const passwordPattern = /^.{6,}$/;
            return passwordPattern.test(this.confirm_password);
        },
        isPasswordMatch() {
            return (
                this.password === this.confirm_password
            );
        },
        isFormValid() {
            return (
                this.isValidEmail &&
                this.isValidPassword &&
                this.isValidConfirmPassword &&
                this.isPasswordMatch
            );
        }
    },

    methods: {

        async resetPass01() {
            const { data, error } = await supabase.auth.updateUser({
                password: this.password
            })
            if (error) {
                console.log(error)
                // console.log('reset 20230602 --- error', error.message)
                alert('Reset Password NOT successful')
            }
            else {
                console.log(data)
                // console.log('from Reset----->')
                alert('Reset Password successful')
                // router.push('/contacts')
                const currentRoute = this.$router.currentRoute;
                if (currentRoute.path !== "/contacts") {
                    this.$router.push("/contacts"); // Navigate to the login page
                }
            }
        },

        //create account
        async createAccount() {

            let ifUserExist = false
            let currentUsers = []

            try {
                let usersResponse = await ContactService.getAllUsers()
                if (usersResponse) {
                    // console.log(usersResponse.data)
                    currentUsers = usersResponse.data
                    for (let i = 0; i < currentUsers.length; i++) {
                        // console.log(currentUsers[i].email);
                        if (this.email.toLowerCase() === currentUsers[i].email.toLowerCase()) {
                            ifUserExist = true;
                            break;
                        } else {
                            ifUserExist = false;
                        }
                    }
                    console.log('ifExist-------》', ifUserExist)

                    if (!ifUserExist) {
                        const { data, error } = await supabase.auth.signUp({
                            email: this.email,
                            password: this.password,
                            // options: {
                            //    data: {
                            //       username: username.value
                            //    }
                            // }
                        })
                        if (error === null) {
                            console.log(data)
                            alert('User created. Please check email to Activate.')
                            // if (Array.isArray(data.user.identities) && data.user.identities.length > 0) {
                            //    console.log(data.user.identities[0].identity_data.email);
                            // } else {
                            //    console.log('User already exists');
                            // }
                            const currentRoute = this.$router.currentRoute;
                            if (currentRoute.path !== "/login") {
                                this.$router.push("/login"); // Navigate to the login page
                            }
                        }
                        else {
                            console.log(error)
                        }
                    } else {
                        alert('User already exists')
                        const currentRoute = this.$router.currentRoute;
                        if (currentRoute.path !== "/login") {
                            this.$router.push("/login"); // Navigate to the login page
                        }
                    }
                }
            }
            catch (error) {
                // console.log('Error Occurred------->', error)
                console.log(error)
            }

        },

        submitLogin() {
            this.loading = true
            const email = this.email
            const password = this.password
            // Pass email and password as payload to the login action
            this.login({ email, password, router: this.$router })
            this.loading = false
        },

        ...mapActions(['login'])

    }
}

</script>

<style scoped>
.antlogo {
    border-radius: 50%;
}

.input::placeholder {
    color: #ccc;
    /* Set the placeholder text color to light grey */
}

span {
    display: flex;
    justify-content: space-between;
    /* Align items at each end of container */
}

span a:first-child {
    margin-right: auto;
    /* Push the first child (Sign Up) to the left */
}

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
}

.wave {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 100%;
    z-index: -1;
}

.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    /* Updated display property */
    justify-content: center;
    /* Center the content horizontally */
    align-items: center;
    /* Center the content vertically */
    padding: 0 2rem 3rem;
    /* padding: 0 2rem; */
}

.img {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.login-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
}

.login-content-center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.login-content-center img {
    height: 100px;
}

.img img {
    width: 500px;
}

form {
    width: 360px;
}

.login-content img {
    height: 100px;
}

.login-content h2 {
    margin: 15px 0;
    color: #333;
    text-transform: uppercase;
    font-size: 2.9rem;
}

.login-content .input-div {
    position: relative;
    display: grid;
    grid-template-columns: 7% 93%;
    margin: 25px 0;
    padding: 5px 0;
    border-bottom: 2px solid #d9d9d9;
}

.login-content .input-div.one {
    margin-top: 0;
}

.i {
    color: #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
}

.i i {
    transition: .3s;
}

.input-div>div {
    position: relative;
    height: 45px;
}

.input-div>div>h5 {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 18px;
    transition: .3s;
}

.input-div:before,
.input-div:after {
    content: '';
    position: absolute;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background-color: #38d39f;
    transition: .4s;
}

.input-div:before {
    right: 50%;
}

.input-div:after {
    left: 50%;
}

.input-div.focus:before,
.input-div.focus:after {
    width: 50%;
}

.input-div.focus>div>h5 {
    top: -5px;
    font-size: 15px;
}

.input-div.focus>.i>i {
    color: #38d39f;
}

.input-div>div>input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: none;
    padding: 0.5rem 0.7rem;
    font-size: 1.2rem;
    color: #555;
    font-family: 'poppins', sans-serif;
}

.input-div.pass {
    margin-bottom: 4px;
}

a {
    display: block;
    text-align: right;
    text-decoration: none;
    color: #999;
    font-size: 0.9rem;
    transition: .3s;
}

a:hover {
    color: #38d39f;
}

.btn {
    display: block;
    width: 100%;
    height: 50px;
    border-radius: 25px;
    outline: none;
    border: none;
    background-image: linear-gradient(to right, #32be8f, #38d39f, #32be8f);
    background-size: 200%;
    font-size: 1.2rem;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    text-transform: uppercase;
    margin: 1rem 0;
    cursor: pointer;
    transition: .5s;
}

.btn[disabled] {
    background-color: #c2c2c2 !important;
    cursor: not-allowed;
}

.btn_blue {
    display: block;
    width: 100%;
    height: 50px;
    border-radius: 25px;
    outline: none;
    border: none;
    background-image: linear-gradient(to right, #6c32be, #4038d3, #330882);
    background-size: 200%;
    font-size: 1.2rem;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    text-transform: uppercase;
    margin: 1rem 0;
    cursor: pointer;
    transition: .5s;
}

.btn_blue[disabled] {
    background-color: #c2c2c2 !important;
    cursor: not-allowed;
}

.btn:hover {
    background-position: right;
}


@media screen and (max-width: 1050px) {
    .container {
        grid-gap: 5rem;
    }
}

@media screen and (max-width: 1000px) {
    form {
        width: 290px;
    }

    .login-content h2 {
        font-size: 2.4rem;
        margin: 8px 0;
    }

    .img img {
        width: 400px;
    }
}

@media screen and (max-width: 900px) {
    .container {
        grid-template-columns: 1fr;
    }

    .img {
        display: none;
    }

    .wave {
        display: none;
    }

    .login-content {
        justify-content: center;
    }
}
</style>