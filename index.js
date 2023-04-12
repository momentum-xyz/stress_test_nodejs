const axios = require('axios');
const { Shaper } = require('loadtest_tools');

const argv = process.argv.slice(2);

const URL_BASE = argv[0] || 'http://https://dev2.odyssey.ninja/';
const max_active_dialogs = parseInt(argv[1], 10) || 2;
const max_count = parseInt(argv[2], 10) || 0;

const shaper = Shaper.create({
  active_dialogs: max_active_dialogs,
  callback_new: newDialog,
  // debug: true,
});

let countThisSecond = 0,
  finishedThisSecond = 0,
  totalCount = 0,
  currentActiveDialogs = 0,
  errors = 0;

setInterval(function () {
  console.log(
    new Date().toISOString(),
    'NEW:',
    countThisSecond,
    'ACTIVE:',
    currentActiveDialogs,
    'FINISHED:',
    finishedThisSecond,
    'ERRORS:',
    errors,
    'TOTAL:',
    totalCount
  );
  countThisSecond = 0;
  finishedThisSecond = 0;
}, 1000);

function promiseDelay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const newsfeedDelayMsec = 1 * 1000;

function newDialog(cbDone, cbResp, cbReq) {
  console.log('Create new dialog');
  ++countThisSecond;
  ++totalCount;
  ++currentActiveDialogs;

  if (max_count && totalCount >= max_count) {
    console.log('Max count reached');
    shaper.stop();
  }

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

          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log('UI client resp', resp.status, resp.statusText);
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(URL_BASE + '/api/v4/config/ui-client', config);
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log('version resp', resp.status, resp.statusText);
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(URL_BASE + '/version', config);
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log('resolve node resp', resp.status, resp.statusText);
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE +
                '/api/v4/drive/resolve-node?object_id=c8986246-c468-4c38-b047-9203fdfe68bf',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log('streaming assets resp', resp.status, resp.statusText);
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE + '/odyssey/StreamingAssets/aa/settings.json',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log('online-users resp', resp.status, resp.statusText);
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE +
                '/api/v4/worlds/c8986246-c468-4c38-b047-9203fdfe68bf/online-users',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log(
            'catalog_3rdPersonAvatar resp',
            resp.status,
            resp.statusText
          );
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE +
                '/unity-assets/WebGL/catalog_3rdPersonAvatarController.hash',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log('catalog_WorldCenter resp', resp.status, resp.statusText);
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE + '/unity-assets/WebGL/catalog_WorldCenter.hash',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log(
            'catalog_DockingStation resp',
            resp.status,
            resp.statusText
          );
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE + '/unity-assets/WebGL/catalog_DockingStation.hash',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log('new staking resp', resp.status, resp.statusText);
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE +
                '/api/v4/objects/e7ccd418-1380-4766-8589-caf7ad45c32f/attributes/sub?plugin_id=f0f0f0f0-0f0f-4ff0-af0f-f0f0f0f0f0f0&attribute_name=name&sub_attribute_key=name',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log('new visit resp', resp.status, resp.statusText);
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE +
                '/api/v3/render/texture/s8/26485e74acb29223ba7a9fa600d36c7f',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('profile client resp', resp.status, resp.statusText, resp.data);
          console.log('profile client resp', resp.status, resp.statusText);
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.patch(
              URL_BASE + '/api/v4/profile',
              {
                name: 'AndreyDev16',
                profile: { avatarHash: '658b0d943cf63dba5e412bcfc746adfb' },
              },
              config
            );
            //https://v2.odyssey.ninja/version
            //https://v2.odyssey.ninja/unity/WebGL.data.gz
            //https://statscollector-1.agora.io/events/messages
            //https://v2.odyssey.ninja/api/v4/worlds/c8986246-c468-4c38-b047-9203fdfe68bf/online-users
            //https://v2.odyssey.ninja/odyssey/StreamingAssets/aa/settings.json
            //https://dev2.odyssey.ninja/unity-assets/WebGL/catalog_3rdPersonAvatarController.hash
            //https://dev2.odyssey.ninja/unity-assets/WebGL/catalog_WorldCenter.hash
            //https://dev2.odyssey.ninja/unity-assets/WebGL/catalog_DockingStation.hash
            //https://dev2.odyssey.ninja/unity-assets/WebGL/catalog_Skybox_QuantumFlux.hash
            //https://dev2.odyssey.ninja/unity-assets/WebGL/catalog_WorldEffects.hash
            //https://dev2.odyssey.ninja/api/v3/render/texture/s8/26485e74acb29223ba7a9fa600d36c7f
            //https://dev2.odyssey.ninja/api/v4/objects/e7ccd418-1380-4766-8589-caf7ad45c32f/attributes/sub?plugin_id=f0f0f0f0-0f0f-4ff0-af0f-f0f0f0f0f0f0&attribute_name=name&sub_attribute_key=name
          });
        })
        .then((resp) => {
          cbResp();

          console.log('Newsfeed resp', resp.status, resp.statusText);
          // console.log('Newsfeed data', resp.data);

          console.log('Close dialog');
          cbDone();

          ++finishedThisSecond;
          --currentActiveDialogs;
        });
    })
    .catch((err) => {
      console.log(err);
      cbDone();

      ++errors;
      ++finishedThisSecond;
      --currentActiveDialogs;
    });
}

const secondsToReachMax = 10;
const chunk = Math.ceil(max_active_dialogs / secondsToReachMax) || 1;

shaper.start(chunk);
const interval = setInterval(() => {
  if (currentActiveDialogs >= max_active_dialogs) {
    clearInterval(interval);
    return;
  }
  shaper.start(chunk);
}, 1000);
