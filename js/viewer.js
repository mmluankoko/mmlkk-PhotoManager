const ipc = require('electron').ipcRenderer
const fs = require('fs')
const path = require('path')

let oriWidth, oriHeight, imgWidth, imgHeight, svgWidth, svgHeight, x, y
let svg, svgj, img, svgimg, scale_btnj, prev_btnj, next_btnj, titlej
let scale, zoomed
let src, dirname, basename, images, curIndex

ipc.on('img-src', (event, imgSrc) => {
  if (imgSrc)
    init(imgSrc)
})

function init(imgSrc){
  src = imgSrc
  dirname = path.dirname(src)
  basename = path.basename(src)
  prev_btnj = $('#prev_btn')
  next_btnj = $('#next_btn')
  prev_btnj.addClass('loading')
  next_btnj.addClass('loading')
  scale_btnj = $('#scale_btn')
  titlej = $('#title')
  svgj = $('svg')
  svg = svgj[0]
  svgimg = document.createElementNS('http://www.w3.org/2000/svg','image')
  svgj.append(svgimg)
  fs.readdir(dirname, (err, files) => {
    if (!err){
      console.log('files',files)
      images = files.filter(isImage)
      console.log('images',images)
      curIndex = images.indexOf(basename)
      loadImage()
      prev_btnj.removeClass('loading')
      next_btnj.removeClass('loading')
      setBtn()
    }
  })


  $(window).resize(_.throttle(resizeHandler, 100))
  next_btnj.click(() => {
    curIndex++
    loadImage()
    setBtn()
  })
  prev_btnj.click(() => {
    curIndex--
    loadImage()
    setBtn()
  })
  $('#zoomin_btn').click(zoomin)
  $('#zoomout_btn').click(zoomout)
  $('#actual_btn').click(actual)
  $('#fit_btn').click(fit)
}

function loadImage(){
  console.log('loadImage', curIndex, images.length)
  img = null
  img = new Image()
  scale = 100
  zoomed = false
  basename = images[curIndex]
  src = path.join(dirname,basename)
  img.src = src
  img.onload = () => {
    setOriDim()
    setSvgDim()
    setDefaultScale()
    setImgDim()
    setImgPos()
    setImg()
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

function setImg(){
  svgimg.setAttributeNS(null,'height', imgHeight.toString())
  svgimg.setAttributeNS(null,'width', imgWidth.toString())
  svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', src)
  svgimg.setAttributeNS(null,'x', x.toString())
  svgimg.setAttributeNS(null,'y', y.toString())
  svgimg.setAttributeNS(null, 'visibility', 'visible')
  // svgimg.setAttributeNS(null, 'transform', 'rotate(45 '+x+' '+y+')')
  setScaleDisplay()
  setTitle()
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

function isImage(file){
  let imgExts = ['png','jpg','png']
  let ext = file.slice(file.lastIndexOf('.')+1).toLowerCase()
  return imgExts.includes(ext)
}

function setBtn(){
  if (curIndex==images.length-1){
    next_btnj.addClass('disabled')
  } else if (curIndex==0){
    prev_btnj.addClass('disabled')
  } else {
    prev_btnj.removeClass('disabled')
    next_btnj.removeClass('disabled')
  }
}
