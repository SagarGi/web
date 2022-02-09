import { mapActions } from 'vuex'

export default {
  computed: {
    $_disable_items() {
      return [
        {
          name: 'disable',
          icon: 'forbid-2',
          label: () => {
            return this.$gettext('Disable')
          },
          handler: this.$_disable_trigger,
          isEnabled: ({ spaces }) => {
            if (spaces.length !== 1) {
              return false
            }

            return spaces[0].root?.deleted?.state !== 'trashed'
          },
          componentType: 'oc-button',
          class: 'oc-files-actions-disable-trigger'
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'createModal',
      'hideModal',
      'setModalInputErrorMessage',
      'showMessage',
      'toggleModalConfirmButton'
    ]),

    $_disable_trigger({ spaces }) {
      if (spaces.length !== 1) {
        return
      }

      const modal = {
        variation: 'danger',
        title: this.$gettext('Disable space') + ' ' + spaces[0].name,
        cancelText: this.$gettext('Cancel'),
        confirmText: this.$gettext('Disable'),
        icon: 'alarm-warning',
        message: this.$gettext('Are you sure you want to disable this space?'),
        hasInput: false,
        onCancel: this.hideModal,
        onConfirm: () => this.$_disable_disableSpace(spaces[0].id)
      }

      this.createModal(modal)
    },

    $_disable_disableSpace(id) {
      return this.graph.drives
        .deleteDrive(id)
        .then(() => {
          this.hideModal()
          this.loadSpacesTask.perform(this)
        })
        .catch((error) => {
          this.showMessage({
            title: this.$gettext('Disabling space failed…'),
            desc: error,
            status: 'danger'
          })
        })
    },

    isDisabled(space) {
      return false
    }
  }
}
