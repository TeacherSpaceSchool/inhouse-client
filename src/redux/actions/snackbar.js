import { CLOSE_SNACKBAR, SHOW_SNACKBAR } from '../constants/snackbar'

export function showSnackBar(title, type) {
    return {
        type: SHOW_SNACKBAR,
        payload: {title, type}
    }
}

export function closeSnackBar() {
    return {
        type: CLOSE_SNACKBAR,
    }
}
