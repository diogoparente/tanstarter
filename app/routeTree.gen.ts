/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignupImport } from './routes/signup'
import { Route as SigninImport } from './routes/signin'
import { Route as DashboardImport } from './routes/dashboard'
import { Route as IndexImport } from './routes/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'

// Create/Update Routes

const SignupRoute = SignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const SigninRoute = SigninImport.update({
  id: '/signin',
  path: '/signin',
  getParentRoute: () => rootRoute,
} as any)

const DashboardRoute = DashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/signin': {
      id: '/signin'
      path: '/signin'
      fullPath: '/signin'
      preLoaderRoute: typeof SigninImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardImport
    }
  }
}

// Create and export the route tree

interface DashboardRouteChildren {
  DashboardIndexRoute: typeof DashboardIndexRoute
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardIndexRoute: DashboardIndexRoute,
}

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/signin': typeof SigninRoute
  '/signup': typeof SignupRoute
  '/dashboard/': typeof DashboardIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/signin': typeof SigninRoute
  '/signup': typeof SignupRoute
  '/dashboard': typeof DashboardIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/signin': typeof SigninRoute
  '/signup': typeof SignupRoute
  '/dashboard/': typeof DashboardIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/dashboard' | '/signin' | '/signup' | '/dashboard/'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/signin' | '/signup' | '/dashboard'
  id: '__root__' | '/' | '/dashboard' | '/signin' | '/signup' | '/dashboard/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DashboardRoute: typeof DashboardRouteWithChildren
  SigninRoute: typeof SigninRoute
  SignupRoute: typeof SignupRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DashboardRoute: DashboardRouteWithChildren,
  SigninRoute: SigninRoute,
  SignupRoute: SignupRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/dashboard",
        "/signin",
        "/signup"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard.tsx",
      "children": [
        "/dashboard/"
      ]
    },
    "/signin": {
      "filePath": "signin.tsx"
    },
    "/signup": {
      "filePath": "signup.tsx"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx",
      "parent": "/dashboard"
    }
  }
}
ROUTE_MANIFEST_END */
