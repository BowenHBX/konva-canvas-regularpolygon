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

function getTopics(init, ctx, canvas) {
  const topics = init.scores;

  const angle = Math.floor(360 / topics.length);
  const offsetAngle = -angle / 4;
  const startX = canvas.width / 2;
  const startY = canvas.height / 2;
  for (let i = 0; i < topics.length; i++) {
    const angleCur = angle * (i + 1) + offsetAngle;
    // 获取角坐标
    const pointCoordinate = getValuePoint(startX, startY, 115, angleCur);
    const topic = topics[i];
    // 文本
    const text1 = titleCase(`${topic.type}`);
    ctx.font = `bold ${ratio(0.04)}px Arial`;
    ctx.fillStyle = '#671fc5';
    ctx.textAlign = 'center';
    ctx.fillText(text1, pointCoordinate.x, pointCoordinate.y);

    const text2 = titleCase(`${topic.score}`);
    ctx.font = `bold ${ratio(0.04)}px Arial`;
    ctx.fillStyle = '#671fc5';
    ctx.textAlign = 'center';
    ctx.fillText(text2, pointCoordinate.x, pointCoordinate.y + ratio(0.04));
  }
}

/**
 * 绘制雷达地图
 * @param ctx
 * @param canvas
 * @param length
 */
function getPentagon(ctx, canvas, length) {
  // 按照实际数组大小进行360的n等分
  const angle = Math.floor(360 / length);
  // 便宜角度，用于和雷达底图角度对齐
  const offsetAngle = -angle / 4;
  const startX = canvas.width / 2;
  const startY = canvas.width / 2;

  for (let i = 0; i < 5; i++) {
    let radius = 100; // 这个为外圈的半径
    radius = radius / 5 * (i + 1); // 5等分半径
    ctx.beginPath();
    for (let i = 0; i < length; i++) {
      const value = getValuePoint(startX, startY, radius, angle * (i + 1) + offsetAngle);
      if (i === 0) {
        ctx.moveTo(value.x, value.y);
      } else {
        ctx.lineTo(value.x, value.y);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = "#b04119";
    ctx.strokeWidth = ratio(1 / 640 * 3);
    ctx.stroke();
  }
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
 * @param ctx
 * @param canvas
 */
function getValues(init, ctx, canvas) {
  const topics = init.scores;
  // 按照实际数组大小进行360的n等分
  const angle = Math.floor(360 / topics.length);
  // 便宜角度，用于和雷达底图角度对齐
  const offsetAngle = -angle / 4;
  // 绘制不规则图形
  ctx.beginPath();
  const startX = canvas.width / 2;
  const startY = canvas.height / 2;
  for (let i = 0; i < topics.length; i++) {
    const value = getValuePoint(startX, startY, topics[i].score, angle * (i + 1) + offsetAngle);
    if (i === 0) {
      ctx.moveTo(value.x, value.y);
    } else {
      ctx.lineTo(value.x, value.y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = "#2c00b0";
  ctx.stroke = '#ffc71d';
  ctx.strokeWidth = ratio(1 / 640 * 3);
  ctx.globalAlpha = 0.6;
  ctx.fill();
  ctx.globalAlpha = 1;
}

/**
 * 绘制canvas
 * @param init 雷达图数据结构
 * @param offsetWidth canvas画布宽度
 * @param offsetHeight canvas画布高度
 * @returns {Konva.Stage}
 */
function initScene(canvasContainer, init, offsetWidth, offsetHeight) {
  canvasHeight = offsetHeight;
  canvasWidth = offsetWidth;
  const container = document.getElementById(canvasContainer);
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  // console.log('canvas', canvas.width);
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    console.log('ctx', ctx);
    console.log('drawing code here');
    // 绘制雷达底图
    getPentagon(ctx, canvas, init.scores.length);

    // 绘制雷达数值图
    getValues(init, ctx, canvas);

    // 绘制文字
    ctx.font = `italic bold ${ratio(1 / 640 * 28)}px Arial`;
    ctx.fillStyle = '#b04119';
    ctx.textAlign = 'center';
    ctx.fillText(init.label, canvasHeight / 2, canvasWidth / 2 - ratio(0.1));

    ctx.font = `italic bold ${ratio(1 / 640 * 160)}px Arial`;
    ctx.fillStyle = '#ffda1d';
    ctx.textAlign = 'center';
    ctx.fillText(init.score, canvasHeight / 2, canvasWidth / 2 + ratio(0.1));

    // 绘制各角文字
    getTopics(init, ctx, canvas);
  } else {
    console.log('canvas-unsupported code here');
  }
}

export { initScene };
