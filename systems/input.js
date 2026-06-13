console.log("INPUT LOADED");
const InputSystem = {
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  isDown: false,

  threshold: 30, /* スワイプ判定距離 */

  init() {
    window.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      this.startX = t.clientX;
      this.startY = t.clientY;
      this.isDown = true;
    });

window.addEventListener("touchmove", (e) => {

  if (!this.isDown) return;

  const t = e.touches[0];

  Events.emit("trail", {
    x: t.clientX,
    y: t.clientY
  });

});

    window.addEventListener("touchend", (e) => {
      if (!this.isDown) return;

      const t = e.changedTouches[0];
      this.endX = t.clientX;
      this.endY = t.clientY;
      this.isDown = false;

      this.handleSwipe();
    });

    /* PCテスト用（マウス）*/
    window.addEventListener("mousedown", (e) => {
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.isDown = true;
    });

    window.addEventListener("mousemove", (e) => {

  if (!this.isDown) return;

  Events.emit("trail", {
    x: e.clientX,
    y: e.clientY
  });

});

    window.addEventListener("mouseup", (e) => {
      if (!this.isDown) return;

      this.endX = e.clientX;
      this.endY = e.clientY;
      this.isDown = false;

      this.handleSwipe();
    });
  },


  handleSwipe() {
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX < this.threshold && absY < this.threshold) {
      return; /* タップ扱い（無視） */
    }

    let direction = null;

    if (absX > absY) {
      direction = dx > 0 ? "right" : "left";
    } else {
      direction = dy > 0 ? "down" : "up";
    }

    /* v5イベント発火 */
    Events.emit("swipe", {
  direction,
  dx,
  dy,

  startX: this.startX,
  startY: this.startY,

  endX: this.endX,
  endY: this.endY
});

    console.log("SWIPE:", direction);
  },

  update() {
    /* 今は空（v5ルール：副作用なし）*/
  }
};
