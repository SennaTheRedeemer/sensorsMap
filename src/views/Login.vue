<template>
  <v-app id="inspire" dir="rtl">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>התחברות למערכת</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :href="source"
                      icon
                      large
                      target="_blank"
                      v-on="on"
                    >
                      <v-icon>mdi-crown</v-icon>
                    </v-btn>
                  </template>
                  <span>אופיר בר יעקב נוראי נורני המלך</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="מספר אישי"
                    hint="לדוגמא s9999999"
                    name="Username"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="militaryID"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="סיסמא"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                  ></v-text-field>
                  <v-overflow-btn
                    :items="domains"
                    prepend-icon="mdi-server"
                    label="בחר דומיין"
                    editable
                    item-value="text"
                    v-model="domain"
                  ></v-overflow-btn>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">התחבר</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  export default {
    props: {
      source: String,
      url: String,
      port: Number
    },
    data: () => {
      return {
        militaryID: undefined,
        password: undefined,
        domain: undefined,
        domains: [
          'Retina',
          'Iris',
          'Dev'
        ]
      }
    },
    methods: {
      login: function() {
        // axios.get(`${this.url}:${this.port}/${this.militaryID}/${this.password}/${this.domain}`).then(response => 
        //   {
        //     if(response.data){
              this.$emit('finishLogin')
              this.$alertify.success(`שלום ${this.militaryID} התחברת בהצלחה!`);
        //     }
        //      else{
        //          alert('לא נכון')
        //      }
        //   }
        // )}
      }
    }
  }
</script>