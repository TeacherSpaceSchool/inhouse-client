import { SET_CONSULTATION, SET_SHOW_LIGHTBOX, SET_COLUMNS, SET_IMAGES_LIGHTBOX, SET_INDEX_LIGHTBOX, SHOW_APPBAR, SHOW_DRAWER, SET_SEARCH, SET_FILTER, SET_SORT, SET_IS_MOBILE_APP, SHOW_LOAD, SET_DATE } from '../constants/app'

const initialState = {
    showAppBar: true,
    drawer: false,
    search: '',
    filter: {},
    filterType: undefined,
    sort: '-createdAt',
    isMobileApp: undefined,
    load: false,
    date: '',
    showLightbox: false,
    columns: [],
    consultation: null,
    imagesLightbox: [],
    indexLightbox: 0
}

export default function mini_dialog(state = initialState, action) {
    switch (action.type) {
        case SHOW_APPBAR:
            return {...state, showAppBar: action.payload}
        case SET_COLUMNS:
            return {...state, columns: action.payload}
        case SET_CONSULTATION:
            return {...state, consultation: action.payload}
        case SHOW_DRAWER:
            return {...state, drawer: action.payload}
        case SET_SORT:
            return {...state, sort: action.payload}
        case SET_FILTER:
            return {...state, filter: action.payload}
        case SET_SEARCH:
            return {...state, search: action.payload}
        case SET_IS_MOBILE_APP:
            return {...state, isMobileApp: action.payload}
        case SHOW_LOAD:
            return {...state, load: action.payload}
        case SET_DATE:
            return {...state, date: action.payload}
        case SET_SHOW_LIGHTBOX:
            return {...state, showLightbox: action.payload}
        case SET_INDEX_LIGHTBOX:
            return {...state, indexLightbox: action.payload}
        case SET_IMAGES_LIGHTBOX:
            return {...state, imagesLightbox: action.payload}
        default:
            return state
    }
}