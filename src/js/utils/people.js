// @flow

/**
 * Calculate strength of a given password
 * Length ,capital, and specials
 * @param {string} password
 */
export function calculateStrength(password: string): number {
    let complexity = 0;
    if (password) {
        if (password.length <= 6) {
            complexity = 1;
        }
        if (
            password.length <= 6 &&
            ((password.match(/[a-z]/) && password.match(/\d+/)) ||
                (password.match(/[A-Z]/) && password.match(/\d+/)) ||
                (password.match(/[a-z]/) && password.match(/[A-Z]/)))
        ) {
            complexity = 2;
        }
        if (
            password.length <= 6 &&
            password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/) &&
            ((password.match(/[a-z]/) && password.match(/\d+/)) ||
                (password.match(/[A-Z]/) && password.match(/\d+/)) ||
                (password.match(/[a-z]/) && password.match(/[A-Z]/)))
        ) {
            complexity = 3;
        }
        if (
            password.length <= 6 &&
            password.match(/[a-z]/) &&
            password.match(/\d+/) &&
            password.match(/[A-Z]/)
        ) {
            complexity = 4;
        }
        if (
            password.length <= 6 &&
            password.match(/[a-z]/) &&
            password.match(/\d+/) &&
            password.match(/[A-Z]/) &&
            password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)
        ) {
            complexity = 5;
        }
        if (
            password.length > 6 &&
            (password.match(/[a-z]/) ||
                password.match(/\d+/) ||
                password.match(/[A-Z]/))
        ) {
            complexity = 2;
        }
        if (
            password.length > 6 &&
            ((password.match(/[a-z]/) && password.match(/\d+/)) ||
                (password.match(/[A-Z]/) && password.match(/\d+/)) ||
                (password.match(/[a-z]/) && password.match(/[A-Z]/)))
        ) {
            complexity = 6;
        }
        if (
            password.length > 6 &&
            ((password.match(/[a-z]/) &&
                password.match(/[A-Z]/) &&
                password.match(/\d+/)) ||
                (password.match(/[a-z]/) &&
                    password.match(/[A-Z]/) &&
                    password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) ||
                (password.match(/[a-z]/) &&
                    password.match(/\d+/) &&
                    password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) ||
                (password.match(/[A-Z]/) &&
                    password.match(/\d+/) &&
                    password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)))
        ) {
            complexity = 8;
        }
        if (
            password.length > 9 &&
            ((password.match(/[a-z]/) &&
                password.match(/[A-Z]/) &&
                password.match(/\d+/)) ||
                (password.match(/[a-z]/) &&
                    password.match(/[A-Z]/) &&
                    password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) ||
                (password.match(/[a-z]/) &&
                    password.match(/\d+/) &&
                    password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) ||
                (password.match(/[A-Z]/) &&
                    password.match(/\d+/) &&
                    password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)))
        ) {
            complexity = 9;
        }

        if (
            password.length > 6 &&
            password.match(/[a-z]/) &&
            password.match(/[A-Z]/) &&
            password.match(/\d+/) &&
            password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)
        ) {
            complexity = 7;
        }
        if (
            password.length > 9 &&
            password.match(/[a-z]/) &&
            password.match(/[A-Z]/) &&
            password.match(/\d+/) &&
            password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)
        ) {
            complexity = 10;
        }
        return complexity;
    }
    return complexity;
}

/**
 * Return an image URL from an authority object
 * @param {object} authority
 */
export function getAvatarFromAuthority(authority: Object) {
    const roleAvatar = '/css/img/icons/group-icon.svg';
    const userAvatar = '/css/img/icons/user-icon.svg';

    // Default to role
    let avatar = roleAvatar;

    // Set user images
    if (authority.authorityType === 'USER') {
        avatar =
            authority.metadata &&
            authority.metadata.avatar &&
            authority.metadata.avatar !== ''
                ? authority.metadata.avatar
                : userAvatar;
    }

    return avatar;
}
