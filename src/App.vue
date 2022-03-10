<template>
  <v-app>
    <div class="side-bar"></div>
    <v-app-bar
      app
      color="primary"
      dark
      class="header"
    >

      <v-spacer></v-spacer>

      <v-btn
        text
        style="background-color: #F5F8FA; color: black"
        v-if="!$auth.isAuthenticated && !$auth.loading"
      >
        <span class="mr-2" @click="login">Войти</span>
      </v-btn>
      <v-menu offset-y v-if="$auth.isAuthenticated">
        <template v-slot:activator="{on, attrs}">
          <v-list-item-avatar>
            <img
              :src="$auth.user.picture"
              alt="John"
              v-bind="attrs"
              v-on="on"
            >
          </v-list-item-avatar>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{$auth.user.nickname}}</v-list-item-title>
              <v-list-item-subtitle>{{$auth.user.email}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
          >
            <v-list-item-title>
              <v-btn
                text
                v-if="$auth.isAuthenticated"
                @click="logout"
                style="width: 100%; background-color: #F5F8FA;"
              >
                Выйти
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-progress-circular
        v-if="$auth.loading"
        indeterminate
        color="purple"
      ></v-progress-circular>
    </v-app-bar>

    <v-main class="main" style="padding-left: 205px; padding-right: 105px">
      <h1 v-if="!$auth.isAuthenticated && !$auth.loading">Необходима авторизация</h1>
      <v-card class="table" v-if="$auth.isAuthenticated">
        <v-data-table
          :headers="headers"
          :items="data"
          :search="search"
          :disable-sort="true"
          :items-per-page="10"
          @update:page="(page) => changePage(page)"
          :loading="loading"
          :server-items-length="itemCount"
        ></v-data-table>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import {fetchScans, fetchIdentities} from "./api";
export default {
  name: 'App',
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'ID',
        },
        {
          text: 'FullName',
          value: 'FullName',
        },
        {
          text: 'CreatedAt',
          value: 'CreatedAt',
        },
        {
          text: 'VerdictName',
          value: 'VerdictName',
        },
        {
          text: 'EyeColor',
          value: 'EyeColor',
        },
        {
          text: 'City',
          value: 'City',
        },
      ],
      data: [],
      page: 1,
      loading: true,
      itemCount: 0
    }
  },
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout();
    },
    async changePage(page) {
      this.page = page
      await this.getScans()
    },
    async getScans() {
      this.loading = true
      const ids = []
      const token = await this.$auth.getTokenSilently()
      const {data: scans} = await fetchScans(token, this.page)
      this.itemCount = scans.Pagination.Pages
      scans.Data.forEach(scan => {
        if (!ids.includes(scan.IdentityID)) {
          ids.push(scan.IdentityID)
        }
      })
      const {data: identities} =  await fetchIdentities(token, ids)
      console.log(identities)
      this.data = scans.Data.map(scan => {
        const ident = identities.Data.find(i => i.ID === scan.IdentityID)
        return {
          FullName: ident.FullName,
          EyeColor: ident.EyeColor,
          City: ident.City,
          ...scan,
        }
      })
      this.loading = false
    }
  },
  created() {
    this.$auth.$watch("loading", async () => {
      await this.getScans(this.page)
    });
  }
};
</script>
