document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div '));
    const width = 10;
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start');
    let nextRandom = 0;
    let timerId
    let score = 0;
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]


    // drawing tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]


    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];


    let currentPosition = 4;
    let currentRotation = 0;


    // randomizing tetrominoes
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random ][currentRotation];


// function to draw tetrominoes to the page
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}


function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
    })
}


// tetromino moving down
    // timerId = setInterval(moveDown, 500);

// assigning key codes to control tetrominoes
    function control (e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)


// function to move tetromino
    function moveDown () {
        undraw()
        currentPosition += width;
        draw();
        freeze()
    }

    function freeze () {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // continue with another tetromino
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }



    // alow tetromino to move left to the edge but not cross it
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    // alow tetromino to move right to the edge but not cross it
    function moveRight () {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if(!isAtRightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    // alow tetromino to rotate around
    function rotate () {
        undraw()
        currentRotation++
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw()
    }

    // show next tetromino coming up

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //ltetromino

        [0, displayWidth, displayWidth+1, displayWidth*2+1], // zTetromino

        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino

        [0, 1, displayWidth, displayWidth+1], //oTetromino

        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }


    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 500)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        }
    })

    // mobile controls
    const up = document.querySelector('.up').addEventListener('click', () => rotate())

    const left = document.querySelector('.left').addEventListener('click', () => moveLeft())

    const right = document.querySelector('.right').addEventListener('click', () => moveRight())

    const down = document.querySelector('.down').addEventListener('click', () => moveDown())

    // score
    function addScore() {
        for(let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                console.log(squaresRemoved);
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }



})