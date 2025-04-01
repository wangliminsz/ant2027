<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col">
          <p class="h3 text-success fw-bold">
            Ant Global
            <router-link to="/contacts/add" class="btn btn-success btn-sm ms-2"
              ><i class="fa fa-plus-circle me-1"></i>New</router-link
            >
          </p>

          <!-- <br /> -->
          <p class="fst-italic">Welcome {{ whichUser }}</p>

          <form @submit.prevent="handleSubmit">
            <div class="row align-items-center">
              <div class="col-md-6 mb-3 mb-md-0">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search Name"
                  v-model="searchName"
                />
              </div>
              <div class="col-md-6">
                <div class="d-flex justify-content-md-start">
                  <button
                    type="submit"
                    class="btn btn-outline-dark btn-md me-2"
                    :disabled="!isValidSearch"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-md"
                    @click="handleCancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

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
            <p class="h5 text-danger fw-bold">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mt-3" v-if="contacts.length > 0 && !loading">
      <div class="row">
        <!-- <div class="col-md-6" v-for="contact of contacts" :key="contact"> -->
        <!-- v-for="contact in sortedContacts" -->
        <!-- <div class="col-md-4" v-for="contact in sortedContacts" :key="contact.id"> -->
        <div
          class="col-md-5"
          v-for="contact in sortedContacts"
          :key="contact.fields.id"
        >
          <!-- <div class="col-md-4" v-for="contact in contacts" :key="contact.fields.id"> -->
          <div class="card my-2 list-group-item-success shadow-lg">
            <div class="card-body">
              <div class="row align-items-center">
                <!-- <div class="col-sm-4">
                                    <img class="contact-img" :src="contact.photo" alt="">
                                </div> -->
                <div class="col-sm-10">
                  <ul class="list-group">
                    <li class="list-group-item">
                      <span class="fw-bold token_long">{{
                        contact.fields.name
                      }}</span>
                    </li>
                    <li class="list-group-item">
                      Remind Day:
                      <span class="fw-bold">{{
                        contact.fields.remind_day
                      }}</span>
                    </li>
                    <li class="list-group-item">
                      Start:
                      <span class="fw-bold">{{
                        contact.fields.rent_start
                      }}</span>
                    </li>
                    <li class="list-group-item">
                      End:
                      <span class="fw-bold">{{ contact.fields.rent_end }}</span>
                    </li>
                    <!-- truncatedToken -->
                    <!-- token -->
                    <!-- fw-bold -->
                    <!-- Group: -->

                    <!-- <li style="color: blue;" class="list-group-item">Bot:
                                            <span style="color: blue;" class="fw-bold">{{contact.fields.which_bot}}</span>
                                        </li> -->

                    <li class="list-group-item">
                      <span :class="[contact?.fields?.which_bot]">
                        Bot:
                        <span :class="['fw-bold', contact?.fields?.which_bot]">
                          {{ contact?.fields?.which_bot || "Loading..." }}
                        </span>
                      </span>
                    </li>

                    <li
                      class="list-group-item"
                      style="display: flex; align-items: center"
                    >
                      <span style="font-size: 0.8em"
                        >Group: {{ contact.fields.group_id }}</span
                      >
                    </li>
                  </ul>
                </div>
                <div class="col-sm-1">
                  <!-- <div class="col-sm-1 d-flex flex-column justify-content-center align-items-center"> -->
                  <!-- <router-link :to="`/contacts/view/${contact.fields.id}`"
                                        class="btn btn-warning my-1 me-2">
                                        <i class="fa fa-eye"></i>
                                    </router-link> -->
                  <router-link
                    :to="`/contacts/edit/${contact.fields.id}`"
                    class="btn btn-primary mt-2 mr-2"
                  >
                    <i class="fa fa-pen"></i>
                  </router-link>
                  <button
                    class="btn btn-danger mt-2 mr-2"
                    @click="myDelete(contact.fields.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                  <span v-if="contact.fields.memo">M</span>
                  <span v-if="contact.fields.pay_period === 'Quarterly'"
                    >Q</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ContactService } from "@/services/ContactService";
import mySpinner from "@/components/Spinner.vue";
import { supabase } from "@/clients/supabase";

import { mapGetters } from "vuex";
import { mapActions } from "vuex";

// import airtable from 'airtable';

export default {
  // name: 'ContactManager',

  components: {
    mySpinner,
  },

  data() {
    return {
      searchName: null,

      loading: false,
      contacts: [],
      searched_contacts: [],

      errorMessage: null,

      timer: "",
      value: 0,

      currentUserId: "",
    };
  },

  computed: {
    ...mapGetters(["isLoggedIn", "whichUser"]),

    getBotColor() {
      if (!this.contact || !this.contact.fields) {
        return "green"; // or any default color
      }
      switch (this.contact.fields.which_bot) {
        case "ant_assist":
          return "blue";
        case "ant_assist_1":
          return "red";
        default:
          return "black"; // or any default color you prefer
      }
    },

    // getBotColor() {
    //   console.log('Computed this.contact--->>>>',this.contact)
    // //   switch (this.contact.fields.which_bot) {
    // //     case "ant_assist":
    // //       return "blue";
    // //     case "ant_assist_1":
    // //       return "red";
    // //     default:
    // //       return "black"; // or any default color you prefer
    // //   }
    // return "red";
    // },

    // getBotColor() {
    //   if (this.contact.fields.which_bot) {
    //     if (this.contact.fields.which_bot === "ant_assist") {
    //       return "blue";
    //     } else if (this.contact.fields.which_bot === "ant_assist_1") {
    //       return "red";
    //     }
    //   }else{
    //     return "black"; // Default color if no bot is specified
    //   }
    //   // return "red";
    // },

    sortedContacts() {
      return this.searched_contacts.slice().sort((a, b) => {
        return new Date(b.fields.updated_at) - new Date(a.fields.updated_at);
      });
    },

    truncatedToken() {
      const maxLength = 10; // Change this to whatever maximum length you want to display
      if (this.contact.notify_token) {
        const truncated = this.contact.notify_token.substring(0, maxLength);
        return truncated.length < this.contact.notify_token.length
          ? truncated + "..."
          : truncated;
      } else {
        return this.contact.notify_token;
      }
    },

    isValidSearch() {
      return Boolean(this.searchName);
    },
  },

  created: async function () {
    this.currentUserId = await this.currentUser();

    if (this.currentUserId) {
      try {
        this.loading = true;

        if (this.$store.state.homeList.length > 0) {
          this.contacts = this.$store.state.homeList;
          this.searched_contacts = this.contacts;
          await this.$store.dispatch("clearHomeAction");
        } else {
          let response = await ContactService.getAllCondos(this.currentUserId);
          this.contacts = response; //all records more than 100
          this.searched_contacts = this.contacts;
          let theList;
          theList = this.contacts;
          await this.$store.dispatch("uploadRecordsAction", {
            theList,
          });
        }

        console.log("Created --> Data---->", this.contacts);

        this.loading = false;
      } catch (error) {
        this.errorMessage = error;
        this.loading = false;
      }
    }
  },

  mounted() {
    this.loadStateFromLocalStorage();
  },

  methods: {
    ...mapActions(["loadStateFromLocalStorage"]),

    async currentUser() {
      const localUser = await supabase.auth.getSession();
      if (localUser.data.session) {
        // it'ok
        // console.log(localUser)
        // console.log('user-id----------->', localUser.data.session.user.id)
        // it'ok
        // fe974050-059c-463d-88cb-cc55e401b2a3 //wang Limin
        return localUser.data.session.user.id;
      } else {
        console.log("not signin");
      }
    },

    async myDelete(itemId) {
      this.currentUserId = await this.currentUser();

      if (this.currentUserId) {
        if (confirm("Confirm delete?")) {
          try {
            this.loading = true;
            let response = await ContactService.deleteCondo(
              itemId,
              this.currentUserId
            );
            if (response) {
              // console.log('deleted')
              // const airtableId = recordId.toString();
              let response = await ContactService.getAllCondos(
                this.currentUserId
              );
              // this.contacts = response.data.records
              this.contacts = response;
              if (this.searchName === "" || this.searchName == null) {
                console.log("1 this.searchName 1218 --->>>", this.searchName);
                this.searched_contacts = this.contacts;
              } else {
                console.log("2 this.searchName 1218 --->>>", this.searchName);
                // Create a deep copy of this.contacts
                const contactsCopy = JSON.parse(JSON.stringify(this.contacts));

                // Apply filter on the copy
                const records = contactsCopy.filter((contact) =>
                  contact.fields.name
                    .toLowerCase()
                    .includes(this.searchName.toLowerCase())
                );

                // const records = this.contacts.filter(contact => contact.fields.name.toLowerCase().includes(this.searchName.toLowerCase()));
                this.searched_contacts = records;
              }
              this.loading = false;
            }
          } catch (error) {
            this.errorMessage = error;
            this.loading = false;
          }
        }
      }
    },

    async mySearch() {
      this.currentUserId = await this.currentUser();

      if (this.currentUserId) {
        // const currentRoute = this.$router.currentRoute;
        // if (currentRoute.path !== "/") {
        //     this.$router.push("/"); // Navigate to the page
        // }
        try {
          const records = this.contacts.filter((contact) =>
            contact.fields.name
              .toLowerCase()
              .includes(this.searchName.toLowerCase())
          );

          let homeList;
          homeList = this.contacts;

          let theList;
          theList = records;
          console.log("search --->>>>>>>>>", theList);

          await this.$store.dispatch("uploadSearchAction", {
            theList,
            homeList,
          });

          this.$router.push("/search"); // Navigate to the page
        } catch (error) {
          this.errorMessage = error;
          this.loading = false;
        }
      }

      // if (this.currentUserId) {
      //     try {
      //         this.loading = true
      //         let response = await ContactService.getAllCondos(this.currentUserId)
      //         this.contacts = response.data.records
      //         // console.log('from search air---->', this.contacts)

      //         const records = this.contacts.filter(contact => contact.fields.name.toLowerCase().includes(this.searchName.toLowerCase()));
      //         // console.log(records);
      //         this.contacts = records

      //         this.loading = false
      //     }
      //     catch (error) {
      //         this.errorMessage = error
      //         this.loading = false
      //     }
      // }
    },

    async handleSubmit() {
      // Logic to handle form submission
      console.log("Submit---->>>> 2024-12-18");

      this.currentUserId = await this.currentUser();

      if (this.currentUserId) {
        try {
          // Create a deep copy of this.contacts
          const contactsCopy = JSON.parse(JSON.stringify(this.contacts));

          // Apply filter on the copy
          const records = contactsCopy.filter((contact) =>
            contact.fields.name
              .toLowerCase()
              .includes(this.searchName.toLowerCase())
          );

          // const records = this.contacts.filter(contact => contact.fields.name.toLowerCase().includes(this.searchName.toLowerCase()));
          this.searched_contacts = records;

          // this.$router.push("/search"); // Navigate to the page
        } catch (error) {
          this.errorMessage = error;
          // this.loading = false
        }
      }
    },

    handleCancel() {
      // Logic to handle cancellation (e.g., clear form, navigate away)
      this.searchName = ""; // For example, clear the search input
      this.searched_contacts = this.contacts;
    },
  },
};
</script>

<style scoped>
.ant_assist {
  color: blue;
}

.ant_assist_1 {
  color: red;
}

.token {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
  /* adjust this value to change the maximum width */
}

.token_long {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
  /* adjust this value to change the maximum width */
}
</style>
