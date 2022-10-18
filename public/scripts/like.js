/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function likeFreet(fields) {
  fetch(`/api/likes/like/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unlikeFreet(fields) {
  fetch(`/api/likes/like/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function getLikes(fields) {
  fetch(`/api/likes/likecount/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function getLikers(fields) {
  fetch(`/api/likes/likeusers/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function hideLikes(fields) {
  fetch(`/api/likes/hide/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unhideLikes(fields) {
  fetch(`/api/likes/unhide/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
