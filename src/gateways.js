const express = require('express')
const validator = require('validator')
const { logger, responses, auth } = require('./lib')
const { ACCESS_LEVEL, Gateway, Application } = require('./models')
const { SuccessResponse, ErrorResponse, HTTPError } = responses

module.exports = function(app) {

    const router = express.Router()
    app.use('/api/gateways', router)

    // fetch all registered gateways
    router.get('/', auth.protect(ACCESS_LEVEL.USER), async (req, res, next) => {

        try {
            const gateways = await Gateway.find()
            .where('user').eq(req.user._id)
            .populate('application')

            const data = gateways.map(g => ({
                id: g.id,
                name: g.name,
                alias: g.alias,
                description: g.description,
                created: g.created,
                updated: g.updated,
                application: {
                    id: g.application.id,
                    name: g.application.name,
                    alias: g.application.alias,
                },
            }))
            res.json(new SuccessResponse(data))

        } catch (err) {
            res.status(err.status || 500).json(new ErrorResponse(err.message))
        }
    })

    // fetch gateway by id that belongs to a particular user
    router.get('/:id', auth.protect(ACCESS_LEVEL.USER), async (req, res, next) => {

        try {

            const g = await Gateway.findById(req.params.id)
            .where('user').eq(req.user._id)
            if (!g) {
                throw new HTTPError('Gateway not found', 400)
            }

            const data = {
                id: g.id,
                name: g.name,
                alias: g.alias,
                description: g.description,
                created: g.created,
                updated: g.updated,
            }
            res.json(new SuccessResponse(data))

        } catch (err) {
            res.status(err.status || 500).json(new ErrorResponse(err.message))
        }
    })

    // create new gateway
    router.post('/', auth.protect(ACCESS_LEVEL.USER), async (req, res, next) => {

        try {

            const { application, name, description } = req.body

            if (!application || validator.isEmpty(application)) {
                throw new HTTPError('You need to specify a parent application', 400)
            }

            if (!name || validator.isEmpty(name)) {
                throw new HTTPError('Please, enter gateway name', 400)
            }

            if (!description || validator.isEmpty(description)) {
                throw new HTTPError('Please, enter gateway description', 400)
            }

            // check the owner of the application
            const app = await Application.findById(application)
            .where('user').eq(req.user._id)

            if (!app) {
                throw new HTTPError('This application belongs to somebody else', 400)
            }

            // create gateway
            const gateway = new Gateway({
                user: req.user._id,
                application,
                name,
                alias: name.toLowerCase().replace(/\s/g, ''),
                description,
            })
            await gateway.save()

            const data = {
                id: gateway.id,
                name: gateway.name,
                alias: gateway.alias,
                description: gateway.description,
                created: gateway.created,
                updated: gateway.updated,
            }
            res.json(new SuccessResponse(data))

        } catch (err) {
            res.status(err.status || 500).json(new ErrorResponse(err.message))
        }
    })

    // update gateway
    router.put('/:id', auth.protect(ACCESS_LEVEL.USER), async (req, res, next) => {

        try {

            const { name, description, alias } = req.body

            const updateDefintion = {}

            if (name && !validator.isEmpty(name)) {
                updateDefintion.name = name
            }

            if (alias && !validator.isEmpty(alias)) {
                updateDefintion.alias = alias.toLowerCase().replace(/\s/g, '')
            }

            if (description && !validator.isEmpty(description)) {
                updateDefintion.description = description
            }

            await Gateway.findByIdAndUpdate(req.params.id, updateDefintion)
            .where('user').eq(req.user._id)

            res.json(new SuccessResponse())

        } catch (err) {
            res.status(err.status || 500).json(new ErrorResponse(err.message))
        }
    })

    // delete gateway
    router.delete('/:id', auth.protect(ACCESS_LEVEL.USER), async (req, res, next) => {

        try {

            const gateway = await Gateway.findById(req.params.id)
            .where('user').eq(req.user._id)

            if (!gateway) {
                throw new HTTPError('This gateway belongs to somebody else', 400)
            }

            await gateway.remove()

            res.json(new SuccessResponse())

        } catch (err) {
            res.status(err.status || 500).json(new ErrorResponse(err.message))
        }
    })

}
