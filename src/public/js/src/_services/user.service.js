import { authHeader, jsonHeader } from '../_helpers'
import { Request } from '../_helpers'

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: jsonHeader(),
        body: JSON.stringify(user)
    }
    return new Request().send('/api/passport/register', requestOptions)
}

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: jsonHeader(),
        body: JSON.stringify({ email, password }),
    }

    return new Request().send('/api/passport/auth', requestOptions)
    .then(user => {
        if (user && user.accessToken && user.refreshToken) {
            localStorage.setItem('user', JSON.stringify(user))
        }
        return user
    })
}

function logout() {
    localStorage.removeItem('user')
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    return new Request().send('/api/users', requestOptions)
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    return new Request().send('/api/users/' + id, requestOptions)
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), ...jsonHeader() },
        body: JSON.stringify(user)
    }
    return new Request().send('/api/users/' + user.id, requestOptions)
}

function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    }
    return new Request().send('/api/users/' + id, requestOptions)
}
