'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaObject = function () {
  function MetaObject() {
    _classCallCheck(this, MetaObject);
  }

  _createClass(MetaObject, [{
    key: 'checkArgs',
    value: function checkArgs(sender, signalName, receiver, slotName) {
      if (!sender || !sender['constructor']) throw new Error('No Sender: (' + sender + ',' + signalName + ',' + receiver + ',' + slotName + ')');
      if (typeof sender[signalName] != 'function') throw new Error('No Signal: (' + sender + ',' + signalName + ',' + receiver + ',' + slotName + ')');
      if (!receiver || !receiver['constructor']) throw new Error('No Receiver: (' + sender + ',' + signalName + ',' + receiver + ',' + slotName + ')');
      if (typeof receiver[slotName] != 'function') throw new Error('No Signal: (' + sender + ',' + signalName + ',' + receiver + ',' + slotName + ')');
    }
  }, {
    key: 'init',
    value: function init(sender, signalName, receiver, slotName) {
      var senderName = sender.constructor.name;
      var receiverName = receiver.constructor.name;

      var metaSignals = sender['metaSignals'] = sender['metaSignals'] || {};
      metaSignals[senderName] = metaSignals[senderName] || {};
      metaSignals[senderName][signalName] = metaSignals[senderName][signalName] || [];

      metaSignals[senderName][signalName].push({
        receiver: receiver,
        receiverName: receiverName,
        slotName: slotName,
        method: function method() {
          var _receiver$slotName;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return (_receiver$slotName = receiver[slotName]).call.apply(_receiver$slotName, [receiver].concat(args));
        }
      });
    }
  }, {
    key: 'deinit',
    value: function deinit(sender, signalName, receiver, slotName) {
      var senderName = sender.constructor.name;
      var receiverName = receiver.constructor.name;

      var metaSignals = sender['metaSignals'];
      metaSignals[senderName] = metaSignals[senderName] || {};
      metaSignals[senderName][signalName] = metaSignals[senderName][signalName] || [];

      var removed = metaSignals[senderName][signalName].filter(function (c) {
        if (c.receiver === receiver && c.receiverName == receiverName && c.slotName == slotName) {
          delete c.method;
          delete c.slotName;
          delete c.receiverName;
          delete c.receiver;
          return false;
        } else {
          return true;
        }
      });
      metaSignals[senderName][signalName] = removed;
      if (!removed.length) {
        delete metaSignals[senderName][signalName];
        if (!Object.keys(metaSignals[senderName]).length) delete metaSignals[senderName];
      } else {
        if (!Object.keys(metaSignals[senderName]).length) delete metaSignals[senderName];
      }
    }
  }, {
    key: 'replaceMethod',
    value: function replaceMethod(sender, signalName, receiver, slotName) {
      var senderName = sender.constructor.name;
      var receiverName = receiver.constructor.name;
      var metaSignals = sender['metaSignals'];
      var method = sender[signalName]['signal'] || sender[signalName];

      if (metaSignals[senderName] && metaSignals[senderName][signalName] && metaSignals[senderName][signalName].length) {
        sender[signalName] = function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var ret = method.call.apply(method, [sender].concat(args));
          metaSignals[senderName][signalName].forEach(function (r) {
            try {
              var _r$method;

              if (r && r.method) (_r$method = r.method).call.apply(_r$method, [receiver].concat(args));else {
                console.log('Error connect(', sender, signalName, receiver, slotName, ')');
              }
            } catch (e) {
              console.log('Exception', e.message, e.stack);
            }
          });
          return ret;
        };
        sender[signalName]['signal'] = method;
      } else {
        sender[signalName] = sender[signalName]['signal'] || sender[signalName];
      }
    }
  }, {
    key: 'connect',
    value: function connect(sender, signalName, receiver, slotName) {
      this.checkArgs(sender, signalName, receiver, slotName);
      this.init(sender, signalName, receiver, slotName);
      this.replaceMethod(sender, signalName, receiver, slotName);
    }
  }, {
    key: 'disconnect',
    value: function disconnect(sender, signalName, receiver, slotName) {
      this.checkArgs(sender, signalName, receiver, slotName);
      this.deinit(sender, signalName, receiver, slotName);
      this.replaceMethod(sender, signalName, receiver, slotName);
    }
  }]);

  return MetaObject;
}();

var metaObject = new MetaObject();

exports.default = metaObject;
