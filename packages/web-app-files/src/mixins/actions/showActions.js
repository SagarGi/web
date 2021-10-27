import { mapActions } from 'vuex'
import { isTrashbinRoute } from '../../helpers/route'

export default {
  computed: {
    $_showActions_items() {
      return [
        {
          icon: 'slideshow',
          label: () => this.$gettext('All Actions'),
          handler: this.$_showActions_trigger,
          isEnabled: () => true,
          componentType: 'oc-button',
          class: 'oc-files-actions-show-actions-trigger'
        }
      ]
    }
  },
  methods: {
    ...mapActions('Files/sidebar', { openSidebarWithPanel: 'openWithPanel' }),

    async $_showActions_trigger() {
      await this.openSidebarWithPanel(isTrashbinRoute(this.$route) ? null : 'actions-item')
    }
  }
}