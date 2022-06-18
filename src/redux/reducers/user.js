import {
    UNAUTHENTICATED,
    SET_PROFILE,
    ERROR_AUTHENTICATED,
    SET_AUTH,
    CLEAR_ERROR
} from '../constants/user'

const initialState = {
    entered: undefined,
    authenticated: undefined,
    profile: {},
    error: false,
}

export default function user(state = initialState, action) {
    switch (action.type) {

        case UNAUTHENTICATED:
            return {
                ...state,
                authenticated: false,
                error: false,
                profile: {}
            };

        case CLEAR_ERROR:
            return { ...state, error: false  };

        case ERROR_AUTHENTICATED:
            return { ...state, authenticated: false, error: action.payload  };

        case SET_PROFILE:
            return { ...state, profile: action.payload };

        case SET_AUTH:
            return { ...state, authenticated: action.payload };

        default:
            return state

    }
}