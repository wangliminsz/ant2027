import axios from "axios";
import airtable from "airtable";
// import { createClient } from "@supabase/supabase-js";

// ~~~~~~~~~~~~~~~~~~~~

// const airtableUrl_vite = process.env.VITE_air_url;
// const airtableKey_vite = process.env.VITE_air_key;

// let air_url = "";
// air_url = airtableUrl_vite.replace(/^"|"$/g, "");

// let air_key = "";
// air_key = airtableKey_vite.replace(/^"|"$/g, "");

const airtableUrl = process.env.VUE_APP_AIR_URL;
const airtableKey = process.env.VUE_APP_AIR_KEY;

let air_url = "";
air_url = airtableUrl ? airtableUrl.replace(/^"|"$/g, "") : "";

let air_key = "";
air_key = airtableKey ? airtableKey.replace(/^"|"$/g, "") : "";




// ~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~

// const airtableBaseid_vite = process.env.VITE_base_id;
// const airtableTableid_vite = process.env.VITE_table_id;
// const airtableTablename_vite = process.env.VITE_table_name;

// let air_base_id = "";
// air_base_id = airtableBaseid_vite.replace(/^"|"$/g, "");

// let air_table_id = "";
// air_table_id = airtableTableid_vite.replace(/^"|"$/g, "");

// let air_table_name = "";
// air_table_name = airtableTablename_vite.replace(/^"|"$/g, "");

const airtableBaseId = process.env.VUE_APP_BASE_ID;
const airtableTableId = process.env.VUE_APP_TABLE_ID;
const airtableTableName = process.env.VUE_APP_TABLE_NAME;

let air_base_id = "";
air_base_id = airtableBaseId ? airtableBaseId.replace(/^"|"$/g, "") : "";

let air_table_id = "";
air_table_id = airtableTableId ? airtableTableId.replace(/^"|"$/g, "") : "";

let air_table_name = "";
air_table_name = airtableTableName ? airtableTableName.replace(/^"|"$/g, "") : "";

// ~~~~~~~~~~~~~~~~~~~~

// const supabaseUrl_vite = process.env.VITE_supa_url;
// const supabaseKey_vite = process.env.VITE_supa_key;

// let supa_url = "";
// supa_url = supabaseUrl_vite.replace(/^"|"$/g, "");

// let supa_key_bkk = "";
// supa_key_bkk = supabaseKey_vite.replace(/^"|"$/g, "");


const supabaseUrl = process.env.VUE_APP_SUPA_URL;
const supabaseKey = process.env.VUE_APP_SUPA_KEY;

let supa_url = "";
supa_url = supabaseUrl ? supabaseUrl.replace(/^"|"$/g, "") : "";

let supa_key_bkk = "";
supa_key_bkk = supabaseKey ? supabaseKey.replace(/^"|"$/g, "") : "";

// ~~~~~~~~~~~~~~~~~~~~

export class ContactService {
  // ant notify 2024-06
  static serverAirURL = air_url;
  static air_token = air_key;

  static table_name = air_table_name;
  static table_id = air_table_id;
  static base_id = air_base_id;

  static serverSupaURL = supa_url;
  static supa_key = supa_key_bkk;

  static getAllCondos(userId) {
    let dataURL;
    // 2024-12-18 Claude AI
    if (userId == "fe974050-059c-463d-88cb-cc55e401b2a3") {
      dataURL = `${this.serverAirURL}/${this.table_name}?filterByFormula=({record_del_flag}='no')`;
    } else {
      dataURL = `${this.serverAirURL}/${this.table_name}?filterByFormula==AND({user_id}='${userId}', {record_del_flag}='no')`;
    }

    console.log("dataURL--->>>", dataURL);
    // 2024-12-18
    // let dataURL = `${this.serverAirURL}/${this.table_name}?filterByFormula==AND({user_id}='${userId}', {record_del_flag}='no')`;
    //
    // thai_notify?filterByFormula==AND({user_id}='${userId}', {user_id}='${userId}')
    // thai_notify?filterByFormula=AND({id}=${contactId}, {user_id}='${userId}')
    // let dataURL = `${this.serverAirURL}/thai_notify`;
    // let dataURL = `${this.serverAirURL}/thai_notify?filterByFormula={user_id}='${userId}'`;

    let headers = {
      Authorization: `Bearer ${this.air_token}`,
    };

    return new Promise((resolve, reject) => {
      let allRecords = [];
      let offset = "";

      const fetchData = () => {
        axios
          .get(dataURL, {
            headers: headers,
            params: {
              offset: offset,
            },
          })
          .then((res) => {
            const { records, offset: newOffset } = res.data;
            // console.log('offset---->>>', offset, newOffset)
            allRecords = allRecords.concat(records);
            if (newOffset) {
              offset = newOffset;
              let dataURL;
              // 2024-12-18 Claude AI
              if (userId == "fe974050-059c-463d-88cb-cc55e401b2a3") {
                dataURL = `${this.serverAirURL}/${this.table_name}?filterByFormula=({record_del_flag}='no')`;
                console.log("dataURL--->>>", dataURL);
              } else {
                dataURL = `${this.serverAirURL}/${this.table_name}?filterByFormula==AND({user_id}='${userId}', {record_del_flag}='no')`;
                console.log("dataURL--->>>", dataURL);
              }
              fetchData();
            } else {
              resolve(allRecords);
            }
          })
          .catch((err) => {
            reject(err);
          });
      };

      fetchData();
    });
  }

  static getAllUsers() {
    let dataURL = `${this.serverSupaURL}/users_check?select=email`;
    let headers = {
      apikey: `${this.supa_key}`,
      Authorization: `Bearer ${this.supa_key}`,
    };
    return axios.get(dataURL, { headers: headers });
  }

  static async getCondo(contactId, userId) {

    let dataURL;
    // 2024-12-18 Claude AI
    if (userId == "fe974050-059c-463d-88cb-cc55e401b2a3") {
      dataURL = `${this.serverAirURL}/${this.table_name}?filterByFormula=AND({id}=${contactId}, {record_del_flag}='no')`;
    }else {
      dataURL = `${this.serverAirURL}/${this.table_name}?filterByFormula=AND({id}=${contactId}, {user_id}='${userId}', {record_del_flag}='no')`
    }
    

    let headers = {
      Authorization: `Bearer ${this.air_token}`,
    };
    return axios.get(dataURL, { headers: headers });
  }

  static createCondo(contact) {
    let dataURL = `${this.serverAirURL}/${this.table_name}`;
    let headers = {
      Authorization: `Bearer ${this.air_token}`,
    };
    return axios.post(dataURL, contact, { headers: headers });
  }

  // by chatGPT

  static async airInsertRecord(recordObj) {
    return new Promise((resolve, reject) => {
      // configure the Airtable base and API key
      airtable.configure({
        apiKey: `${this.air_token}`,
        endpointUrl: "https://api.airtable.com",
      });

      // select the Airtable base and table you want to insert the record into
      const base = airtable.base(`${this.base_id}`);
      const table = base(`${this.table_id}`);

      // console.log('why remind day err-->>>', recordObj)

      // insert the record into the Airtable table
      table.create(recordObj, { typecast: true }, (err, newRecord) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        // console.log(`New record created with ID ${newRecord.id}`);
        resolve(newRecord.id);
      });
    });
  }

  // by chatGPT

  static async deleteCondo(contactId) {
    return new Promise((resolve, reject) => {
      airtable.configure({
        apiKey: `${this.air_token}`,
        endpointUrl: "https://api.airtable.com",
      });
      // const base = airtable.base('appoblgGwVGW6XWbQ');
      // const table = base('tbl4LsW2rdIXD3AhN');
      const base = airtable.base(`${this.base_id}`);
      const table = base(`${this.table_id}`);

      table
        .select({ filterByFormula: `{id} = ${contactId}` })
        .firstPage((err, records) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          if (records.length > 0) {
            const record = records[0];
            const airId = record.id;

            // // delete fields that are not editable
            // delete recordObj.fields.id;
            // delete recordObj.fields.created_at;

            const recordObj = { event_del_flag: "yes", record_del_flag: "yes" };

            // update the record in Airtable
            // .fields
            table.update(airId, recordObj, (err, record) => {
              if (err) {
                console.error(err);
                reject(err);
                return;
              }

              console.log(
                `Delete Airtable record ID for ID ${contactId} is ${record.id}`
              );
              // resolve(record.id);
              resolve("deleted");
            });
          } else {
            console.log(`No record found with ID ${contactId}`);
            resolve(null);
          }
        });
    });
  }

  // by chatGPT

  static async airUpdateRecord(recordObj, contactId) {
    return new Promise((resolve, reject) => {
      airtable.configure({
        apiKey: `${this.air_token}`,
        endpointUrl: "https://api.airtable.com",
      });
      // const base = airtable.base('appoblgGwVGW6XWbQ');
      // const table = base('tbl4LsW2rdIXD3AhN');
      const base = airtable.base(`${this.base_id}`);
      const table = base(`${this.table_id}`);

      table
        .select({ filterByFormula: `{id} = ${contactId}` })
        .firstPage((err, records) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          if (records.length > 0) {
            const record = records[0];
            const airId = record.id;

            // delete fields that are not editable
            delete recordObj.fields.id;
            delete recordObj.fields.created_at;

            // thisConstObj = {'calendar_in':'no', 'event_del_flag':'yes'}
            // // Combine the objects using the spread operator
            // const combinedObj = {
            //   ...recordObj.fields,
            //   ...thisConstObj
            // };

            // console.log('2024-06 combined Obj --->>>', combinedObj)

            // update the record in Airtable
            // .fields
            table.update(airId, recordObj.fields, (err, record) => {
              if (err) {
                console.error(err);
                reject(err);
                return;
              }

              console.log(
                `Update Airtable record ID for ID ${contactId} is ${record.id}`
              );
              resolve(record.id);
              // resolve('updated');
            });
          } else {
            console.log(`No record found with ID ${contactId}`);
            resolve(null);
          }
        });
    });
  }

  // by chatGPT
}

// static async deleteCondo(contactId, userId) {
//   // let dataURL = `${this.serverAirURL}/thai_notify?id=eq.${contactId}&user_id=eq.${userId}`;
//   // const airtableId = contactId.toString();

//   airtable.configure({
//     apiKey: `${this.air_token}`,
//     endpointUrl: 'https://api.airtable.com'
//   });

//   // select the Airtable base and table you want to insert the record into
//   const base = airtable.base('appoblgGwVGW6XWbQ');
//   const table = base('tbl4LsW2rdIXD3AhN');

//   const recordQuery = await table.select({ filterByFormula: `{id} = ${contactId}` }).firstPage();

//   let airId = ''

//   if (recordQuery.length > 0) {
//     const record = recordQuery[0];
//     // console.log(`Airtable record ID for ID ${contactId} is ${record.id}`);
//     airId = record.id
//   } else {
//     console.log(`No record found with ID ${contactId}`);
//   }

//   if (airId) {
//     let dataURL = `${this.serverAirURL}/thai_notify?records%5B%5D=${airId}&user_id=${userId}`;
//     // return axios.delete(dataURL);
//     // console.log('dataURL 2024-05--->>>', dataURL)
//     let headers = {
//       'Authorization': `Bearer ${this.air_token}`
//     };
//     return axios.delete(dataURL, { headers: headers });
//   }
// }

// static async airUpdateRecord(recordObj, contactId) {

//   console.log('inside function --->>> 2024-06', contactId, recordObj)

//   return new Promise((resolve, reject) => {
//     airtable.configure({
//       apiKey: `${this.air_token}`,
//       endpointUrl: 'https://api.airtable.com'
//     });
//     const base = airtable.base('appoblgGwVGW6XWbQ');
//     const table = base('tbl4LsW2rdIXD3AhN');

//     table.select({ filterByFormula: `{id} = ${contactId}` }).firstPage((err, records) => {
//       if (err) {
//         console.log('iferr--->>>')
//         console.error(err);
//         reject(err);
//         return;
//       }

//       if (records.length > 0) {
//         const record = records[0];
//         const airId = record.id;

//         // delete fields that are not editable
//         delete recordObj.fields.id;
//         delete recordObj.fields.created_at;

//         // recordObj = recordObj
//         thisConstObj = {'calendar_in':'no', 'record_del_flag':'yes'}
//         // Combine the objects using the spread operator
//         const combinedObj = {
//           ...recordObj,
//           ...thisConstObj
//         };

//         // update the record in Airtable
//         table.update(airId, recordObj.fields, (err, record) => {
//           if (err) {
//             console.error(err);
//             reject(err);
//             return;
//           }

//           console.log(`Airtable record ID for ID ${contactId} is ${record.id}`);
//           resolve(record.id);
//         });
//       } else {
//         console.log(`No record found with ID ${contactId}`);
//         resolve(null);
//       }
//     });
//   });
// }

// static getAllCondos_Only_100(userId) {
//   // let dataURL = `${this.serverURL}/thai_notify?user_id=eq.${userId}`;
//   // console.log(userId)
//   // GET https://api.airtable.com/v0/appoblgGwVGW6XWbQ/thai_notify?filterByFormula=AND({id}=16, {user_id}='123')
//   // ?filterByFormula={id}=16
//   // supa let dataURL = `${this.serverAirURL}/thai_notify?user_id=${userId}`;
//   // airtable
//   let dataURL = `${this.serverAirURL}/thai_notify?filterByFormula={user_id}='${userId}'`;

//   // ?user_id=${userId}`;
//   // console.log('All condos----------->',userId)
//   // let dataURL = `${this.serverURL}/contacts`;
//   let headers = {
//     'Authorization': `Bearer ${this.air_token}`
//   };
//   // console.log('headers----------->',headers)
//   return axios.get(dataURL, { headers: headers });
// }
