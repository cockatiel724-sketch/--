console.log("MAIN LOADED");
/* ========================
  v5 Core Engine
======================== */

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
// スワイプ → ArrowSystemへ
Events.on("swipe", (swipe) => {
  ArrowSystem.checkSwipe(swipe);
});

// 成功
Events.on("success", () => {
  GameState.score += 10;
  GameState.combo += 1;

  syncUI();
});

// 失敗
Events.on("fail", () => {
  GameState.combo = 0;

  syncUI();
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
