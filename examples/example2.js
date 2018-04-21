import MetaObject from 'metaobject-signal-slot';

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
};

let a1 = new A();
let a2 = new A();
let b11 = new B();
let b12 = new B();
let c = new C();

MetaObject.connect(a1,'signal',b11,'slot');
MetaObject.connect(a1,'signal',b12,'slot');
MetaObject.connect(b11,'signal',c,'slot');
MetaObject.connect(a2,'signal',c,'slot');
MetaObject.connect(c,'signal',a1,'slot');

a1.signal('hello');
a2.signal('world');
