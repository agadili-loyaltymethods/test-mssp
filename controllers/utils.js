const router = require('express').Router();
const axios = require('axios');
const logger = require('log4js').getLogger();
const { validationResult } = require('express-validator');

const config = require('./../config');
const Cognito = require('../modules/cognito');

router.get('/loyaltyid', (req, res, next) => {
    try {
        const { idtoken } = req.headers;
        let idTokenDetails = Cognito.getIdTokenDetails(idtoken);
        if (!idTokenDetails) {
            return next(new Error('Invalid id token'));
        }
        return res.send({ loyaltyId: idTokenDetails.payload['custom:loyaltyId'] });
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.get('/partners', async (req, res, next) => {
    try {
        const { data } = await axios({
            url: `${config.REST_URL}/api/v1/partners?query=${req.query.query}`,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/enums', async (req, res, next) => {
    try {
        let url = `${config.REST_URL}/api/v1/enums?query=${req.query.query}`;
        if (req.query.skip || req.query.skip === 0) {
            url += '&skip=' + req.query.skip;
        }
        url += '&sort=label';
        const { data } = await axios({
            url,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/enums/count', async (req, res, next) => {
    try {
        const { data } = await axios({
            url: `${config.REST_URL}/api/v1/enums/count?query=${req.query.query}`,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/rewardpolicies', async (req, res, next) => {
    try {
        const { data } = await axios({
            url: `${config.REST_URL}/api/v1/rewardpolicies?query=${JSON.stringify({ "intendedUse": "Offer", "ext.isPerk": true })}&select=name,desc,ext.perkValue`,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/streakPolicy', async (req, res, next) => {
    try {
        const { data } = await axios({
            url: `${config.REST_URL}/api/v1/streakPolicies?select=name,description,goalPolicies,timeLimit,ext`,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/rewards', async (req, res, next) => {
    try {
        const { data } = await axios({
            url: `${config.REST_URL}/api/v1/rewards?query=${req.query.query}`,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});


router.get('/locations', async (req, res, next) => {
    try {
        let url = `${config.REST_URL}/api/v1/locations?query={}`;
        if (req.query.sort || req.query.sort === 0) {
            url += '&sort=' + req.query.sort;
        }
        console.log(`Getting ${url}`);
        const { data } = await axios({
            url,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/products', async (req, res, next) => {
    try {
        const query = {
            $or: [
                {
                    "ext.hideInMSSP": {
                        "$exists": false
                    }
                },
                {
                    "ext.hideInMSSP":
                        false
                }
            ]
        };
        let url = `${config.REST_URL}/api/v1/products?query=${JSON.stringify(query)}`;
        console.log(`Getting ${url}`);
        const { data } = await axios({
            url,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/other-products', async (req, res, next) => {
    try {
        const query = {
            category: req.query.category || "Hemming", // Default to "Hemming" if not provided
            subcategory: req.query.subcategory
                ? { '$nin': req.query.subcategory }
                : { '$nin': "Discount" }, // Default to excluding "Discount"
            "ext.hideInMSSP": true,
        };

        let url = `${config.REST_URL}/api/v1/products?query=${JSON.stringify(query)}`;

        if (req.query.sort || req.query.sort === 0) {
            url += '&sort=' + req.query.sort;
        }
        console.log(`Getting ${url}`);
        const { data } = await axios({
            url,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/products-shipping', async (req, res, next) => {
    try {
        const query = {
            category: "Shipping",
            subcategory: {
                '$nin': "Discount"
            },
            "ext.hideInMSSP": true,
        };
        let url = `${config.REST_URL}/api/v1/products?query=${JSON.stringify(query)}`;
        if (req.query.sort || req.query.sort === 0) {
            url += '&sort=' + req.query.sort;
        }
        console.log(`Getting ${url}`);
        const { data } = await axios({
            url,
            method: 'get'
        }).catch(err => {
            throw err.response.data;
        });
        return res.json(data);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
});

router.post('/activity', async (req, res, next) => {
    try {
        const defaultValues = {
            srcChannelType: 'Web',
            loyaltyID: req.loyaltyId
        }
        let url = `${config.REST_URL}/api/v1${req.url}`;
        if (req.body.length) {
            console.log(`Getting Multiple Activities ${url}`);
            const data = await Promise.all(req.body.map(payload => axios.post(`${url}`, {
                ...payload,
                ...defaultValues
            }).then(response => response.data)))
            return res.json(data);
        } else {
            console.log(`Getting ${url}`);
            const { data } = await axios({
                url,
                method: 'post',
                data: {
                    ...req.body,
                    ...defaultValues
                }
            });
            return res.json(data);
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;