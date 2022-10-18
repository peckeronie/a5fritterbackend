/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function addSource(fields) {
  fetch(`/api/source/addsource/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function removeSource(fields) {
  fetch(`/api/source/delsource/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

// eslint-disable-next-line capitalized-comments
// function addSource(fields) {
//   fetch(`/api/freets/addsource/${fields.source}/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
//     .then(showResponse)
//     .catch(showResponse);
// }

// function removeSource(fields) {
//   fetch(`/api/freets/delsource/${fields.source}/${fields.id}`, {method: 'DELETE'})
//     .then(showResponse)
//     .catch(showResponse);
// }

function getSources(fields) {
  fetch(`/api/source/sources/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}
