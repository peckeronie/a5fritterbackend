/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function getFollowers(fields) {
  fetch(`/api/follow/follows/${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function getFollowing(fields) {
  fetch(`/api/follow/following/${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function followUser(fields) {
  fetch(`/api/follow/followuser/${fields.username}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
  fetch(`/api/follow/followuser/${fields.username}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function hideFollowers(fields) {
  fetch(`/api/follow/hidefollow/${fields.username}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unhideFollowers(fields) {
  fetch(`/api/follow/unhidefollow/${fields.username}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function getFollowingFreets(fields) {
  fetch(`/api/follow/followfreets/${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}
