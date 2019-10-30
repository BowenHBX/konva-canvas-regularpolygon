const Konva = window.Konva;

let canvasHeight = 540;
let canvasWidth = 540;
const offsetAngle = -18;

function ratio(num) {
  return canvasWidth * num;
}

function titleCase(str) {
  const arr = str.split(' ');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1).toLowerCase();
  }
  return arr.join(' ');
}

function getTopics(init, layer, stage) {
  const topics = init.scores;
  stage.add(layer);

  const angle = Math.floor(360 / topics.length);
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    // 文本
    const value = titleCase(`${topic.type}:\r\n${topic.score}`);
    const text = new Konva.Text({
      text: value,
      fill: '#671fc5',
      fontSize: ratio(0.04),
      fontStyle: 'bold',
      fontFamily: 'Arial',
      x: stage.width() / 2,
      y: stage.height() / 2,
      align: 'center',
      offsetX: 0,
      offsetY: 0,
    });
    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2);

    const angleCur = angle * (i + 1) + offsetAngle;
    const startX = stage.width() / 2;
    const startY = stage.height() / 2;
    // 获取角坐标
    const pointCoordinate = getValuePoint(startX, startY, 115, angleCur);
    // const textWidth
    // 设置角大小，角位置
    const container = new Konva.Group({
      x: pointCoordinate.x,
      y: pointCoordinate.y,
      width: stage.width(),
      height: stage.height(),
      offsetX: stage.width() / 2,
      offsetY: stage.height() / 2,
    });
    container.add(text);
    // container.add(icon);
    layer.add(container);
    layer.batchDraw();
  }
  return layer;
}

/**
 * 绘制雷达地图
 * @param stage
 * @returns {Konva.Group}
 */
function getPentagon(stage) {
  const group = new Konva.Group({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    offsetX: 0,
    offsetY: 0,
  });
  for (let i = 0; i < 5; i++) {
    let radius = stage.width() * 0.3; // 这个为外圈的半径
    radius = radius / 5 * (i + 1); // 5等分半径
    const pentagon = new Konva.RegularPolygon({
      x: stage.width() / 2,
      y: stage.height() / 2,
      sides: 5,
      radius,
      fill: 'transparent',
      stroke: '#b04119',
      strokeWidth: ratio(1 / 640 * 3),
      opacity: 0.8,
    });
    group.add(pentagon);
  }

  return group;
}

/**
 * 根据分数获取需要移动的坐标
 * @param xDef
 * @param yDef
 * @param value
 * @param angle
 * @returns {{x: *, y: *}}
 */
function getValuePoint(xDef, yDef, value, angle) {
  const rat = ratio(0.3) / 100 * value;
  const x = xDef + rat * Math.cos(angle * Math.PI / 180);
  const y = yDef + rat * Math.sin(angle * Math.PI / 180);
  return {
    x,
    y,
  };
}

/**
 * 绘制数值图
 * @param init
 * @param stage
 * @returns {Konva.Shape}
 */
function getValues(init, stage) {
  const topics = init.scores;
  const angle = Math.floor(360 / topics.length);
  const triangle = new Konva.Shape({
    sceneFunc(context, shape) {
      context.beginPath();
      const startX = stage.width() / 2;
      const startY = stage.height() / 2;
      const value1 = getValuePoint(startX, startY, topics[0].score, angle + offsetAngle);
      context.moveTo(value1.x, value1.y);
      const value2 = getValuePoint(startX, startY, topics[1].score, angle * 2 + offsetAngle);
      context.lineTo(value2.x, value2.y);
      const value3 = getValuePoint(startX, startY, topics[2].score, angle * 3 + offsetAngle);
      context.lineTo(value3.x, value3.y);
      const value4 = getValuePoint(startX, startY, topics[3].score, angle * 4 + offsetAngle);
      context.lineTo(value4.x, value4.y);
      const value5 = getValuePoint(startX, startY, topics[4].score, angle * 5 + offsetAngle);
      context.lineTo(value5.x, value5.y);
      context.closePath();
      context.fillStrokeShape(shape);
    },
    fill: '#2c00b0',
    stroke: '#ffc71d',
    strokeWidth: ratio(1 / 640 * 3),
    opacity: 0.6,
  });
  return triangle;
}

function initScene(init, offsetWidth, offsetHeight) {
  canvasHeight = offsetHeight;
  canvasWidth = offsetWidth;
  const stage = new Konva.Stage({
    container: 'radar-canvas',
    width: canvasWidth,
    height: canvasHeight,
  });

  const layer = new Konva.Layer();

  // 绘制雷达底图
  const pentagonGroup = getPentagon(stage);
  layer.add(pentagonGroup);

  // 绘制雷达数值图
  const values = getValues(init, stage);
  layer.add(values);

  // 绘制文字
  const text = new Konva.Text({
    text: init.label,
    fill: '#b04119',
    fontSize: ratio(1 / 640 * 28),
    fontStyle: 'bold italic',
    fontFamily: 'Arial',
    x: stage.width() / 2,
    y: stage.height() / 2,
    align: 'center',
    offsetY: ratio(1 / 640 * 90),
    opacity: 1,
  });
  text.offsetX(text.width() / 2);
  layer.add(text);
  const textScore = new Konva.Text({
    text: init.score,
    fill: '#ffda1d',
    fontSize: ratio(1 / 640 * 160),
    fontStyle: 'bold italic',
    fontFamily: 'Arial',
    x: stage.width() / 2,
    align: 'center',
    y: stage.height() / 2,
    offsetY: ratio(1 / 640 * 60),
    opacity: 1,
  });
  textScore.offsetX(textScore.width() / 2);
  layer.add(textScore);

  stage.add(layer);

  // 绘制各角文字
  getTopics(init, layer, stage);

  layer.draw();
  return stage;
}

export { initScene };
