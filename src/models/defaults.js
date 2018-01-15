const Promise = require('bluebird')
const logger = require('../lib/logger')
const utils = require('../lib/utils')
const { ACCESS_LEVEL } = require('./constants')

const defaultSettings = [
    {
        key: 'global.deploymentTime',
        value: Date.now(),
        description: 'Time of deployment',
        readOnly: true,
    },
    {
        key: 'bridge.aws.enabled',
        value: false,
        description: 'Enable AWS IoT bridge',
    },
    {
        key: 'bridge.aws.endpoint',
        value: '',
        description: 'AWS IoT Thing endpoint',
    },
    {
        key: 'bridge.aws.certificate',
        value: '',
        description: 'AWS IoT Thing certificate',
    },
    {
        key: 'bridge.aws.publickey',
        value: '',
        description: 'AWS IoT Thing public key',
    },
    {
        key: 'bridge.aws.privatekey',
        value: '',
        description: 'AWS IoT Thing private key',
    },
    {
        key: 'bridge.aws.ca',
        value: '',
        description: 'AWS IoT CA certificate',
    },
]

function settings(Model) {

    return new Promise((fulfill, reject) => {

        let requiredSettings = defaultSettings.map(s => s.key)

        Model.find({ key: { $in: requiredSettings } })
        .then(res => {

            // walk through all default settings to check if there's entry in the DB
            defaultSettings.forEach(s => {

                let shouldAdd = true
                for (let i=0; i < res.length; i++) {
                    if (s.key === res[i].key) {
                        logger.debug(`Setting ${s.key} already present`)
                        shouldAdd = false
                        break
                    }
                }

                if (shouldAdd) {
                    logger.info(`Creating default setting ${s.key} -> ${s.value}...`)
                    let setting = new Model(s)
                    setting.save()
                }

            })
        })
        .then(() => {
            fulfill()
        })
        .catch(err => {
            logger.error(err.message)
            reject()
        })

    })
}

function user(Model) {

    return new Promise((fulfill, reject) => {

        Model.findOne({ isDefault: true })
        .then((res) => {
            if (!res) {
                // create new user
                let defaultUser = new Model({
                    firstName: 'Default',
                    lastName: 'User',
                    email: 'admin',                            // default email
                    password: utils.generatePassword('admin'), // default password
                    isDefault: true,
                    accessLevel: ACCESS_LEVEL.ADMIN,
                })
                defaultUser.save()
                .then((u) => {
                    logger.info(`Created default user ${u.firstName} ${u.lastName}`)
                    fulfill()
                })
            } else {
                logger.debug(`Default user present`)
                fulfill()
            }
        })
        .catch((err) => {
            logger.error(err.message)
            reject()
        })

    })
}

module.exports = {
    settings,
    user,
}
