let FLAG = false
let zones = []   // 给定或用户定义的矩形框
let image
export let zoneSelection = new Set()  // 点击后搜索得到的区域

export let handleImage = function (e) {
   var canvas = document.getElementById('imageCanvas');
   var ctx = canvas.getContext('2d');
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    console.log(`传入URL参数 ${e.target.files[0]}`)
    reader.readAsDataURL(e.target.files[0]);
}

export let initDraw = function (canvas) {
    image = document.getElementById('imageCanvas')
    $('#boxSwitch').change(function () {
      FLAG = $(this).prop('checked')
    })
    function setMousePosition(e) {
        var ev = e || window.event; //Moz || IE
        if (ev.pageX) { //Moz
            mouse.x = ev.pageX + window.pageXOffset;
            mouse.y = ev.pageY + window.pageYOffset;
        } else if (ev.clientX) { //IE
            mouse.x = ev.clientX + document.body.scrollLeft;
            mouse.y = ev.clientY + document.body.scrollTop;
        }
    };

    var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    var element = null;
    canvas.onmousemove = function (e) {
        if(!FLAG) return
        setMousePosition(e);
        if (element !== null) {
            element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
            element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
            element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
            element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
        }
    }

    image.onclick = function (e) {
      if(FLAG) return
      var pos = findPos(this);
      var x = e.pageX - pos.x;
      var y = e.pageY - pos.y;
      var coord = "x=" + x + ", y=" + y;
      var c = image.getContext('2d');
      var color = c.getImageData(x, y, 1, 1).data;
      console.log(`点击坐标：(${x}, ${y})， RGB为${color}`)
      // 此处效率低下，建议在后端运算
      zones.forEach(rect => {
        for (let xi = rect.x; xi <= rect.x + rect.width; xi ++) {
          for (let yi = rect.y; yi <= rect.y + rect.height; yi ++ ) {
            let ci = c.getImageData(xi, yi, 1, 1).data
            if (ci[0]==color[0] && ci[1] == color[1]&& ci[2] == color[2]) {
              zoneSelection.add({x: xi, y: yi})
            }
          }
        }
      })
      console.log(zones, zoneSelection)
    }

    canvas.onclick = function (e) {
        if(!FLAG) return
        if (element !== null) {
          zones.push({
            'x': parseInt(element.style.left),
            'y': parseInt(element.style.top),
            'width': parseInt(element.style.width),
            'height': parseInt(element.style.height)
          })
            element = null;
            canvas.style.cursor = "default";
        } else {
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
            element = document.createElement('div');
            element.className = 'rectangle'
            element.style.left = mouse.x + 'px';
            element.style.top = mouse.y + 'px';
            element.style['pointer-events'] = 'none';
            canvas.appendChild(element)
            canvas.style.cursor = "crosshair";
        }
    }
}

export let getZones = function () {
  return zones
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
