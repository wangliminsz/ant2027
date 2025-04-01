<template>
  <!-- {{  contact.fields }} -->
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col">
          <p class="h3 text-success fw-bold">Edit Estate</p>
          <!-- <p class="fst-italic"> Edit Lorem ipsum dolor sit amet consectetur adipisicing elit </p> -->
          <!-- <br> -->
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

    <!-- <pre> {{  contact }}</pre> -->

    <div class="container mt-3" v-if="!loading">
      <div class="row">
        <div class="col-md-4">
          <form @submit.prevent="myUpdate">
            <div class="mb-2" v-if="contact && contact.fields">
              <input
                v-model="contact.fields.name"
                type="text"
                class="form-control"
                placeholder="Estate Name"
                :class="{ 'is-invalid': contact.fields.name && !isValidName }"
              />
              <div
                v-if="contact.fields.name && !isValidName"
                class="invalid-feedback"
              >
                Please enter a valid Estate name.
              </div>
            </div>

            <div class="mb-2" v-if="contact && contact.fields">
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

            <div class="mb-2" v-if="contact && contact.fields">
              <!-- {{ the_RentStart }} -->
              <div class="form-control date-picker-container">
                <DatePicker v-model="the_RentStart" placeholder="Start Date" />
              </div>
            </div>

            <div class="mb-2" v-if="contact && contact.fields">
              <!-- {{ the_RentEnd }} -->
              <div class="form-control date-picker-container">
                <DatePicker v-model="the_RentEnd" placeholder="End Date" />
              </div>
            </div>

            <div class="mb-2">
              <select v-model="contact.fields.pay_period" class="form-control">
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>

            <div class="mb-2">
              <select v-model="contact.fields.which_bot" class="form-control">
                <option value="" disabled selected>Select a Bot</option>
                <option value="ant_assist">ant_assist</option>
                <option value="ant_assist_1">ant_assist_1</option>
              </select>
            </div>

            <div class="mb-2" v-if="contact && contact.fields">
              <input
                v-model="contact.fields.group_id"
                type="text"
                class="form-control"
                placeholder="Group Id"
                :class="{
                  'is-invalid': contact.fields.group_id && !isValidGroupId,
                }"
              />
              <div
                v-if="contact.fields.group_id && !isValidGroupId"
                class="invalid-feedback"
              >
                Please enter a valid Line Group Id.
              </div>
            </div>

            <div class="mb-2">
              <textarea
                v-model="contact.fields.memo"
                class="form-control"
                rows="5"
                placeholder="Memo"
                :class="{ 'is-invalid': contact.fields.memo && !isValidMemo }"
              ></textarea>
              <div
                v-if="contact.fields.memo && !isValidMemo"
                class="invalid-feedback"
              >
                Please enter a valid Memo.
              </div>
            </div>

            <!-- <div class="row mt-3"> -->
            <div class="d-flex flex-wrap mt-3">
              <div class="col-md-3">
                <input
                  type="submit"
                  class="btn btn-success"
                  value="Update"
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
      </div>
    </div>
  </div>
</template>

<script>
import { ContactService } from "@/services/ContactService";
import mySpinner from "@/components/Spinner.vue";

import { supabase } from "@/clients/supabase";

import DatePicker from "vue3-datepicker";

export default {
  name: "EditContact",

  components: {
    DatePicker,
    mySpinner,
  },

  data() {
    return {
      the_RentStart: null,
      the_RentEnd: null,
      the_RemindDay: null,

      contactId: this.$route.params.contactId,
      contact: {
        name: "",
        // created_at: '',
        // remind_day: '',
        rent_start: "",
        rent_end: "",
        // notify_token: "",
        group_id: "",
        updated_at: "",
        which_bot: "",
      },
      // groups: [],
      // mygroup: {},

      errorMessage: "",
      loading: false,

      currentUserId: "",
    };
  },

  created: async function () {
    this.loading = true;
    this.currentUserId = await this.currentUser();

    if (this.currentUserId) {
      try {
        this.loading = true;
        let response = await ContactService.getCondo(
          this.contactId,
          this.currentUserId
        );
        if (response) {
          // this.contact = response.data[0]
          this.contact = response.data.records[0];
          // this.the_RentStart = this.contact.fields.rent_start
          // this.the_RentEnd = this.contact.fields.rent_end
          // this.the_RemindDay = Number(this.contact.fields.remind_day)

          console.log("Edit Create ------->>", this.contact.fields)
          // console.log("Create ------->>", this.contact.fields.rent_start)
          this.the_RentStart = new Date(this.contact.fields.rent_start);
          this.the_RentEnd = new Date(this.contact.fields.rent_end);
          this.the_RemindDay = Number(this.contact.fields.remind_day);

          // console.log("Create ------->>", this.the_RentStart)
          // console.log("Create ------->>", this.the_RentEnd)
          // console.log("Create ------->>", this.the_RemindDay)

          // console.log("edit ---->", this.contact);
          // console.log("edit pay_period ---->", this.contact.pay_period);
          // let groupsResponse = await ContactService.getAllGroups()
          // if (groupsResponse) {
          //     this.groups = groupsResponse.data
          //     // console.log('this.group---------->',this.group)
          // }
          this.loading = false;
        }
      } catch (error) {
        this.errorMessage = error;
        // console.log("error");
        this.loading = false;
      }
    }
  },

  //   mounted() {
  //     const load_Pay_Period = this.contact.fields.pay_period
  //     console.log('----------------------------->', load_Pay_Period)
  //     this.contact.fields.pay_period = load_Pay_Period
  //   },

  watch: {
    // Watch for changes on rent_start
    the_RentStart: function (newDate) {
      if (newDate) {
        // console.log('inside watch--->', newDate)
        // Convert to local date string and slice to only get yyyy-mm-dd
        let dateWithCorrectTimeZone = new Date(
          Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
        );
        this.contact.fields.rent_start = dateWithCorrectTimeZone
          .toISOString()
          .slice(0, 10);
      }

      // if (newDate) {
      //   // Convert the string to a Date object
      //   let dateObj = new Date(newDate);

      //   // Convert to local date string and adjust it to the correct timezone
      //   let dateWithCorrectTimeZone = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));

      //   // Truncate the string to only include yyyy-mm-dd
      //   this.contact.rent_start = dateWithCorrectTimeZone.toISOString().slice(0, 10);
      // }
    },

    the_RentEnd: function (newDate) {
      if (newDate) {
        // Convert to local date string and slice to only get yyyy-mm-dd
        let dateWithCorrectTimeZone = new Date(
          Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
        );
        this.contact.fields.rent_end = dateWithCorrectTimeZone
          .toISOString()
          .slice(0, 10);
      }

      // if (newDate) {
      //   // Convert the string to a Date object
      //   let dateObj = new Date(newDate);

      //   // Convert to local date string and adjust it to the correct timezone
      //   let dateWithCorrectTimeZone = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));

      //   // Truncate the string to only include yyyy-mm-dd
      //   this.contact.rent_end = dateWithCorrectTimeZone.toISOString().slice(0, 10);
      // }
    },

    the_RemindDay: function (newDay) {
      if (newDay) {
        // Convert to local date string and slice to only get yyyy-mm-dd
        this.contact.fields.remind_day = newDay.toString();
      }
    },
  },

  computed: {
    // isValidName() {
    //     return Boolean(this.contact.fields.name);
    // },
    isValidName() {
      return (
        this.contact &&
        this.contact.fields &&
        this.contact.fields.name !== undefined &&
        this.contact.fields.name !== ""
      );
    },
    isValidAddress() {
      return true;
    },
    isValidRemindDay() {
      const remindDay = Number(this.contact.fields.remind_day);
      return !isNaN(remindDay) && remindDay >= 1 && remindDay <= 31;
    },

    // isValidRentStart() {
    //   const dateStr = this.contact.fields.rent_start;
    //   const dateObj = new Date(dateStr);
    //   return dateObj instanceof Date && !isNaN(dateObj);
    // },
    // isValidRentEnd() {
    //   const dateStr = this.contact.fields.rent_end;
    //   const dateObj = new Date(dateStr);
    //   return dateObj instanceof Date && !isNaN(dateObj);
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
    //     return Boolean(this.contact.fields.groupId);
    // },

    isFormValid() {
      return (
        this.isValidName &&
        // this.isValidAddress &&
        this.isValidRemindDay
        // this.isValidRentStart &&
        // this.isValidRentEnd
        // this.isValidGroup
      );
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      console.log("mydate-------->");
      return `${day}/${month}/${year}`;
    },

    async currentUser() {
      const localUser = await supabase.auth.getSession();
      if (localUser.data.session) {
        // it'ok
        // console.log(localUser)
        // console.log('user-id----------->', localUser.data.session.user.id)
        // console.log('user-email-------->', localUser.data.session.user.email)
        // it'ok
        return localUser.data.session.user.id;
      } else {
        console.log("not signin");
      }
    },

    async myUpdate() {
      // this.loading = true;
      this.currentUserId = await this.currentUser();

      if (this.currentUserId) {
        try {
          this.contact.fields.created_at = new Date().toISOString();
          this.contact.fields.updated_at = new Date().toISOString();

          this.contact.fields.calendar_in = "no";
          this.contact.fields.event_del_flag = "yes";

          // let response = await ContactService.updateCondo(this.contact, this.contactId, this.currentUserId)
          let response = await ContactService.airUpdateRecord(
            this.contact,
            this.contactId
          );

          // console.log("from edit page ---->", this.contact);
          // console.log("from edit page ---->", this.contact);
          // console.log("gpt from edit page response ---->", response);

          await this.$store.dispatch("clearHomeAction");

          if (response) {
            this.loading = false;
            // console.log("ok---------> Updated");
            // this.$router.push('/')
            const currentRoute = this.$router.currentRoute;
            if (currentRoute.path !== "/") {
              this.$router.push("/"); // Navigate to the page
            }
          } else {
            this.loading = false;
            // this.$router.push(`/contacts/edit/${this.contactId}`)
            const currentRoute = this.$router.currentRoute;
            if (currentRoute.path !== `/contacts/edit/${this.contactId}`) {
              this.$router.push(`/contacts/edit/${this.contactId}`); // Navigate to the page
            }
          }
        } catch (error) {
          this.errorMessage = error;
          // console.log(this.errorMessage);
          this.loading = false;
        }
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
