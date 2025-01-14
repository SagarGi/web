import { RouteComponents } from './router'
import { Location, RouteConfig } from 'vue-router'
import { $gettext, createLocation, isLocationActiveDirector } from './utils'

type operationsTypes =
  | 'files-operations-location-picker'
  | 'files-operations-resolver-private-link'
  | 'files-operations-resolver-public-link'

export const createLocationOperations = (name: operationsTypes, location = {}): Location =>
  createLocation(name, location)

const locationLocationPicker = createLocationOperations('files-operations-location-picker')
const locationResolverPublicLink = createLocationOperations('files-operations-resolver-public-link')
const locationResolverPrivateLink = createLocationOperations(
  'files-operations-resolver-private-link'
)

export const isLocationOperationsActive = isLocationActiveDirector<operationsTypes>(
  locationLocationPicker,
  locationResolverPublicLink,
  locationResolverPrivateLink
)

export const buildRoutes = (components: RouteComponents): RouteConfig[] => [
  {
    name: locationLocationPicker.name,
    path: '/ops/location-picker/:context/:action/:item*',
    components: {
      app: components.LocationPicker
    },
    meta: {
      verbose: true,
      auth: false,
      patchCleanPath: true
    }
  },
  {
    name: locationResolverPublicLink.name,
    path: '/ops/resolver/public-link/:token',
    components: {
      fullscreen: components.PublicLink
    },
    meta: {
      auth: false,
      hideHeadbar: true,
      title: $gettext('Resolving public link')
    }
  },
  {
    name: locationResolverPrivateLink.name,
    path: '/ops/resolver/private-link/:fileId',
    components: {
      fullscreen: components.PrivateLink
    },
    meta: { hideHeadbar: true, title: $gettext('Resolving private link') }
  }
]
