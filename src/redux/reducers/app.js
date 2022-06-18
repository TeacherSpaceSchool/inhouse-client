import { SET_PRINTER, SET_SHOW_LIGHTBOX, SET_COLUMNS, SET_IMAGES_LIGHTBOX, SET_INDEX_LIGHTBOX, SHOW_APPBAR, SHOW_DRAWER, SET_WORK_SHIFT, SET_FILTER, SET_SORT, SET_SEARCH, SET_IS_MOBILE_APP, SHOW_LOAD, SET_DATE, SET_LEGALOBJECT, SET_BRANCH, SET_CASHBOX, SET_CLIENT, SET_CASHIER } from '../constants/app'

const initialState = {
    showAppBar: true,
    drawer: false,
    search: '',
    filter: '',
    sort: '-createdAt',
    isMobileApp: undefined,
    load: false,
    date: '',
    legalObject: undefined,
    printer: undefined,
    branch: undefined,
    cashbox: undefined,
    cashier: undefined,
    client: undefined,
    workShift: undefined,
    showLightbox: false,
    columns: [],
    imagesLightbox: [],
    indexLightbox: 0,
}

export default function mini_dialog(state = initialState, action) {
    switch (action.type) {
        case SET_PRINTER:
            return {...state, printer: action.payload}
        case SHOW_APPBAR:
            return {...state, showAppBar: action.payload}
        case SET_COLUMNS:
            return {...state, columns: action.payload}
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
        case SET_LEGALOBJECT:
            return {...state, legalObject: action.payload}
        case SET_DATE:
            return {...state, date: action.payload}
        case SET_BRANCH:
            return {...state, branch: action.payload}
        case SET_CASHBOX:
            return {...state, cashbox: action.payload}
        case SET_CLIENT:
            return {...state, client: action.payload}
        case SET_CASHIER:
            return {...state, cashier: action.payload}
        case SET_WORK_SHIFT:
            return {...state, workShift: action.payload}
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