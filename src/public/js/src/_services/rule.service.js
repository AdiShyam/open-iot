import { jsonHeader } from '../_helpers'
import { Request } from '../_helpers'

export const ruleService = {
    getAll,
    create,
    delete: _delete,
    copyRules,
}

/**
 * Get all rules associated witn an application
 * @return {Promise} response promise
 */
function getAll(id) {
    const requestOptions = {
        method: 'GET',
    }
    return new Request().send('/api/apps/' + id + '/rules', requestOptions)
}

/**
 * Create a new rule request
 * @param {Object} rule new rule definition
 * @return {Promise} response promise
 */
function create(rule) {
    const requestOptions = {
        method: 'POST',
        headers: jsonHeader(),
        body: JSON.stringify(rule),
    }
    return new Request().send('/api/rules', requestOptions)
}

/**
 * Delete rule
 * @param  {String} id rule id
 * @return {Promise} response promise
 */
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
    }
    return new Request().send('/api/rules/' + id, requestOptions)
}

/**
 * Copy rules from one application to another.
 * @param {String} source source application id
 * @param {String} destination destination application id
 * @return {Promise} response promise
 */
function copyRules(source, destination) {
    const requestOptions = {
        method: 'POST',
        headers: jsonHeader(),
    }
    return new Request().send(`/api/rules/copy/${source}/${destination}`, requestOptions)
}
