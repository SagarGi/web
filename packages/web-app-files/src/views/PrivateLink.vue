<template>
  <div
    class="oc-login oc-height-viewport"
    :style="{ backgroundImage: 'url(' + backgroundImg + ')' }"
  >
    <h1 class="oc-invisible-sr">{{ pageTitle }}</h1>
    <div class="oc-login-card oc-position-center">
      <img class="oc-login-logo" :src="logoImg" alt="" :aria-hidden="true" />
      <div v-if="loading" class="oc-login-card-body">
        <h2 class="oc-login-card-title">
          <translate>Resolving private link…</translate>
        </h2>
        <oc-spinner :aria-hidden="true" />
      </div>
      <div v-if="errorMessage" class="oc-login-card-body">
        <h2 class="oc-login-card-title">
          <translate>An error occurred while resolving the private link</translate>
        </h2>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createLocationSpaces } from '../router'

export default {
  data() {
    return {
      loading: true,
      errorMessage: null
    }
  },
  computed: {
    ...mapGetters(['configuration']),

    pageTitle() {
      return this.$gettext(this.$route.meta.title)
    },

    backgroundImg() {
      return this.configuration.currentTheme.loginPage.backgroundImg
    },

    logoImg() {
      return this.configuration.currentTheme.logo.login
    }
  },
  mounted() {
    // query oc10 server to translate fileId to real path
    this.loading = true
    this.$client.files
      .getPathForFileId(this.$route.params.fileId)
      .then((path) => {
        const lastSlash = path.lastIndexOf('/')
        const folder = path.substring(0, lastSlash).replace(/^(\/)/, '')
        const file = path.substring(lastSlash + 1)
        this.$router.push(
          createLocationSpaces('files-spaces-personal-home', {
            params: {
              item: folder || '/'
            },
            query: {
              scrollTo: file
            }
          })
        )
      })
      .catch((error) => {
        this.errorMessage = error
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
