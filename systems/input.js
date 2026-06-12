const InputSystem = {
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  isDown: false,

  threshold: 30, // スワイプ判定距離

  init() {
    window.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      this.startX = t.clientX;
      this.startY = t.clientY;
      this.isDown = true;
    });

    window.addEventListener("touchend", (e) => {
      if (!this.isDown) return;

      const t = e.changedTouches[0];
      this.endX = t.clientX;
      this.endY = t.clientY;
      this.isDown = false;

      this.handleSwipe();
    });

    // PCテスト用（マウス）
    window.addEventListener("mousedown", (e) => {
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.isDown = true;
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
      return; // タップ扱い（無視）
    }

    let direction = null;

    if (absX > absY) {
      direction = dx > 0 ? "right" : "left";
    } else {
      direction = dy > 0 ? "down" : "up";
    }

    // v5イベント発火
    Events.emit("swipe", {
      direction,
      dx,
      dy
    });

    console.log("SWIPE:", direction);
  },

  update() {
    // 今は空（v5ルール：副作用なし）
  }
};
