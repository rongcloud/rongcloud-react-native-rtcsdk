
export const isEmpty = (str) => {
  if (typeof str == "undefined" || str == null || str.length == 0 || str == '') {
    return true;
  } else {
    return false;
  }
}

export const post = (url, params, success, error) => {
  let json = JSON.stringify(params);
  let init = {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: json
  };
  fetch(url, init)
    .then((response) => response.json())
    .then((json) => {
      success(json);
    })
    .catch((exception) => {
      error(exception);
    });
}

