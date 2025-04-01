<template>
  <div>
    <!-- <div>
      <pre> 
          {{ contact }} 
          {{ isValidName }}
          {{ isValidRemindDay }}
          {{ isValidRentStart }}
          {{ isValidRentEnd }}
      </pre>
    </div> -->

    <div class="container mt-3">
      <div class="row">
        <div class="col">
          <p class="h3 text-success fw-bold">Add Estate</p>
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

    <div class="container mt-3" v-if="!loading">
      <div class="row">
        <div class="col-md-4">
          <form @submit.prevent="myCreate">
            <div class="mb-2">
              <input
                v-model="contact.name"
                type="text"
                class="form-control"
                placeholder="Estate Name"
                :class="{ 'is-invalid': contact.name && !isValidName }"
              />
              <div v-if="contact.name && !isValidName" class="invalid-feedback">
                Please enter a valid Estate name.
              </div>
            </div>

            <div class="mb-2">
              <!-- <input v-model="contact.remind_day" type="number" class="form-control" placeholder="Remind Day" :class="{
                'is-invalid': contact.remind_day && !isValidRemindDay,
              }" />
              <div v-if="contact.remind_day && !isValidRemindDay" class="invalid-feedback">
                Please enter a valid Remind Day(1-31).
              </div> -->

              <input
                v-model="the_RemindDay"
                type="number"
                class="form-control"
                placeholder="Remind Day"
                :class="{
                  'is-invalid': the_RemindDay && !isValidRemindDay,
                }"
              />
              <div
                v-if="the_RemindDay && !isValidRemindDay"
                class="invalid-feedback"
              >
                Please enter a valid Remind Day(1-31).
              </div>
            </div>

            <div class="mb-2">
              <div class="form-control date-picker-container">
                <!-- <datepicker class="no_border" v-model="contact.rent_start" placeholder="Start Date" /> -->
                <!-- <DatePicker v-model:selectedDate="selectedDate" /> -->
                <!-- <DatePicker v-model="selectedDate" /> -->
                <DatePicker v-model="the_RentStart" placeholder="Start Date" />
              </div>
            </div>

            <div class="mb-2">
              <div class="form-control date-picker-container">
                <!-- <datepicker class="no_border" v-model="contact.rent_end" placeholder="End Date" />  -->
                <!-- <DatePicker v-model:selectedDate="selectedDate" /> -->
                <!-- <DatePicker v-model="contact.rent_end" placeholder="End Date" /> -->
                <DatePicker v-model="the_RentEnd" placeholder="End Date" />
              </div>
            </div>

            <div class="mb-2">
              <select v-model="contact.pay_period" class="form-control">
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>

            <div class="mb-2">
              <select v-model="contact.which_bot" class="form-control">
                <option value="" disabled selected>Select a Bot</option>
                <option value="ant_assist">ant_assist</option>
                <option value="ant_assist_1">ant_assist_1</option>
              </select>
            </div>

            <!-- <div class="mb-2">
              <input v-model="contact.notify_token" type="text" class="form-control" placeholder="Notify Token" :class="{
                'is-invalid': contact.notify_token && !isValidNotifyToken,
              }" />
              <div v-if="contact.notify_token && !isValidNotifyToken" class="invalid-feedback">
                Please enter a valid Line Notify Token.
              </div>
            </div> -->

            <div class="mb-2">
              <input
                v-model="contact.group_id"
                type="text"
                class="form-control"
                placeholder="Group Id"
                :class="{
                  'is-invalid': contact.group_id && !isValidGroupId,
                }"
              />
              <div
                v-if="contact.group_id && !isValidGroupId"
                class="invalid-feedback"
              >
                Please enter a valid Line Group Id.
              </div>
            </div>

            <div class="mb-2">
              <textarea
                v-model="contact.memo"
                class="form-control"
                rows="5"
                placeholder="Memo"
                :class="{ 'is-invalid': contact.memo && !isValidMemo }"
              ></textarea>
              <div v-if="contact.memo && !isValidMemo" class="invalid-feedback">
                Please enter a valid Memo.
              </div>
            </div>

            <div class="d-flex flex-wrap mt-3">
              <div class="col-md-3">
                <input
                  type="submit"
                  class="btn btn-success"
                  value="Create"
                  :disabled="!isFormValid"
                />
              </div>
              <div class="col-md-3">
                <router-link to="/contacts" class="btn btn-success"
                  >Cancel</router-link
                >
              </div>
            </div>
          </form>
        </div>
        <!-- <pre> {{ contact }} </pre> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ContactService } from "@/services/ContactService";
import { supabase } from "@/clients/supabase";
import mySpinner from "@/components/Spinner.vue";

import DatePicker from "vue3-datepicker";

export default {
  name: "AddContact",

  components: {
    DatePicker,
    mySpinner,
  },

  data() {
    return {
      selectedDate: new Date(), // initially today's date

      the_RentStart: null,
      the_RentEnd: null,
      the_RemindDay: null,

      contact: {
        name: "",
        // created_at: '',
        user_id: "",
        pay_period: "Monthly",
        which_bot: "",
      },

      // airContact: [],
      // airRecord: {},

      currentUserId: "",
      groups: [],

      errorMessage: "",
      loading: false,

      showDatePicker: false,
    };
  },

  created: async function () {
    // console.log("created --- group removed");
    // try {
    //     let response = await ContactService.getAllGroups()
    //     this.groups = response.data
    //     // console.log('------------->', this.groups)
    // }
    // catch (error) {
    //     console.log(error)
    // }
  },

  mounted() {
    this.contact.pay_period = "Monthly"; //default value
  },

  watch: {
    // Watch for changes on rent_start
    the_RentStart: function (newDate) {
      // Convert to local date string and slice to only get yyyy-mm-dd
      let dateWithCorrectTimeZone = new Date(
        Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
      );
      this.contact.rent_start = dateWithCorrectTimeZone
        .toISOString()
        .slice(0, 10);
    },

    the_RentEnd: function (newDate) {
      // Convert to local date string and slice to only get yyyy-mm-dd
      let dateWithCorrectTimeZone = new Date(
        Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
      );
      this.contact.rent_end = dateWithCorrectTimeZone
        .toISOString()
        .slice(0, 10);
    },

    the_RemindDay: function (newDay) {
      // Convert to local date string and slice to only get yyyy-mm-dd
      this.contact.remind_day = newDay.toString();
    },
  },

  computed: {
    // cotactRentStart(){
    //   this.contact.rent_start = the_RentStart.toISOString().slice(0,10);
    // },

    isValidName() {
      return Boolean(this.contact.name);
    },
    isValidAddress() {
      return true;
    },
    isValidRemindDay() {
      // const remindDay = Number(this.contact.remind_day);
      const remindDay = Number(this.the_RemindDay);
      return !isNaN(remindDay) && remindDay >= 1 && remindDay <= 31;
    },

    isValidRentStart() {
      const dateStr = this.contact.rent_start;
      const dateObj = new Date(dateStr);
      return dateObj instanceof Date && !isNaN(dateObj);
    },

    isValidRentEnd() {
      const dateStr = this.contact.rent_end;
      const dateObj = new Date(dateStr);
      return dateObj instanceof Date && !isNaN(dateObj);
    },

    // isValidRentEnd() {
    //   const rentStart = new Date(this.contact.rent_start);
    //   const rentEnd = new Date(this.contact.rent_end);

    //   if (
    //     rentStart instanceof Date &&
    //     !isNaN(rentStart) &&
    //     rentEnd instanceof Date &&
    //     !isNaN(rentEnd)
    //   ) {
    //     return rentEnd > rentStart;
    //   }

    //   return false;
    // },

    isValidNotifyToken() {
      return true;
    },

    isValidGroupId() {
      return true;
    },

    isValidMemo() {
      return true;
    },

    // isValidGroup() {
    //     return Boolean(this.contact.groupId);
    // },

    isFormValid() {
      return (
        this.isValidName &&
        this.isValidRemindDay &&
        this.isValidRentStart &&
        this.isValidRentEnd
        // this.isValidGroup
      );
    },
  },

  methods: {
    // hideDatePicker() {
    //   setTimeout(() => {
    //     this.showDatePicker = false;
    //   }, 250);
    // },

    async myCreate() {
      // this.loading = true;
      this.currentUserId = await this.currentUser();

      if (this.currentUserId) {
        try {
          this.contact.user_id = this.currentUserId;
          this.contact.updated_at = new Date().toISOString();
          this.contact.if_annual_notify = false;

          console.log("2025 04--------> this.contact, which bot", this.contact);

          if (this.contact.which_bot) {
            // let response = await ContactService.createContact(this.contact)
            let response = await ContactService.airInsertRecord(this.contact);

            await this.$store.dispatch("clearHomeAction");

            if (response) {
              // console.log("ok---------> Created");
              this.loading = false;
              // // this.$router.push('/')
              const currentRoute = this.$router.currentRoute;
              if (currentRoute.path !== "/") {
                this.$router.push("/"); // Navigate to the page
              }
            } else {
              this.loading = false;
              // this.$router.push('/contacts/add')
              const currentRoute = this.$router.currentRoute;
              if (currentRoute.path !== "/contacts/add") {
                this.$router.push("/contacts/add"); // Navigate to the page
              }
            }

          }else{
            // Form is invalid, show an error message
            alert('Bot must be selected.');
          }
        } catch (error) {
          this.errorMessage = error;
          // console.log(this.errorMessage);
          this.loading = false;
        }
      }
    },

    async currentUser() {
      const localUser = await supabase.auth.getSession();
      if (localUser.data.session) {
        // it'ok
        // console.log(localUser)
        // console.log('user-id----------->', localUser.data.session.user.id)
        // it'ok
        return localUser.data.session.user.id;
      } else {
        console.log("not signin");
      }
    },
  },
};
</script>

<style scoped>
.d-flex {
  justify-content: space-start;
  /* Adjust this value as needed */
}

.d-flex > div {
  flex-basis: 30%;
  /* Adjust this value as needed */
  /* padding: 0 -1px; */
  /* Adjust this value as needed */
}

/* .form-control .vdp-datepicker .vdp-wrapper {
    border: none;
    box-shadow: none;
} */

.vdp-wrapper {
  border: none !important;
  box-shadow: none !important;
}

.date-picker-container {
  position: relative;
  /* border: none !important;
    box-shadow: none !important;*/
}

.datepicker {
  border: none !important;
  box-shadow: none !important;
}

.datepicker_no_border {
  /* border: none !important; */
  border-color: #e30707;
  /* box-shadow: none !important; */
}

/* .date-picker-wrapper {
    background-color: #fff;
    border-color: #ced4da;
    border-radius: .25rem;
    box-shadow: none;
} */

.date-picker-wrapper {
  background-color: #e30700;
  border: none !important;
  box-shadow: none !important;
}

.no_border {
  background-color: #ffffff;
  border: none !important;
  box-shadow: none !important;
}

.date-picker-input {
  background-color: #fff;
  border-color: #ced4da;
  /* border: none !important; */
  color: #495057;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  /* line-height: 1.5; */
  line-height: 0;
  height: calc(1.5em + 0.75rem + 2px);
}

.hide {
  display: none;
  border: none !important;
}

/* .date-picker-container {
    position: relative;
    border: none !important;
}

.date-picker-wrapper {
    background-color: transparent !important;
    border: none !important;
}

.date-picker-input {
    background-color: transparent !important;
    border: none !important;
} */
</style>
