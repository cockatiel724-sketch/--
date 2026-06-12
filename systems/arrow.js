console.log("ARROW LOADED");
const ArrowSystem = {
  current: null,

  directions: ["up", "down", "left", "right"],

  spawn() {
    const dir = this.directions[
      Math.floor(Math.random() * this.directions.length)
    ];

    this.current = {
      direction: dir,
      createdAt: performance.now()
    };

    GameState.currentArrow = this.current;

    // 矢印表示
    this.render(dir);

    Events.emit("spawn", this.current);

    console.log("SPAWN:", dir);
  },

render(dir) {
  console.log("RENDER:", dir);

  const el = document.getElementById("arrow");

  if (!el) {
    console.log("ARROW ELEMENT NOT FOUND");
    return;
  }

  el.className = "";
  el.classList.add("arrow");
  el.classList.add(dir);
}

  checkSwipe(swipe) {
    if (!this.current) return;

    const dir = this.getDirectionFromSwipe(swipe);

    if (dir === this.current.direction) {
      Events.emit("success", {
        direction: dir
      });

      console.log("SUCCESS:", dir);

    } else {
      Events.emit("fail", {
        direction: dir
      });

      console.log("FAIL:", dir);
    }

    // 次の矢印生成
    this.spawn();
  },

  getDirectionFromSwipe({ dx, dy }) {
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY) {
      return dx > 0 ? "right" : "left";
    }

    return dy > 0 ? "down" : "up";
  },

  update() {
    // 2秒寿命チェック
    if (!this.current) return;

    const now = performance.now();

    if (now - this.current.createdAt > 2000) {
      Events.emit("fail", {
        reason: "timeout"
      });

      console.log("TIMEOUT");

      this.spawn();
    }
  }
};
