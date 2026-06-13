console.log("TRAIL LOADED");

const TrailSystem = {

  add(x, y) {

    const dot =
      document.createElement("div");

    dot.className =
      "trail-dot";

    dot.style.left =
      `${x}px`;

    dot.style.top =
      `${y}px`;

    document.body.appendChild(dot);

    setTimeout(() => {
      dot.remove();
    }, 250);
  },

  update() {}

};
