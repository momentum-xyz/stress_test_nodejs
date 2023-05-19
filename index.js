const axios = require('axios');
const { Shaper } = require('loadtest_tools');

const argv = process.argv.slice(2);

const URL_BASE = argv[0] || 'http://https://dev2.odyssey.ninja/';
const max_active_dialogs = parseInt(argv[1], 10) || 2;
const max_count = parseInt(argv[2], 10) || 0;
const debug = false;

const shaper = Shaper.create({
  active_dialogs: max_active_dialogs,
  callback_new: newDialog,
  // debug: true,
});

let newDialogsCreatedThisSecond = 0,
  dialogsEndedThisSecond = 0,
  totalCount = 0,
  currentActiveDialogs = 0,
  errors = 0;

setInterval(function () {
  console.log(
    new Date().toISOString(),
    'NEW:', // new dialogs created in this second
    newDialogsCreatedThisSecond,
    'ACTIVE:',
    currentActiveDialogs,
    'FINISHED:', // dialogs destroyed this second
    dialogsEndedThisSecond,
    'ERRORS:',
    errors,
    'TOTAL:',
    totalCount
  );
  newDialogsCreatedThisSecond = 0;
  dialogsEndedThisSecond = 0;
}, 1000);

function promiseDelay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const newsfeedDelayMsec = 1 * 1000;

function newDialog(cbDone, cbResp, cbReq) {
  console.log('Create new dialog');
  ++newDialogsCreatedThisSecond;
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
      debug && console.log('Guest-token data', resp.data);

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
          debug && console.log('ME:', resp.data);

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
            'final version falkor',
            resp.status,
            resp.statusText
          );
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE + '/static/media/FINALFalkor.0a79ac4bc68822f0c77c.jpg',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log(
            'final version circle',
            resp.status,
            resp.statusText
          );
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE + '/explore/circle',
              config
            );
          });
        })
        .then((resp) => {
          cbResp();
          //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log(
            'final version twirl',
            resp.status,
            resp.statusText
          );
          // console.log('UI client data', resp.data);

          // wait 15 sec
          return promiseDelay(newsfeedDelayMsec).then(() => {
            cbReq();
            return axios.get(
              URL_BASE + '/explore/twirl',
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
          console.log('new staking resp', resp.config.url, resp.status, resp.statusText);
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
              console.log('new merge', resp.config.url, resp.status, resp.statusText);
              // console.log('UI client data', resp.data);
    
              // wait 15 sec
              return promiseDelay(newsfeedDelayMsec).then(() => {
                cbReq();
                return axios.get(
                  'https://dev.odyssey.ninja/odyssey/merge07',
                  config
                );
              });
                  })
                  .then((resp) => {
                    cbResp();
                   //console.log('UI client resp', resp.status, resp.statusText, resp.data);
                    console.log('new dot texture', resp.config.url, resp.status, resp.statusText);
                    // console.log('UI client data', resp.data);
          
                    // wait 15 sec
                    return promiseDelay(newsfeedDelayMsec).then(() => {
                      cbReq();
                      return axios.get(
                        'https://dev.odyssey.ninja/odyssey/dotTexture',
                        config
                      );
                    });
                        })
                        .then((resp) => {
                          cbResp();
                         //console.log('UI client resp', resp.status, resp.statusText, resp.data);
                          console.log('new smoke', resp.config.url, resp.status, resp.statusText);
                          // console.log('UI client data', resp.data);
                
                          // wait 15 sec
                          return promiseDelay(newsfeedDelayMsec).then(() => {
                            cbReq();
                            return axios.get(
                              'https://dev.odyssey.ninja/odyssey/smoke',
                              config
                            );
                          });
                              })
        .then((resp) => {
          cbResp();
         //console.log('UI client resp', resp.status, resp.statusText, resp.data);
          console.log('new visit resp', resp.config.url, resp.status, resp.statusText);
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
            //https://dev.odyssey.ninja/odyssey/smoke
            //https://dev.odyssey.ninja/odyssey/merge07
            //https://dev2.odyssey.ninja/static/media/FINALFalkor.0a79ac4bc68822f0c77c.jpg
            //https://assets.babylonjs.com/environments/backgroundGround.png
            //https://assets.babylonjs.com/environments/environmentSpecular.env
            //https://dev2.odyssey.ninja/explore/circle
            //https://dev2.odyssey.ninja/explore/twirl
            //
            //https://dev2.odyssey.ninja/api/v4/auth/challenge?wallet=0x89cf1e911CefBace8b0AB3790B358DF7235F6BFf
            //https://dev2.odyssey.ninja/api/v3/render/asset/d906e0703d2eb1a53e3f703423225945
            //https://dev2.odyssey.ninja/static/media/test.615984c87fe7eee3672d.hdr
            //https://dev2.odyssey.ninja/api/v4/users?sort=DESC&limit=1000
            //https://dev2.odyssey.ninja/api/v4/worlds?sort=DESC&limit=1000
            //https://dev2.odyssey.ninja/api/v4/objects/7c106050-b727-42f5-957c-5d8fe8af0401/0187a2eb-be7b-73b4-aeb8-3d5332f54642/attributes
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

          ++dialogsEndedThisSecond;
          --currentActiveDialogs;
        });
    })
    .catch((err) => {
      console.log(err.config.url);
      console.log(err);
      cbDone();

      ++errors;
      ++dialogsEndedThisSecond;
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
