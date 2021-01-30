/* Variables del juego */
const btn_start = document.getElementById("btn-start")
const counter = document.getElementById("level")

const yellow = document.getElementById("yellow")
const blue = document.getElementById("blue")
const red = document.getElementById("red")
const green = document.getElementById("green")

const MAX_LEVEL = 10
let count = 1

/* Clase principal del juego */
class Game {
    constructor() {
        this.initializeGame()
        this.globalSequence()
        // El color empieza a iluminarse despues de 1/2 segundo de apretado el botón
        setTimeout(this.nextLevel, 500)
    }

    // Crea elemento html de tipo "audio" con sus atributos y lo agrega al body de forma oculta 
    loadSound(audio) {
        const sound = document.createElement("audio")
        sound.src = audio
        sound.setAttribute("preload", "auto")
        sound.setAttribute("controls", "none")
        sound.style.display = "none" 
        document.body.appendChild(sound)
        return sound
    }

    // Inicializa el juego
    initializeGame() {     
        // Lograr que this apunte al juego (clase Game) y no al DOM
        this.nextLevel = this.nextLevel.bind(this)
        this.changeStartButton()
        this.colors = {yellow, blue, red, green}
        this.level = 1

        // Carga los sonidos de acuerdo a un color
        this.sound_yellow = this.loadSound("assets/0.mp3")
        this.sound_blue = this.loadSound("assets/1.mp3")
        this.sound_red = this.loadSound("assets/2.mp3")
        this.sound_green = this.loadSound("assets/3.mp3")
        this.sounds = [this.sound_yellow, this.sound_blue, this.sound_red, this.sound_green]
    }

    // Muestra u oculta el botón de empezar juego 
    changeStartButton() {
        if(btn_start.classList.contains("hide")) {
            // Muestra el botón
            btn_start.classList.remove("hide")
        } else {
            // Oculta el botón
            btn_start.classList.add("hide")
        }
    }

    // Devuelve un número entero aleatorio entre 0 y 3
    numericSequence() {
        return Math.floor(Math.random() * 4)
    }

    // Crea e inicializa un array de 10 elementos y los llenas de ceros
    // fill() inicializa el array con ceros: [0,0,0,0,0,0,0,0,0,0] y map() los recorre
    globalSequence() {
        this.sequence = new Array(MAX_LEVEL).fill(0).map(this.numericSequence)
    }

    // Siguiente nivel
    nextLevel() {
        // Lograr que this apunte al juego (clase Game) y no al DOM
        this.chosenColor = this.chosenColor.bind(this)
        this.iluminateSequence()
        this.addClickEvents()
        this.sublevel = 0
        counter.innerText = count++
    }

    // Convierte numero a color
    convertNumberToColor(number) {
        switch(number) {
            // cuando hay return no es necesario poner break
            case 0:
                return "yellow" 
            case 1:
                return "blue"
            case 2:
                return "red"
            case 3:
                return "green"
        }
    }

    // Convierte color a numero
    convertColorToNumber(color) {
        switch(color) {
            case "yellow":
                return  0 
            case "blue":
                return 1
            case "red":
                return 2
            case "green":
                return 3
        }
    }

    // Ilumina los colores de la secuencia
    iluminateSequence() {
        for(let i=0; i<this.level; i++) {
            const color = this.convertNumberToColor(this.sequence[i])
            setTimeout(() => this.iluminateColor(color), 1000*i)
        }        
    }

    // Ilumina el color y da sonido segun el orden aleatorio
    iluminateColor(color) {
        this.colors[color].classList.add("soft", "increase")
        const sound_color = this.convertColorToNumber(color)
        this.sounds[sound_color].play()
        setTimeout(() => this.turnOffColor(color), 500)
    }

    // Remueve el color establecido
    turnOffColor(color) {
        this.colors[color].classList.remove("soft", "increase")
    }

    // Agrega evento click
    addClickEvents() {
        // const self = this
        // const _this = this
        this.colors.yellow.addEventListener('click', this.chosenColor)
        this.colors.blue.addEventListener('click', this.chosenColor)
        this.colors.red.addEventListener('click', this.chosenColor)
        this.colors.green.addEventListener('click', this.chosenColor)
    }

    // Remueve evento click
    removeClickEvents() {
        this.colors.yellow.removeEventListener('click', this.chosenColor)
        this.colors.blue.removeEventListener('click', this.chosenColor)
        this.colors.red.removeEventListener('click', this.chosenColor)
        this.colors.green.removeEventListener('click', this.chosenColor)
    }

    // Elige el color
    chosenColor(event) {
        const color_name = event.target.dataset.color
        const color_number = this.convertColorToNumber(color_name)
        this.iluminateColor(color_name)
        if(color_number === this.sequence[this.sublevel]) {
            this.sublevel++
            if(this.sublevel === this.level) {
                this.level++
                this.removeClickEvents()
                if(this.level === (MAX_LEVEL + 1)){
                    this.gameWon()
                } else {
                    setTimeout(() => this.nextLevel(), 1500)
                }
            }
        } else {
            this.gameLoss()
        }
    }

    // Muestra ventana ganador
    gameWon() {
        swal("Ganastes el juego", "Felicidades, tienes buena memoria", "success")
        // Devuelve una promesa
        .then(() => {
            this.removeClickEvents()
            this.initializeGame()
            resetLevelCounter()
        })
    }

    // Muestra ventana perdedor
    gameLoss() {
        swal("Perdiste el juego", "Lo sentimos, vuelve a intentarlo", "error")
        .then(() => {
            this.removeClickEvents()
            this.initializeGame()
            resetLevelCounter()
        })
    }
}

/* Reinicia el contador de nivel */
function resetLevelCounter() {
    count = 1
    counter.innerText = 0
}

/* Muestra ventana acerca de */
function about() {
    swal({
        title: "José De La Cruz",
        text: "Desarrollador Javascript Front End",
        icon: "info",
    })
}

/* Botón empezar juego que llama a la clase Game */
function startPlaying() {
    window.game = new Game()
}