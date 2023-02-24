const axios = require('axios');
const { Shaper } = require('loadtest_tools');

const argv = process.argv.slice(2);

const URL_BASE = argv[0] || 'http://localhost:3000';
const active_dialogs = parseInt(argv[1], 10) || 2;

const shaper = Shaper.create({
  active_dialogs,
  callback_new: newDialog,
});

let countThisSecond = 0;
setInterval(function () {
  console.log(countThisSecond + ' dialogs started this second');
  countThisSecond = 0;
}, 1000);

function newDialog(cbDone, cbResp, cbReq) {
  // console.log('Create new dialog');
  ++countThisSecond;

  axios
    .get(URL_BASE)
    .then(() => {
      cbResp();

      cbReq();
      return axios.get(URL_BASE + '/version');
    })
    .then(() => {
      cbResp();
      cbDone();
    })
    .catch((err) => {
      console.log(err);
      cbDone();
    });
}

shaper.start();
