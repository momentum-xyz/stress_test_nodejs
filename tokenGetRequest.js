const token = '';

const config = {
    Authorization: 'Bearer ' + token
  }


axios
    .get(URL_BASE)
    .then((resp) => {
      console.log('Axios resp 1', resp.status, resp.statusText, resp.data);
      const token = resp.data.token;