const axios = require('axios');
const { Shaper } = require('loadtest_tools');

const argv = process.argv.slice(2);

const URL_BASE = argv[0] || 'http://localhost:3000';
const active_dialogs = parseInt(argv[1], 10) || 2;

const shaper = Shaper.create({
  active_dialogs,
  callback_new: newDialog,
  // debug: true,
});

let countThisSecond = 0;
setInterval(function () {
  console.log(countThisSecond + ' dialogs started this second');
  countThisSecond = 0;
}, 1000);

function promiseDelay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const newsfeedDelayMsec = 15 * 1000;

function newDialog(cbDone, cbResp, cbReq) {
  console.log('Create new dialog');
  ++countThisSecond;

  axios
    .get(URL_BASE)
    .then((resp) => {
      cbResp();
      console.log('Get base page', resp.status, resp.statusText); //, resp.data);

      cbReq();
      return axios.get(URL_BASE + '/version');
    })
    .then((resp) => {
      cbResp();
      console.log('Version:', resp.data);

      cbReq();
      return axios.post(URL_BASE + '/api/v4/auth/guest-token', {});
    })
    .then((resp) => {
      cbResp();
      console.log('Guest-token data', resp.data);

      // Authorized requests
      const token = resp.data.token;
      const config = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };

      cbReq();
      return axios
        .get(URL_BASE + '/api/v4/users/me', config)
        .then((resp) => {
          cbResp();
          console.log('ME:', resp.data);

          cbReq();
          return axios.get(URL_BASE + '/api/v4/newsfeed', config);
        })
        .then((resp) => {
          cbResp();
          console.log('Newsfeed resp', resp.status, resp.statusText);
          // console.log('Newsfeed data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(URL_BASE + '/api/v4/newsfeed', config);
          });
        })
        .then((resp) => {
          cbResp();
          console.log('Newsfeed resp', resp.status, resp.statusText);
          // console.log('Newsfeed data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(URL_BASE + '/api/v4/newsfeed', config);
          });
        })
        .then((resp) => {
          cbResp();
          console.log('Newsfeed resp', resp.status, resp.statusText);
          // console.log('Newsfeed data', resp.data);

          console.log('Close dialog');
          cbDone();
        });
    })
    .catch((err) => {
      console.log(err);
      cbDone();
    });
}

shaper.start();
