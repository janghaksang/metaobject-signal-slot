# Introduction

metaobject-signal-slot are used for communication between objects like Qt.


# Usage

MetaObject.connect(*sender*,*signal*,*receiver*,*slot*);

MetaObject.disconnect(*sender*,*signal*,*receiver*,*slot*);


# Example1

## Code

```js
import MetaObject from './MetaObject';

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class NavigationBar {
  onLeftButtonPressed() {
    console.log("onLeftButtonPressed");
  }

  onRightButtonPressed() {
    console.log("onRightButtonPressed");
  }
};

class ScrollView {
  constructor() {
    this.state = {
      currentPage: 0,
      pages: 0
    }
  }

  update() {
    console.log("ScrollView updated: "+(this.currentPage()+1)+"/"+this.pages())
  }

  scrollToPrevPage() {
    this.state.currentPage = Math.max(0, Math.min(this.pages()-1, this.currentPage() - 1));
    this.update();
  }

  scrollToNextPage() {
    this.state.currentPage = Math.max(0, Math.min(this.pages()-1, this.currentPage() + 1));
    this.update();
  }

  pushPage() {
    this.state.pages = this.state.pages + 1;
  }

  pages() {
    return this.state.pages;
  }

  currentPage() {
    return this.state.currentPage;
  }
};

class App {
  constructor() {
    this.navigationBar = new NavigationBar();
    this.scrollView = new ScrollView();
    this.scrollView.pushPage();
    this.scrollView.pushPage();
    this.scrollView.pushPage();
    this.scrollView.pushPage();
    this.scrollView.pushPage();

    this.didMounted();
  }

  didMounted() {
    MetaObject.connect(this.navigationBar,'onLeftButtonPressed',this.scrollView,'scrollToPrevPage');
    MetaObject.connect(this.navigationBar,'onRightButtonPressed',this.scrollView,'scrollToNextPage');
  }

  run() {
    setInterval(()=>{
      rand(0,2)?this.navigationBar.onLeftButtonPressed():this.navigationBar.onRightButtonPressed();
    }, 1000);

  }
};

let app = new App();

app.run();
```

## Result

```
onRightButtonPressed
ScrollView updated: 2/5
onRightButtonPressed
ScrollView updated: 3/5
onRightButtonPressed
ScrollView updated: 4/5
onRightButtonPressed
ScrollView updated: 5/5
onLeftButtonPressed
ScrollView updated: 4/5
onLeftButtonPressed
ScrollView updated: 3/5
```

# Example2

## Code

```js
import MetaObject from './MetaObject'

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
```

## Result

```
A.signal(hello)
B.slot(hello)
B.signal(hello,hello)
C.slot(hello,hello)
C.signal(hello,hello,hello,hello)
A.slot(hello,hello,hello,hello)
B.slot(hello)
B.signal(hello,hello)
A.signal(world)
C.slot(world)
C.signal(world,world)
A.slot(world,world)
```
