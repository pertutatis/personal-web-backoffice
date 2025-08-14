import { RouteRecordRaw } from 'vue-router'

export const seriesRoutes: RouteRecordRaw[] = [
  {
    path: '/series',
    name: 'SeriesList',
    component: () => import('@/views/series/SeriesListView.vue')
  },
  {
    path: '/series/:id',
    name: 'SeriesDetail',
    component: () => import('@/views/series/SeriesDetailView.vue'),
    props: true
  }
]
