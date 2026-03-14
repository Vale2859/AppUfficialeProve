const rooms = {

elegance:[
"e1.jpeg",
"e2.jpeg",
"e3.jpeg",
"e4.jpeg"
],

comfort:[
"c1.jpeg",
"c2.jpeg",
"c3.jpeg",
"c4.jpeg",
"c5.jpeg",
"c6.jpeg",
"c7.jpeg",
"c8.jpeg",
"c9.jpeg",
"c10.jpeg"
],

family:[
"f1.jpeg",
"f2.jpeg",
"f3.jpeg",
"f4.jpeg",
"f5.jpeg",
"f6.jpeg",
"f7.jpeg",
"f8.jpeg",
"f9.jpeg",
"f10.jpeg"
],

relax:[
"z1.jpeg",
"z2.jpeg",
"z3.jpeg",
"z4.jpeg",
"z5.jpeg",
"z6.jpeg"
]

}

function openGallery(room){

let gallery=document.getElementById("gallery")
let img=document.getElementById("gallery-img")
let thumbs=document.getElementById("thumbs")

gallery.style.display="block"

img.src=rooms[room][0]

thumbs.innerHTML=""

rooms[room].forEach(photo=>{

let t=document.createElement("img")

t.src=photo

t.style.width="100px"

t.style.margin="10px"

t.onclick=function(){
img.src=photo
}

thumbs.appendChild(t)

})

}

function closeGallery(){
document.getElementById("gallery").style.display="none"
}
