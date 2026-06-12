/========================
 * v5 Core Engine
========================/

const GameState = {
  score: 0,
  combo: 0,
  energy: 30,
  fever: false,
  running: true,
  currentArrow: null,
  spawnTime: performance.now(),
  lastInputTime: performance.now()
};

/------------------------
 * Events
------------------------/
const Events = {
  map: {},

  on(event, fn) {
    (this.map[event] ||= []).push(fn);
  },

  emit(event, data) {
    (this.map[event] || []).forEach(fn => fn(data));
  }
};

/------------------------
 * Systems
------------------------/
const Systems = {
  list: [],

  register(sys) {
    this.list.push(sys);
  },

  update(dt) {
    this.list.forEach(s => s.update?.(dt));
  }
};

/------------------------
 * GameLoop
------------------------/
const GameLoop = {
  last: performance.now(),

  run() {
    const now = performance.now();
    const dt = now - this.last;
    this.last = now;

    Systems.update(dt);

    requestAnimationFrame(GameLoop.run);
  }
};

/------------------------
 * INPUT SYSTEM
 * スワイプを検知する場所
------------------------/
const InputSystem = {
  startX: 0,
  startY: 0,
  isDown: false,

  init() {
    // 指を置いた瞬間
    window.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      this.startX = t.clientX;
      this.startY = t.clientY;
      this.isDown = true;
    });

    // 指を離した瞬間
    window.addEventListener("touchend", (e) => {
      if (!this.isDown) return;

      const t = e.changedTouches[0];

      const dx = t.clientX - this.startX;
      const dy = t.clientY - this.startY;

      this.isDown = false;

      ArrowSystem.checkSwipe({ dx, dy });
    });

    // PCテスト用（マウス）
    window.addEventListener("mousedown", (e) => {
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.isDown = true;
    });

    window.addEventListener("mouseup", (e) => {
      if (!this.isDown) return;

      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;

      this.isDown = false;

      ArrowSystem.checkSwipe({ dx, dy });
    });
  },

  update() {}
};

/------------------------
 * ARROW SYSTEM
 * ゲームの“正解方向”を管理
------------------------/
const ArrowSystem = {
  current: null,

  directions: ["up", "down", "left", "right"],

  spawn() {
    const dir =
      this.directions[Math.floor(Math.random() * this.directions.length)];

    this.current = {
      direction: dir,
      createdAt: performance.now()
    };

    GameState.currentArrow = this.current;

    console.log("SPAWN:", dir);
  },

  checkSwipe({ dx, dy }) {
    if (!this.current) {
      this.spawn();
      return;
    }

    const dir = this.getDirection(dx, dy);

    if (dir === this.current.direction) {
      GameState.score += 10;
      GameState.combo++;

      console.log("SUCCESS:", dir);
    } else {
      GameState.combo = 0;
      GameState.energy -= 5;

      console.log("FAIL:", dir);
    }

    this.spawn();
    syncUI();
  },

  getDirection(dx, dy) {
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY) {
      return dx > 0 ? "right" : "left";
    } else {
      return dy > 0 ? "down" : "up";
    }
  },

  update() {}
};

/------------------------
 * ENERGY SYSTEM
------------------------/
const EnergySystem = {
  timer: 0,

  update(dt) {
    this.timer += dt;

    if (this.timer > 1000) {
      this.timer = 0;

      GameState.energy--;

      syncUI();

      if (GameState.energy <= 0) {
        Events.emit("energyEmpty");
      }
    }
  }
};

Systems.register(EnergySystem);

/------------------------
 * SYSTEM REGISTER
------------------------/
Systems.register(InputSystem);
Systems.register(ArrowSystem);

/------------------------
 * EVENT
------------------------/
Events.on("energyEmpty", () => {
  GameState.running = false;
  console.log("GAME OVER");
});

/------------------------
 * UI UPDATE
------------------------/
function syncUI() {
  document.getElementById("score").textContent = GameState.score;
  document.getElementById("combo").textContent = GameState.combo;
  document.getElementById("energy").textContent = GameState.energy;
}

/------------------------
 * START
------------------------/
InputSystem.init();
ArrowSystem.spawn();
requestAnimationFrame(GameLoop.run);
