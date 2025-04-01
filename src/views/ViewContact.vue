<template>
    <div>
        <div class="container mt-3">
            <div class="d-flex justify-content-start align-items-center">
                <h3 class="text-success fw-bold me-3">View Estate</h3>
                <router-link to="/contacts" class="btn btn-success"><i
                        class="fa fa-arrow-alt-circle-left me-1"></i>Back</router-link>
            </div>
        </div>
        <br>

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

        <!-- Error Message -->
        <div v-if="!loading && errorMessage">
            <div class="container mt-3">
                <div class="row">
                    <div class="col">
                        <p class="h5 text-danger fw-bold"> {{ errorMessage }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="container" v-if="!loading">
            <div class="row align-items-center">
                <!-- <div class="col-md-3">
                    <img :src="contact.photo" alt="" class="contact-img-big">
                </div> -->
                <div class="col-md-6">
                    <ul class="list-group">
                        <li class="list-group-item">Name:
                            <!-- <span class="fw-bold"> {{ contact.fields.name }}</span> -->
                            <span class="fw-bold" v-if="contact && contact.fields && contact.fields.name">{{
                                contact.fields.name }}</span>
                        </li>
                        <li class="list-group-item">Remind Day:
                            <span class="fw-bold" v-if="contact && contact.fields && contact.fields.remind_day">{{
                                contact.fields.remind_day }}</span>
                        </li>
                        <li class="list-group-item">Start:
                            <span class="fw-bold" v-if="contact && contact.fields && contact.fields.rent_start">{{
                                contact.fields.rent_start }}</span>
                        </li>
                        <li class="list-group-item">End:
                            <span class="fw-bold" v-if="contact && contact.fields && contact.fields.rent_end">{{
                                contact.fields.rent_end }}</span>
                        </li>

                        <li class="list-group-item">Payment Term:
                            <span class="fw-bold" v-if="contact && contact.fields && contact.fields.pay_period">{{
                                contact.fields.pay_period }}</span>
                        </li>

                        <li class="list-group-item">Notify Token:
                            <span class="fw-bold" v-if="contact && contact.fields && contact.fields.notify_token">{{
                                truncatedToken }}</span>
                        </li>

                        <li class="list-group-item" v-if="contact && contact.fields">Memo:
                            <span class="fw-bold"></span>
                        </li>

                        <textarea class="list-group-item" id="txtarea" cols="30" rows="6" v-model="contact.fields.memo" v-if="contact && contact.fields && contact.fields.memo">
                            
                        </textarea>

                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ContactService } from '@/services/ContactService'
import mySpinner from '@/components/Spinner.vue'

import { supabase } from '@/clients/supabase'

export default {

    name: 'ViewContact',

    components: {
        mySpinner
    },

    data() {
        return {
            contactId: this.$route.params.contactId,
            contact: {},
            group: {},

            errorMessage: '',
            loading: false,

            currentUserId: ''
        }
    },

    computed: {
        formattedDate() {
            const date = new Date(this.contact.fields.updated_at)
            // const options = { year: 'numeric', month: 'long', day: 'numeric' }
            // return date.toLocaleDateString('en-US', options)
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
            return date.toLocaleDateString('zh-CN', options).replace(/\//g, '-')
        },

        truncatedToken() {
            const maxLength = 10 // Change this to whatever maximum length you want to display
            if (this.contact.fields.notify_token) {
                const truncated = this.contact.fields.notify_token.substring(0, maxLength)
                return truncated.length < this.contact.fields.notify_token.length ? truncated + "..." : truncated
            } else {
                return this.contact.fields.notify_token
            }
        }
    },

    created: async function () {
        this.currentUserId = await this.currentUser();

        if (this.currentUserId) {
            try {
                this.loading = true
                let response = await ContactService.getCondo(this.contactId, this.currentUserId)
                if (response) {
                    // console.log('view page-------->', response.data.records)
                    this.contact = response.data.records[0]
                    // console.log('view page-------->', this.contact.fields.memo)
                    // let groupResponse = await ContactService.getGroup(this.contact)
                    // if (groupResponse) {
                    //     this.group = groupResponse.data[0]
                    //     console.log('this.group---------->', this.group)
                    // }
                    this.loading = false
                }
            }
            catch (error) {
                this.errorMessage = error
                this.loading = false
            }
        }
    },

    methods: {
        async currentUser() {
            const localUser = await supabase.auth.getSession();
            if (localUser.data.session) {
                // it'ok
                // console.log(localUser)
                // console.log('user-id----------->', localUser.data.session.user.id)
                // console.log('user-email-------->', localUser.data.session.user.email)
                // it'ok
                return localUser.data.session.user.id
            } else {
                console.log('not signin')
            }
        },
    }
}

</script>

<style scoped>
.token {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
    /* adjust this value to change the maximum width */
}
</style>