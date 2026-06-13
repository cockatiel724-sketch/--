const TrailSystem = {

  create({
    dx,
    dy,
    startX,
    startY,
    endX,
    endY
  }) {

    const trail = document.createElement("div");

    trail.className = "trail";

    // スワイプ距離
    const length = Math.sqrt(
      dx * dx +
      dy * dy
    );

    // 中間地点
    const centerX =
      (startX + endX) / 2;

    const centerY =
      (startY + endY) / 2;

    trail.style.width =
      `${length}px`;

    trail.style.left =
      `${centerX - length / 2}px`;

    trail.style.top =
      `${centerY - 6}px`;

    const angle =
      Math.atan2(dy, dx) *
      180 /
      Math.PI;

    trail.style.transform =
      `rotate(${angle}deg)`;

    document.body.appendChild(trail);

    setTimeout(() => {
      trail.remove();
    }, 350);
  },

  update() {}
};
