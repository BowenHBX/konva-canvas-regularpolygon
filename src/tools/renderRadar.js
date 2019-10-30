const Konva = window.Konva;

let canvasHeight = 540;
let canvasWidth = 540;

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

  const angle = Math.floor(360 / topics.length);
  const offsetAngle = -angle / 4;
  const startX = stage.width() / 2;
  const startY = stage.height() / 2;
  for (let i = 0; i < topics.length; i++) {
    const angleCur = angle * (i + 1) + offsetAngle;
    // 获取角坐标
    const pointCoordinate = getValuePoint(startX, startY, 115, angleCur);
    // 设置container, 每个container都以离五边形的定点15%的距离为中心点
    // 宽度为画布宽度，高度为画布高度
    const container = new Konva.Group({
      x: pointCoordinate.x,
      y: pointCoordinate.y,
      width: stage.width(),
      height: stage.height(),
      offsetX: stage.width() / 2,
      offsetY: stage.height() / 2,
    });

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
    // 文本向左，向上分别偏移50%，达到在container居中的效果
    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2);
    // 添加文字到container
    container.add(text);
    // 添加container到layer
    layer.add(container);
  }
}

/**
 * 绘制雷达地图
 * @param stage
 * @returns {Konva.Group}
 */
function getPentagon(stage) {
  // 创建一个组，用于容纳5个大小递减的多边形，
  // group的大小正好是整个canvas画布的大小
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
    // 创建一个等边多边形
    const pentagon = new Konva.RegularPolygon({
      x: stage.width() / 2,
      y: stage.height() / 2,
      sides: 5, // 边数
      radius, // 半径
      fill: 'transparent', // 填充颜色
      stroke: '#b04119', // 边框颜色
      strokeWidth: ratio(1 / 640 * 3), // 边框宽度
      opacity: 0.8,
    });
    group.add(pentagon);
  }

  return group;
}

/**
 * 根据分数获取需要移动的坐标
 * @param xDef 中心点x
 * @param yDef 中心点y
 * @param value 数值
 * @param angle 偏移角度
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
  // 按照实际数组大小进行360的n等分
  const angle = Math.floor(360 / topics.length);
  // 便宜角度，用于和雷达底图角度对齐
  const offsetAngle = -angle / 4;
  // 绘制不规则图形
  const triangle = new Konva.Shape({
    sceneFunc(context, shape) {
      context.beginPath();
      const startX = stage.width() / 2;
      const startY = stage.height() / 2;
      for (let i = 0; i < topics.length; i++) {
        const value = getValuePoint(startX, startY, topics[i].score, angle * (i + 1) + offsetAngle);
        if (i === 0) {
          context.moveTo(value.x, value.y);
        } else {
          context.lineTo(value.x, value.y);
        }
      }
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

/**
 * 绘制canvas
 * @param init 雷达图数据结构
 * @param offsetWidth canvas画布宽度
 * @param offsetHeight canvas画布高度
 * @returns {Konva.Stage}
 */
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

  // 绘制各角文字
  getTopics(init, layer, stage);

  stage.add(layer);
  layer.draw();
  return stage;
}

export { initScene };
