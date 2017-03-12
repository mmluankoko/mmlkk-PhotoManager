const ipc = require('electron').ipcRenderer
const fs = require('fs')
const path = require('path')

let oriWidth, oriHeight, imgWidth, imgHeight, svgWidth, svgHeight, x, y
let svg, svgj, img, svgimg, scale_btnj, prev_btnj, next_btnj, titlej, openj
let scale, zoomed
let src, dirname, basename, images, curIndex

init()
ipc.on('image-path', (event, imgPath) => {
  if (imgPath){
    dirname = path.dirname(imgPath)
    basename = path.basename(imgPath)
    loadImage(1)
    loadImages()
  }
})

/**
 * initialize global variables, set button actions, ipc callbacks
 */
function init(){
  // initialize global variables and button actions
  prev_btnj = $('#prev_btn')
  next_btnj = $('#next_btn')
  scale_btnj = $('#scale_btn')
  titlej = $('#title')
  svgj = $('svg')
  svg = svgj[0]
  svgimg = document.createElementNS('http://www.w3.org/2000/svg','image')

  svgj.append(svgimg)
  $('#open_btn').click(openHandler)
  $('#zoomin_btn').click(zoominHandler)
  $('#zoomout_btn').click(zoomoutHandler)
  $('#actual_btn').click(actualHandler)
  $('#fit_btn').click(fitHandler)
  prev_btnj.click(prevHandler)
  next_btnj.click(nextHandler)
  $(window).resize(_.throttle(resizeHandler, 100))
}

/**
 * Load the list of all images in the same dir.
 */
function loadImages(){
  prev_btnj.addClass('loading')
  next_btnj.addClass('loading')
  fs.readdir(dirname, (err, files) => {
    if (!err){
      images = files.filter(isImage)
      curIndex = images.indexOf(basename)
      prev_btnj.removeClass('loading')
      next_btnj.removeClass('loading')
      setBtn()
    }
  })
}

/**
 * Update global basename according to curIndex iff firstLoad is not undefined.
 * Then update global basename and load image.
 */
function loadImage(firstLoad){
  img = new Image()
  zoomed = false
  if (!firstLoad){
    basename = images[curIndex]
  }
  src = path.join(dirname, basename)
  img.src = src
  img.onload = () => {
    setOriDim()
    setSvgDim()
    setDefaultScale()
    setImgDim()
    setImgPos()
    updateImg()
    setTitle()
  }
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

function updateImg(){
  svgimg.setAttributeNS(null,'height', imgHeight.toString())
  svgimg.setAttributeNS(null,'width', imgWidth.toString())
  svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', src)
  svgimg.setAttributeNS(null,'x', x.toString())
  svgimg.setAttributeNS(null,'y', y.toString())
  svgimg.setAttributeNS(null, 'visibility', 'visible')
  // svgimg.setAttributeNS(null, 'transform', 'rotate(45 '+x+' '+y+')')
  setScaleDisplay()
}

function setScaleDisplay() {
  scale_btnj.text(scale.toString()+'%')
}
function setTitle(){
  titlej.text(basename)
}

function resizeHandler(){
  setSvgDim()
  if (!zoomed) {setDefaultScale()}
  setImgDim()
  setImgPos()
  updateImg()
}

function zoominHandler(){
  zoomed = true
  scale += 10
  scale = (scale > 1000) ? 1000 : scale
  setImgDim()
  setImgPos()
  updateImg()
}

function zoomoutHandler(){
  zoomed = true
  scale -= 10
  scale = (scale < 1) ? 1 : scale
  setImgDim()
  setImgPos()
  updateImg()
}

function actualHandler(){
  zoomed = true
  setOriScale()
  setImgDim()
  setImgPos()
  updateImg()
}

function fitHandler(){
  zoomed = true
  setFitScale()
  setImgDim()
  setImgPos()
  updateImg()
}

function prevHandler(){
  curIndex--
  loadImage()
  setBtn()
}

function nextHandler(){
  curIndex++
  loadImage()
  setBtn()
}

function openHandler(){
  ipc.send('open-image-file')
}

function isImage(file){
  let imgExts = ['png','jpg','png']
  let ext = file.slice(file.lastIndexOf('.')+1).toLowerCase()
  return imgExts.includes(ext)
}

function setBtn(){
  if (curIndex==images.length-1){
    next_btnj.addClass('disabled')
  } else {
    next_btnj.removeClass('disabled')
  }
  if (curIndex==0){
    prev_btnj.addClass('disabled')
  } else {
    prev_btnj.removeClass('disabled')
  }
}
