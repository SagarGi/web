import { mapActions } from 'vuex'

export default {
  computed: {
    $_rename_items() {
      return [
        {
          name: 'rename',
          icon: 'edit',
          label: () => {
            return this.$gettext('Rename')
          },
          handler: this.$_rename_trigger,
          isEnabled: ({ spaces }) => spaces.length === 1,
          componentType: 'oc-button',
          class: 'oc-files-actions-rename-trigger'
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

    $_rename_trigger({ spaces }) {
      if (spaces.length !== 1) {
        return
      }

      const modal = {
        variation: 'passive',
        title: this.$gettext('Rename space') + ' ' + spaces[0].name,
        cancelText: this.$gettext('Cancel'),
        confirmText: this.$gettext('Rename'),
        hasInput: true,
        inputLabel: this.$gettext('Space name'),
        inputValue: spaces[0].name,
        onCancel: this.hideModal,
        onConfirm: (name) => this.$_rename_renameSpace(spaces[0].id, name),
        onInput: this.$_rename_checkName
      }

      this.createModal(modal)
    },

    $_rename_checkName(name) {
      if (name.trim() === '') {
        return this.setModalInputErrorMessage(this.$gettext('Space name cannot be empty'))
      }
      return this.setModalInputErrorMessage(null)
    },

    $_rename_renameSpace(id, name) {
      return this.graph.drives
        .updateDrive(id, { name }, {})
        .then(() => {
          this.hideModal()
          this.loadSpacesTask.perform(this)
        })
        .catch((error) => {
          this.showMessage({
            title: this.$gettext('Renaming space failed…'),
            desc: error,
            status: 'danger'
          })
        })
    }
  }
}
