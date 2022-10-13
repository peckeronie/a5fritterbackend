/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllFreets(fields) {
  fetch('/api/freets')
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByAuthor(fields) {
  fetch(`/api/freets?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createFreet(fields) {
  fetch('/api/freets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function likeFreet(fields) {
  fetch(`/api/freets/like/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unlikeFreet(fields) {
  fetch(`/api/freets/like/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function getLikes(fields) {
  fetch(`/api/freets/likecount/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function hideLikes(fields) {
  fetch(`/api/freets/hide/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unhideLikes(fields) {
  fetch(`/api/freets/unhide/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function addSource(fields) {
  fetch(`/api/freets/addsource/${fields.source}/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function removeSource(fields) {
  fetch(`/api/freets/delsource/${fields.source}/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function getSources(fields) {
  fetch(`/api/freets/sources/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}
