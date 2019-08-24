import * as Handler from './handler.js'

let imageLoader
let canvas
let ctx

function initialize () {
  imageLoader = document.getElementById('imageLoader');
  imageLoader.addEventListener('change', Handler.handleImage, false);
  canvas = document.getElementById('imageCanvas');
  ctx = canvas.getContext('2d');
  Handler.initDraw(document.getElementById('canvasWrapper'));
  $('#colorConfirm').click(m => {
    console.log('并集坐标为：', Handler.zoneSelection)
    Handler.zoneSelection.clear()
  })
}


initialize()
