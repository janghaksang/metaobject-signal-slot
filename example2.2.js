import { MetaObject } from './MetaObject2'

class A {
  signal(any) {
    console.log("A.signal("+any+")");
  }

  slot(...any) {
    console.log("A.slot("+any+")");
  }
};

class B {
  signal(any,bny) {
    console.log("B.signal("+any+","+bny+")");
  }

  slot(...any) {
    console.log("B.slot("+any+")");
    this.signal(any,any);
  }
};

class C {
  signal(any,bny) {
    console.log("C.signal("+any+","+bny+")");
  }

  slot(...any) {
    console.log("C.slot("+any+")");
    this.signal(any,any)
  }

  test() {
    throw new Error('test');
  }
};

let a1 = new A();
let a2 = new A();
let b11 = new B();
let b12 = new B();
let c = new C();

MetaObject.connectParam(a1,'signal',b11,'slot');
MetaObject.connectParam(a1,'signal',b12,'slot');
MetaObject.connectParam(b11,'signal',c,'slot');
MetaObject.connectParam(a2,'signal',c,'slot');
MetaObject.connectParam(c,'signal',a1,'slot');
MetaObject.connectParam(c,'signal',c,'test');

MetaObject.before(a1,'signal',c,(p)=>console.log(p));
MetaObject.afterReturn(b11,'slot',c,(p)=>console.log(p));
MetaObject.afterThrow(c,'test',c,(p)=>console.log(p));
MetaObject.around(a1,'slot',c,(p,m)=>{
  console.log('---start');
  let ret = m();
  console.log(ret);
  console.log('---end');
});

MetaObject.disconnect(a2,'signal',c,'slot');

a1.signal('hello');
a2.signal('world');
