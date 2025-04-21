const router = require('express').Router();
const axios = require('axios');
const { getUser: cognitoGetUser, updateAttributes: cognitoUpdateAttributes } = require('../modules/cognito');
const logger = require('log4js').getLogger();
const { validationResult } = require('express-validator');

const config = require('./../config');
const { validator } = require('./../utils');

router.get('/info', async (req, res, next) => {
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

    member.loyaltyId = req.loyaltyId;

    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.loyaltyId}/profile?linked=true&divide=true&group=${req.query.query}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    const totalAvailablePoints = data.reduce((total, member) => {
      const pointsPurseBalance = member.member.purses.find(purse => purse.name === 'Points').availBalance;
      return total + pointsPurseBalance;
    }, 0);

    member.purses.find(purse => purse.name === 'Points')['linkedBalance'] = totalAvailablePoints;
    member['isLinked'] = data.length > 1;

    return res.json(member);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/policyinfo', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/pursepolicies${req.query.query ? `?query=${req.query.query}` : ''}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/tierinfo', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/tierpolicies${req.query.query ? `?query=${req.query.query}` : ''}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/preferences', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/memberpreferences${req.query.query ? `?query=${req.query.query}` : ''}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/setPreferences', async (req, res, next) => {
  try {
    const payload = {
      memberId: req.body.id,
      category: "Preference",
      optedInDate: new Date().toISOString(),
      inferred: false,
      loyaltyID: req.loyaltyId,
      name: req.body.name,
      value: "Yes",
      ext: {}
    };
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/memberpreferences`,
      method: 'post',
      data: payload
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/deletePreferences', async (req, res, next) => {
  try {
    const { data: { member } } = await axios({
      url: `${config.REST_URL}/api/v1/memberpreferences/${req.query.query}`,
      method: 'delete'
    }).catch(err => {
      throw err.response.data;
    });

    return res.json(member);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/activityhistories', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.RC_REST_URL}/api/v1/activityhistories?query=${JSON.stringify({ memberID: req.query.query })}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/tiermsg', async (req, res, next) => {
  try {
    const { date } = req.body;
    const payload = {
      type: "Personalize Message",
      date: date,
      srcChannelType: "Mobile",
      loyaltyID: req.loyaltyId
    };
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/activity?persist=false`,
      method: 'post',
      data: payload
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/lifetimestats', async (req, res, next) => {
  try {
    const { date } = req.body;
    const payload = {
      type: "PR Lifetime Status",
      date: date,
      srcChannelType: "Mobile",
      loyaltyID: req.loyaltyId
    };
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/activity?persist=false`,
      method: 'post',
      data: payload
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});



router.post('/streaksinfo', async (req, res, next) => {
  try {
    const { date } = req.body;
    const payload = {
      type: "PR Streaks",
      date: date,
      srcChannelType: "Mobile",
      loyaltyID: req.loyaltyId
    };
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/activity?persist=false`,
      method: 'post',
      data: payload
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/streaks', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.query.query}?select=streaks`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/setpreferences', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.body.memberId}/setpreferences`,
      method: 'post',
      data: req.body.payload
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});


router.put('/', validator.updateMember, async (req, res, next) => {
  const payload = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { data: { member } } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.loyaltyId}/profile`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    let updateObject = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      cellPhone: payload.cellPhone,
      dob: payload.dob,
      address: payload.address,
      city: payload.city,
      state: payload.state,
      zipCode: payload.zipCode,
      country: payload.country
    };

    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/crmprofiles/${member._id}`,
      method: 'put',
      data: updateObject
    }).catch(err => {
      throw err.response.data;
    });

    const { cognitoUser } = await cognitoGetUser(req, { isReq: true });
    await cognitoUpdateAttributes(
      cognitoUser, {
      firstname: payload.firstName,
      lastname: payload.lastName,
      dob: payload.dob
    }
    );

    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/referral', validator.addReferral, async (req, res, next) => {
  const payload = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { data: { member } } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.loyaltyId}/profile`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });

    let newReferral = {
      referredMemberContact: payload.email,
      referredMemberHandle: '',
      referredMemberName: payload.name,
      referrer: member._id,
      ext: ''
    };

    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/referrals`,
      method: 'post',
      data: newReferral
    }).catch(err => {
      throw err.response.data;
    });

    return res.json(data);
  } catch (err) {
    logger.error(err);
    return res.status(err.status || 500).json({ error: err.message });
  }

});

router.get('/segments', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/segments?limit=${req.query.limit}&query=${req.query.query}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/membersegments', async (req, res, next) => {
  try {
    const query = { member: req.query.memberId };
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/membersegments?limit=${req.query.limit}&query=${JSON.stringify(query)}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/members', async (req, res, next) => {
  try {

    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/members/${req.query.id}/profile?linked=true&divide=true&group=true&txnDate=${req.query.date}`,
      method: 'get'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/membersegments/:id', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/membersegments/${req.params.id}`,
      method: 'delete'
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/membersegments', async (req, res, next) => {
  try {
    const { data } = await axios({
      url: `${config.REST_URL}/api/v1/membersegments`,
      method: 'post',
      data: req.body
    }).catch(err => {
      throw err.response.data;
    });
    return res.json(data);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;