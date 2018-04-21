class MetaObject {
  checkArgs(sender,signalName,receiver,slotName) {
    if(!sender || !sender['constructor']) throw new Error(`No Sender: (${sender},${signalName},${receiver},${slotName})`);
    if(typeof sender[signalName] != 'function') throw new Error(`No Signal: (${sender},${signalName},${receiver},${slotName})`);
    if(!receiver || !receiver['constructor']) throw new Error(`No Receiver: (${sender},${signalName},${receiver},${slotName})`);
    if(typeof receiver[slotName] != 'function') throw new Error(`No Signal: (${sender},${signalName},${receiver},${slotName})`);
  }

  init(sender,signalName,receiver,slotName) {
    let senderName = sender.constructor.name;
    let receiverName = receiver.constructor.name;

    let metaSignals = sender['metaSignals'] = sender['metaSignals'] || {};
    metaSignals[senderName] = metaSignals[senderName] || {};
    metaSignals[senderName][signalName] = metaSignals[senderName][signalName] || [];

    metaSignals[senderName][signalName].push({
      receiver: receiver,
      receiverName: receiverName,
      slotName: slotName,
      method: function (...args) { return receiver[slotName].call(receiver,...args); }
    });
  }

  deinit(sender,signalName,receiver,slotName) {
    let senderName = sender.constructor.name;
    let receiverName = receiver.constructor.name;

    let metaSignals = sender['metaSignals'];
    metaSignals[senderName] = metaSignals[senderName] || {};
    metaSignals[senderName][signalName] = metaSignals[senderName][signalName] || [];

    let removed = metaSignals[senderName][signalName].filter(c=>{
      if(c.receiver===receiver&&c.receiverName==receiverName&&c.slotName==slotName) {
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
    if(!removed.length) {
      delete metaSignals[senderName][signalName];
      if(!Object.keys(metaSignals[senderName]).length) delete metaSignals[senderName];
    }
    else {
      if(!Object.keys(metaSignals[senderName]).length) delete metaSignals[senderName];
    }
  }

  replaceMethod(sender,signalName,receiver,slotName) {
    let senderName = sender.constructor.name;
    let receiverName = receiver.constructor.name;
    let metaSignals = sender['metaSignals'];
    let method = sender[signalName]['signal'] || sender[signalName];

    if(metaSignals[senderName]&&metaSignals[senderName][signalName]&&metaSignals[senderName][signalName].length) {
      sender[signalName] = function (...args) {
        let ret = method.call(sender,...args)
        metaSignals[senderName][signalName].forEach(function(r) {
          try {
            if(r&&r.method) r.method.call(receiver,...args);
            else {
              console.log('Error connect(',sender,signalName,receiver,slotName,')');
            }
          } catch(e) {
            console.log('Exception',e.message,e.stack);
          }
        });
        return ret;
      };
      sender[signalName]['signal'] = method;
    } else {
      sender[signalName] = sender[signalName]['signal'] || sender[signalName];
    }
  }

  connect(sender,signalName,receiver,slotName) {
    this.checkArgs(sender,signalName,receiver,slotName);
    this.init(sender,signalName,receiver,slotName);
    this.replaceMethod(sender,signalName,receiver,slotName);
  }

  disconnect(sender,signalName,receiver,slotName) {
    this.checkArgs(sender,signalName,receiver,slotName);
    this.deinit(sender,signalName,receiver,slotName);
    this.replaceMethod(sender,signalName,receiver,slotName);
  }
}

const metaObject = new MetaObject();

export default metaObject;
