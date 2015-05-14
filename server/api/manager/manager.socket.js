/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Manager = require('./manager.model');

exports.register = function(socket) {
  Manager.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Manager.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('manager:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('manager:remove', doc);
}