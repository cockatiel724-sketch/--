console.log("MAIN LOADED");

/* ========================
 * v5 Core Engine
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

/* ------------------------
 * Events
------------------------ */

const Events = {
  map: {},

  on(event, fn) {
    (this.map[event] ||= []).push(fn);
  },

  emit(event, data) {
    (this.map[event] || []).forEach(fn => fn(data));
  }
};

Events.on("swipe", ({ dx, dy }) => {

  const x =
    InputSystem.endX;

  const y =
    InputSystem.endY;

  TrailSystem.add(x, y);

});

/* ------------------------
 * Systems
------------------------ */

const Systems = {
  list: [],

  register(sys) {
    this.list.push(sys);
  },

  update(dt) {
    this.list.forEach(s => s.update?.(dt));
  }
};

/* ------------------------
 * GameLoop
------------------------ */

const GameLoop = {

  last: performance.now(),

  run() {

    const now =
      performance.now();

    const dt =
      now - this.last;

    this.last = now;


    // ゲーム中だけ更新
    if (GameState.running) {

      Systems.update(dt);

    }


    // ループは常に回す
    requestAnimationFrame(
      GameLoop.run.bind(GameLoop)
    );

  }

};

/* ------------------------
 * ENERGY SYSTEM
------------------------ */

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

/* ------------------------
 * SYSTEM REGISTER
------------------------ */

Systems.register(InputSystem);
Systems.register(ArrowSystem);
Systems.register(TrailSystem);

/* ------------------------
 * EVENTS
------------------------ */

Events.on("energyEmpty", () => {
  gameOver();
});

// スワイプ → ArrowSystem
Events.on("swipe", (swipe) => {
  ArrowSystem.checkSwipe(swipe);
});

/* Events.on("swipe", (swipe) => {
  TrailSystem.create(swipe);
}); */

Events.on("trail", ({ x, y }) => {
  TrailSystem.add(x, y);
});

// 成功
Events.on("success", () => {
  GameState.score += 10;
  GameState.combo += 1;

  syncUI();
});

// 失敗
Events.on("fail", (data) => {
  console.log(data);
  gameOver();

});

/* ------------------------
 * ゲームオーバー
------------------------ */
function gameOver() {

  GameState.running = false;

  document.getElementById(
    "finalScore"
  ).textContent =
    GameState.score;

  document.getElementById(
    "gameOver"
  ).style.display =
    "flex";

}

/* ------------------------
 * UI UPDATE
------------------------ */

function syncUI() {
  document.getElementById("score").textContent = GameState.score;
  document.getElementById("combo").textContent = GameState.combo;
  document.getElementById("energy").textContent = GameState.energy;
}

/* ------------------------
 * START
------------------------ */

syncUI();

InputSystem.init();
ArrowSystem.spawn();

requestAnimationFrame(GameLoop.run.bind(GameLoop));

document
.getElementById("startBtn")
.addEventListener(
"click",
() => {
  document
  .getElementById("startScreen")
  .style.display = "none";
}
);


document
.getElementById("retryBtn")

.addEventListener(

"click",

() => {

  GameState.score = 0;

  GameState.combo = 0;

  GameState.energy = 30;

  GameState.running = true;

  syncUI();

  document.getElementById(
    "gameOver"
  ).style.display =
    "none";

  ArrowSystem.spawn();

}

);

