const router = require('express').Router();
const axios = require('axios');
const logger = require('log4js').getLogger();

const { validator } = require('./../utils');
const config = require('./../config');

router.get('/perks', async (req, res, next) => {
  try {
    const { data: { member } } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.loyaltyId}/profile`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    if (!member) {
      let error = new Error('Invalid loyaltyId');
      error.status = 400;
      throw error;
    }

    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/members/${member._id}/offers?filter=offers${req.query.query ? `&stores=${req.query.query}` : ''}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/aggregate', async (req, res, next) => {
  try {
    const { data: { member } } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.loyaltyId}/profile`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    if (!member) {
      let error = new Error('Invalid loyaltyId');
      error.status = 400;
      throw error;
    }
    const { week, year, metricName } = req.query;
    const url = `${config.REST_URL}/api/v1/members/${member._id}/aggregates?type=Weekly&week=${week}&year=${year}&metricName=${metricName}`;
    const { data } = await axios({
      url,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/promo', async (req, res, next) => {
  try {
    const { data: { member } } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.loyaltyId}/profile`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    if (!member) {
      let error = new Error('Invalid loyaltyId');
      error.status = 400;
      throw error;
    }

    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/members/${member._id}/rules?filter=promo${req.query.query ? `&stores=${req.query.query}` : ''}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});





router.get('/offers', async (req, res, next) => {
  try {
    const { data: { member } } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.loyaltyId}/profile`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    if (!member) {
      let error = new Error('Invalid loyaltyId');
      error.status = 400;
      throw error;
    }

    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/members/${member._id}/offers?filter=offers,global${req.query.query ? `&stores=${req.query.query}` : ''}` ,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});


router.get('/member-rewardpolicies', async (req, res, next) => {
  try {
    const { data: { member } } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.loyaltyId}/profile`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    if (!member) {
      let error = new Error('Invalid loyaltyId');
      error.status = 400;
      throw error;
    }

    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/members/${member._id}/offers?filter=rewards`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});


router.get('/all-rewardpolicies', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/rewardpolicies?query=${JSON.stringify({ "intendedUse": "Reward" })}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/available', async (req, res, next) => {
  try {
    const { data: { member } } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.loyaltyId}/profile`,
      method: 'get'
    });

    if (!member) {
      let error = new Error('Invalid loyaltyId');
      error.status = 400;
      throw error;
    }

    const currentTier = member.tiers.find(tier => tier.primary)

    const query = {
      intendedUse: "Reward",
      $or: [{
        tierPolicyLevels: { $exists: false }
      },
      { tierPolicyLevels: { $size: 0 } },
      {
        tierPolicyLevels: {
          $elemMatch: {
            policyId: currentTier.policyId,
            level: currentTier.level.name
          }
        }
      }]
    };

    const url = `${config.REST_URL}/api/v1/rewardpolicies?query=${JSON.stringify(query)}`
    console.log(`Getting ${url}`);
    const { data } = await axios({
      url,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/buy', validator.buyReward, async (req, res, next) => {
  try {
    const { date, location, rewardName, currencyCode } = req.body;
    const payload = {
      type: "Redemption",
      date: date,
      srcChannelType: "Mobile",
      loyaltyID: req.loyaltyId,
      couponCode: rewardName,
      srcChannelID: location,
      currencyCode: currencyCode
    };

    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/activity`,
      method: 'post',
      data: payload
    }).catch(err => {
      throw err.response.data;
    });

    return res.json(data);
  } catch (err) {
    logger.error(err);
    let error = err.errors ? err.errors[0] : err;
    return res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;