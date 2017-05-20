var MetaObject = (function() {
  var insertIndex = (sender,signalName,receiver,slotName) => {
    if(!sender || !sender['constructor']) throw 'No sender';
    if(!receiver || !receiver['constructor']) throw 'No receiver';
    let senderName = sender.constructor.name;
    let receiverName = receiver.constructor.name;
    let metaObject = sender['metaObject'] = sender['metaObject'] || {};
    metaObject[senderName] = metaObject[senderName] || [];
    let signalIndex = metaObject[senderName].length;
    let slotIndex = 0;
    for(let i = metaObject[senderName].length-1; i >= 0; --i) {
      if(!metaObject[senderName][i]['sender']) continue;
      if(metaObject[senderName][i]['sender'] != senderName) continue;
      if(!metaObject[senderName][i][signalName]) continue;
      signalIndex = i;
      slotIndex = metaObject[senderName][i][signalName].length;
      for(let j = metaObject[senderName][i][signalName].length-1; j >= 0; --j) {
        if(!metaObject[senderName][i][signalName][j]['receiver']) continue;
        if(metaObject[senderName][i][signalName][j]['receiver'] != receiverName) continue;
        slotIndex = j;
        return [signalIndex,slotIndex];
      }
      return [signalIndex,slotIndex];
    }
    return [signalIndex,slotIndex];
  }

  var disconnectInner = (sender,signalName,receiver,slotName) => {
    if(!sender || !sender['constructor']) throw 'No sender';
    if(!receiver || !receiver['constructor']) throw 'No receiver';
    let senderName = sender.constructor.name;
    let receiverName = receiver.constructor.name;
    if(typeof sender[signalName] != 'function') throw 'No signal';
    let metaObject = sender['metaObject'] = sender['metaObject'] || {};
    metaObject[senderName] = metaObject[senderName] || [];
    for(let i = metaObject[senderName].length-1; i >= 0; --i) {
      if(!metaObject[senderName][i]['sender']) continue;
      if(metaObject[senderName][i]['sender'] != senderName) continue;
      if(!metaObject[senderName][i][signalName]) continue;
      for(let j = metaObject[senderName][i][signalName].length-1; j >= 0; --j) {
        if(!metaObject[senderName][i][signalName][j]['receiver']) continue;
        if(metaObject[senderName][i][signalName][j]['receiver'] != receiverName) continue;
        delete metaObject[senderName][i][signalName][j];
        metaObject[senderName][i][signalName] = metaObject[senderName][i][signalName].filter(function(n){ return n != undefined });
        if(metaObject[senderName][i][signalName] && metaObject[senderName][i][signalName].length) {
          let method = sender[signalName]['signal'] || sender[signalName];
          sender[signalName] = (...args) => {
            method.call(receiver,...args);
            metaObject[senderName][i][signalName].map((m)=>m.call(receiver,...args));
          };
          sender[signalName]['signal'] = method;
        }
        return;
      }
    }
  }

  var connectInner = (sender,signalName,receiver,slotName) => {
    if(!sender || !sender['constructor']) throw 'No sender';
    if(!receiver || !receiver['constructor']) throw 'No receiver';
    let senderName = sender.constructor.name;
    let receiverName = receiver.constructor.name;
    if(typeof sender[signalName] != 'function') throw 'No signal';
    if(typeof receiver[slotName] != 'function') throw 'No slot';

    let metaObject = sender['metaObject'] = sender['metaObject'] || {};
    metaObject[senderName] = metaObject[senderName] || [];
    let [i,j] = insertIndex(sender,signalName,receiver,slotName);
    console.log([i,j]);
    metaObject[senderName][i] = metaObject[senderName][i] || [];
    metaObject[senderName][i]['sender'] = senderName;

    metaObject[senderName][i][signalName] = metaObject[senderName][i][signalName] || [];
    metaObject[senderName][i][signalName].push((...args)=>receiver[slotName].call(receiver,...args));
    metaObject[senderName][i][signalName][j]['receiver'] = receiverName;

    let method = sender[signalName]['signal'] || sender[signalName];
    sender[signalName] = (...args) => {
      method.call(sender,...args);
      metaObject[senderName][i][signalName].map((m)=>m.call(receiver,...args));
    };
    sender[signalName]['signal'] = method;
  };

  var self = {
    connect(sender,signalName,receiver,slotName) {
      connectInner(sender,signalName,receiver,slotName);
    },

    disconnect(sender,signalName,receiver,slotName) {
      disconnectInner(sender,signalName,receiver,slotName);
    }
  };

  return self;
})();

module.exports = MetaObject;
