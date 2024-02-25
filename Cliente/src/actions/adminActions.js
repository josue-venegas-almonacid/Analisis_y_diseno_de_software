export const ADMIN_ENABLED = 'ADMIN_ENABLED';
export const ADMIN_DISABLED = 'ADMIN_DISABLED';

export const admin_on = () => {
    return {
        type: ADMIN_ENABLED,
        payload: {
            isAdmin: true,
        },
    }
}

export const admin_off = () => {
    return {
        type: ADMIN_DISABLED,
        payload: {
            isAdmin: false,
        },
    }
}