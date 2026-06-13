const TrailSystem = {

  create({ dx, dy }) {

    const trail = document.createElement("div");

    trail.className = "trail";

    trail.style.left =
      `${window.innerWidth / 2 - 60}px`;

    trail.style.top =
      `${window.innerHeight / 2 - 6}px`;

    const angle =
      Math.atan2(dy, dx) * 180 / Math.PI;

    trail.style.transform =
      `rotate(${angle}deg)`;

    document.body.appendChild(trail);

    setTimeout(() => {
      trail.remove();
    }, 350);
  },

  update() {}
};
