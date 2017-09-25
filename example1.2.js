import MetaObject from './MetaObject2';

function* num() {
  let index = 0;
  while(true) {
    yield index++;
  }
}

let n = num();

function rand(min, max) {
    let r = n.next();
    return r.value%(max-min)+min;
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
