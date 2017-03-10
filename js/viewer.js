var ipc = require('electron').ipcRenderer;
let oriWidth, oriHeight, imgWidth, imgHeight, svgWidth, svgHeight, x, y
let svg, svgj, img, svgimg, scale_btnj, src
let scale, zoomed

ipc.on('img-src', (event, imgSrc) => {
  if (imgSrc)
    init(imgSrc)
})

function init(imgSrc){
  src = imgSrc
  scale_btnj = $('#scale_btn');
  svgj = $('svg')
  svg = svgj[0]
  svgimg = document.createElementNS('http://www.w3.org/2000/svg','image')
  scale = 100
  zoomed = false
  img = new Image()
  img.src = src
  img.src = src
  img.onload = () => {
    zoomed = false
    setOriDim()
    setSvgDim()
    setDefaultScale()
    setImgDim()
    setImgPos()
    setImg()
    svgj.append(svgimg)
  }
  $(window).resize(_.throttle(resizeHandler, 100))
  $('#zoomin_btn').click(zoomin)
  $('#zoomout_btn').click(zoomout)
  $('#actual_btn').click(actual)
  $('#fit_btn').click(fit)
}

function setOriDim(){
  oriWidth = img.width
  oriHeight = img.height
}

function setImgDim(){
  imgWidth = oriWidth * scale / 100
  imgHeight = oriHeight * scale / 100
}

function setSvgDim(){
  svgWidth = svg.clientWidth
  svgHeight = svg.clientHeight
}

function setFitScale(){
  let ws = svgWidth / oriWidth
  let hs = svgHeight / oriHeight
  scale = (ws < hs) ? ws : hs
  scale = Math.floor(scale * 100)
}

function setOriScale(){
  scale = 100
}

function setDefaultScale(){
  if ((oriWidth > svgWidth)||(oriHeight > svgHeight)) {
    setFitScale()
  } else {
    setOriScale()
  }
}

function setImgPos(){
  x = (svgWidth - imgWidth)/2
  y = (svgHeight - imgHeight)/2
}

function setImg(){
  svgimg.setAttributeNS(null,'height', imgHeight.toString())
  svgimg.setAttributeNS(null,'width', imgWidth.toString())
  svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', src)
  svgimg.setAttributeNS(null,'x', x.toString())
  svgimg.setAttributeNS(null,'y', y.toString())
  svgimg.setAttributeNS(null, 'visibility', 'visible')
  // svgimg.setAttributeNS(null, 'transform', 'rotate(45 '+x+' '+y+')')
  setDisplay()
}

function setDisplay() {
  scale_btnj.text(scale.toString()+'%')
}

function resizeHandler(){
  setSvgDim()
  if (!zoomed) {setDefaultScale()}
  setImgDim()
  setImgPos()
  setImg()
}

function zoomin(){
  zoomed = true
  scale += 10
  scale = (scale > 1000) ? 1000 : scale
  setImgDim()
  setImgPos()
  setImg()
}

function zoomout(){
  zoomed = true
  scale -= 10
  scale = (scale < 1) ? 1 : scale
  setImgDim()
  setImgPos()
  setImg()
}

function actual(){
  zoomed = true
  setOriScale()
  setImgDim()
  setImgPos()
  setImg()
}

function fit(){
  zoomed = false
  setFitScale()
  setImgDim()
  setImgPos()
  setImg()
}
