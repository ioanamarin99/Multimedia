//Ne luam intr-un const svg-ul mare pe care vom desena
const svg = document.getElementById("workspace");

//functia de desenare pt dreptunghi
function drawRectangle() {

  let rect;
  //variabila de tip flag care ne avertizeaza cand mouse-ul este down sau up
  let mouseDown = false;
  let x = 0;
  let y = 0;

  let color = document.getElementById("pen-color-stroke");
  let size = document.getElementById("pen-size");
//atasam functii pentru proprietatile onmousedown, onmouseup, onmousemove
//ONMOUSEDOWN
  svg.onmousedown = function (e) {
   //ne cream un obiect de tip svg, rectangle, folosind namespace-ul
    rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    //ne luam coordonatele initiale din care pornim desenarea dreptunghiului
    x = e.clientX;
    y = e.clientY;
    //setam coordonatele din coltul din stanga, sus ale drepunghiului.
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    //setam mousedown pe true
    mouseDown = true;
  };
  //ONMOUSEUP
  //aici ne asiguram ca mouseDown e false, pentru a nu continua desenarea in onmousemove
  svg.onmouseup = function (e) { mouseDown = false; };

//ONMOUSEMOVE
  svg.onmousemove = function (e) {

   //ne asiguram ca mouse-ul este inca down
    if (mouseDown) {
     //calculam latinea si inaltimea dreptunghiului, ca diferente dintre coordonatele initiale si cele curente.
      const width = Math.abs(e.clientX - x);
      const height = Math.abs(e.clientY - y);
      //setam atributele de inaltime si latime dreptunghiului
      rect.setAttribute('width', width);
      rect.setAttribute('height', height);
      //setam conturul cu culoarea curenta
      rect.setAttribute('stroke', color.value);
      //momentan nu adaugam fill
      rect.setAttribute('fill', 'none');
      //setam si grosimea conturului cu valoarea curenta
      rect.setAttribute('stroke-width', size.value);
      //adaugam noul dreptunghi creat pe svg-ul nostru
      svg.appendChild(rect);
    }
  };
}
//FUNCTIA DE DESENARE A UNEI LINII
function drawLine() {
  let line;
  //la fel ca la dreptunghi, variabila de tip flag
  let mouseDown = false;
  //ne luam elementele pentru culoare si grosime a liniei
  let color = document.getElementById("pen-color-stroke");
  let size = document.getElementById("pen-size");
  //ONMOUSEDOWN
  svg.onmousedown = function (e) {
   //ne cream obiectul de tip linie
    line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    //setam coordonatele initiale
    line.setAttribute('x1', e.clientX);
    line.setAttribute('y1', e.clientY);
    line.setAttribute('x2', e.clientX);
    line.setAttribute('y2', e.clientY);
    //mousedown true
    mouseDown = true;
  };
  //ONMOUSEUP
  svg.onmouseup = function (e) {
    //setam mousedown false
    mouseDown = false;
  };
  //ONMOUSEMOVE
  svg.onmousemove = function (e) {

    if (mouseDown) {
      //in functie de deplasarea cu mouse-ul, setam coordonatele de la celalalt capat al liniei
      line.setAttribute('x2', e.clientX);
      line.setAttribute('y2', e.clientY);
      //setam culoarea conturului
      line.setAttribute('stroke', color.value);
      //setam grosimea conturului
      line.setAttribute('stroke-width', size.value);
      //adaugam noua linie pe svg
      svg.appendChild(line);

    }
  };
}
//FUNCTIE DE DESENARE ELIPSA
//Aici am avut ceva dificultati in conceperea unui cod care sa-mi permita sa dragez eipsa, de aceea am ales sa desenez o elipsa cu rx,ry prestabilite 
function drawEllipse() { 
  let ellipse;
  let mouseDown = false;
  let color = document.getElementById("pen-color-stroke");
  let size = document.getElementById("pen-size");
  //ONMOUSEDOWN
  svg.onmousedown = function (e) {
    //ne cream elipsa svg
    ellipse = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
    //ii preluam coordonatele centrului din coordonatele curente
    ellipse.setAttribute("cx", e.clientX);
    ellipse.setAttribute("cy", e.clientY);
    //ii setam razele rx si ry cu niste dimensiuni fixe
    ellipse.setAttribute("rx", 200);
    ellipse.setAttribute("ry", 100);
    //ii setam culoarea conturului si grosimea
    ellipse.setAttribute('stroke', color.value);
    ellipse.setAttribute('stroke-width', size.value);
    ellipse.setAttribute('fill', 'none');
    //o adaugam la svg
    svg.appendChild(ellipse);
    mouseDown = true;
  }
  //Acum nu mai avem nevoie de onmouseup, l-am lasat aici in eventualitatea in care revin cu modificari asupra codului
  svg.onmouseup = function (e) { mouseDown = false; }
};
//FUNCTIA DRAW
//ne indica ce forma a ales utilizatorul sa deseneze pe svg si in functie de asta apeleaza functia respectiva
function draw(shape) {

  switch (shape) {
    case "line":
      drawLine();
      break;
    case "rectangle":
      drawRectangle();
      break;
    case "ellipse":
      drawEllipse();
      break;
  }
}
//Setam proprietatea onclick a svg-ului pentru a face posibila selectia elementelor desenate 
svg.onclick = function (e) {
  //ne luam o variabila pentru selectarea elementului si o setam initial 0
  let selectSVGelement = 0;
  //ne luam elementele specifice pentru culoare contur, background si grosime contur
  let strokeColor = document.getElementById("pen-color-stroke");
  let fillColor = document.getElementById("pen-color-fill");
  let size = document.getElementById("pen-size");
  //apoi, cu proprietatea target, vedem ce element am selectat cu click-ul:
  //ne intereseaza doar daca acel element are id-ul diferit de cel al svg-ului mare pe care desenam (workspace)
  if (e.target.id !== 'workspace') {
    //daca am identificat elementul dorit, il selectam in variabila noastra definita anterior
    selectSVGelement = e.target;
    if (selectSVGelement) {
     //doar in cazul in care am selectat un element, ii vom reseta culoarea conturului, background-ul si grosimea conturului
      selectSVGelement.setAttribute('stroke', strokeColor.value);
      selectSVGelement.setAttribute('fill', fillColor.value);
      selectSVGelement.setAttribute('stroke-width', size.value);
    }
  }
}
//ne luam butonul de undo
let undoButton = document.getElementById("undoBtn");
//ii atribuim evenimentul click
undoButton.addEventListener("click", undo);
function undo() {
  //luam ultimul element adaugat pe svg
  let child = svg.lastChild;
  //  ne asiguram ca avem un ultim element adaugat pe svg, ca sa nu stergem chiar workspace-ul
  if (child != null)
    svg.removeChild(child);
    //il stergem
}
//obtinem butonul de save
let saveBtn = document.getElementById("saveBtn");
//ii atribuim evenimentul click
saveBtn.addEventListener("click", () => {
//ne luam intregul svg pe care am desenat
  let svgElem = document.getElementById('workspace');
  //folosind XMLSerializaer, convertim svg-ul nostru la string
  let svgToString = (new XMLSerializer()).serializeToString(svgElem);
   // ne cream un element html de tip a
  let link = document.createElement('a');
  //folosim encodeURIComponent pt a codifica caracterele speciale din string si atribuim hreful elementului nostru link
  link.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgToString);
  link.download = 'SVG_FILE.svg'; //numele sub care va fi donwnloadat fisierul
  link.click();
});
//functia principala
function setup() {
  //ne luam toate butoanele cu atribute de tip data-shape
  const buttons = document.querySelectorAll("button[data-shape]");
  for (let i = 0; i < buttons.length; i++) {
    //le atribuim evenimentul click
    buttons[i].addEventListener("click", (e) => {
     //retinem forma lor in variabila shape, accesand atributul data
      const shape = buttons[i].getAttribute('data-shape');
      //apelam functia de desenare avand ca parametru forma pe care dorim sa o desenam
      draw(shape);
    });
  }
}