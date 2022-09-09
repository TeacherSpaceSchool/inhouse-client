import { SET_CONSULTATION, SET_SHOW_LIGHTBOX, SET_COLUMNS, SET_IMAGES_LIGHTBOX, SET_INDEX_LIGHTBOX, SHOW_APPBAR, SHOW_DRAWER, SET_SEARCH, SET_FILTER, SET_SORT, SET_IS_MOBILE_APP, SHOW_LOAD, SET_DATE } from '../constants/app'

export function setConsultation(data) {
    return {
        type: SET_CONSULTATION,
        payload: data
    }
}

export function setColumns(data) {
    return {
        type: SET_COLUMNS,
        payload: data
    }
}

export function setShowLightbox(data) {
    return {
        type: SET_SHOW_LIGHTBOX,
        payload: data
    }
}

export function setImagesLightbox(data) {
    return {
        type: SET_IMAGES_LIGHTBOX,
        payload: data
    }
}

export function setIndexLightbox(data) {
    return {
        type: SET_INDEX_LIGHTBOX,
        payload: data
    }
}

export function setShowAppBar(data) {
    return {
        type: SHOW_APPBAR,
        payload: data
    }
}

export function showDrawer(data) {
    return {
        type: SHOW_DRAWER,
        payload: data
    }
}

export function setFilter(data) {
    return {
        type: SET_FILTER,
        payload: data
    }
}

export function setDate(data) {
    return {
        type: SET_DATE,
        payload: data
    }
}

export function setSort(data) {
    return {
        type: SET_SORT,
        payload: data
    }
}

export function setSearch(data) {
    return {
        type: SET_SEARCH,
        payload: data
    }
}

export function setIsMobileApp(data) {
    return {
        type: SET_IS_MOBILE_APP,
        payload: data
    }
}

export function showLoad(show) {
    return {
        type: SHOW_LOAD,
        payload: show
    }
}