<template>
  <div
    class="
      px-4
      col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4
      mx-auto
      animate__animated animate__fadeIn
    "
  >
    <!-- form -->
    <form @submit.prevent="handleSubmit">
      <!-- title -->
      <h1 class="mb-3">Reset Password</h1>

      <!-- alert -->
      <div
        v-if="alert.type"
        :class="`alert-${alert.type}`"
        class="mb-3 alert animate__animated animate__zoomIn animate__faster"
      >
        {{ alert.msg }}
      </div>

      <!-- password -->
      <div class="mb-3">
        <label for="new-password" class="form-label">New password</label>
        <input
          v-model="newPassword"
          minlength="8"
          type="password"
          class="form-control"
          id="new-password"
          :disabled="loading"
          required
        />
      </div>

      <!-- confirmed password -->
      <div class="mb-3">
        <label for="new-confirmed-password" class="form-label">New confirmed password</label>
        <input
          v-model="newConfirmedPassword"
          minlength="8"
          type="password"
          class="form-control"
          id="new-confirmed-password"
          :disabled="loading"
          required
        />
      </div>

      <!-- button -->
      <button type="submit" class="btn btn-dark" :disabled="loading">
        <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>

        <span v-if="!loading"> Submit </span>
        <span v-if="loading"> Loading... </span>
      </button>
    </form>
  </div>
</template>

<script>
  import { sleep } from '../../../../utils/helpers.js';

  export default {
    props: ['uid'],
    data() {
      return {
        newPassword: '',
        newConfirmedPassword: '',
        loading: false,
        token: this.$route.query.token,
        alert: {
          type: '',
          msg: '',
        },
      };
    },
    mounted() {
      this.token = this.$route.query.token;
    },
    methods: {
      async handleSubmit() {
        try {
          this.loading = true;

          // TODO!: handle validation from client

          const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: this.uid,
              token: this.token,
              newPassword: this.newPassword,
              newConfirmedPassword: this.newConfirmedPassword,
            }),
          });

          const json = await res.json();

          if (!res.ok) {
            this.loading = false;
            throw json.errors;
          }

          this.loading = false;

          this.alert.type = 'success';
          this.alert.msg = `Your password has been successfully changed. We will redirect you to login page in a few seconds!`; // prettier-ignore
          this.email = '';

          await sleep(5000);

          this.$router.push('/login');
        } catch (e) {
          this.alert.type = 'danger';
          this.alert.msg = e.map((cur) => cur.msg).join(' ');
        }
      },
    },
  };
</script>
