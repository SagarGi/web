import App from '../../src/App.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import fetchMock from 'jest-fetch-mock'
import Vuex from 'vuex'
import GetTextPlugin from 'vue-gettext'

const localVue = createLocalVue()

localVue.use(GetTextPlugin, {
  translations: 'does-not-matter.json',
  silent: true
})
localVue.use(Vuex)

const componentStubs = {
  ErrorScreen: true,
  LoadingScreen: true
}

const $route = {
  params: {
    app: 'exampleApp',
    file_id: '2147491323'
  }
}

const storeOptions = {
  getters: {
    getToken: jest.fn(() => 'GFwHKXdsMgoFwt'),
    configuration: jest.fn(() => ({
      server: 'http://example.com/'
    })),
    capabilities: jest.fn(() => ({
      files: {
        app_providers: [
          {
            apps_url: '/app/list',
            enabled: true,
            open_url: '/app/open'
          }
        ]
      }
    }))
  },
  modules: {
    External: {
      namespaced: true,
      getters: {
        getMimeTypes: jest.fn()
      },
      actions: {
        fetchMimeTypes: jest.fn()
      },
      mutations: {
        SET_MIME_TYPES: jest.fn()
      }
    }
  }
}

const appUrl = 'https://example.test/d12ab86/loe009157-MzBw'

const providerSuccessResponsePost = {
  app_url: appUrl,
  method: 'POST',
  form_parameters: {
    access_token: 'asdfsadfsadf',
    access_token_ttl: '123456'
  }
}

const providerSuccessResponseGet = {
  app_url: appUrl,
  method: 'GET'
}

describe('The app provider extension', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
    fetchMock.resetMocks()
  })

  it('should show a loading spinner while loading', () => {
    global.fetch = jest.fn(() =>
      setTimeout(() => {
        Promise.resolve({
          ok: true,
          status: 200
        })
      }, 500)
    )
    const wrapper = createShallowMountWrapper()

    expect(wrapper).toMatchSnapshot()
  })
  it('should show a meaningful message if an error occurs during loading', async () => {
    fetchMock.mockReject(new Error('fake error message'))
    const wrapper = createShallowMountWrapper()
    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })
  it('should fail for unauthenticated users', async () => {
    fetchMock.mockResponseOnce({ status: 401 })
    const wrapper = createShallowMountWrapper()
    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })
  it('should be able to load an iFrame via get', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => providerSuccessResponseGet
      })
    )

    const wrapper = createShallowMountWrapper()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })
  it('should be able to load an iFrame via post', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => providerSuccessResponsePost
      })
    )

    const wrapper = createShallowMountWrapper()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper).toMatchSnapshot()
  })
})

function createShallowMountWrapper(options = {}) {
  return shallowMount(App, {
    localVue,
    store: createStore(),
    stubs: componentStubs,
    mocks: {
      $route
    },
    ...options
  })
}

function createStore() {
  return new Vuex.Store(storeOptions)
}