import { useEffect, useState, useMemo } from 'react'

const words = ['ovo de páscoa']
const getRandomWord = () => words[Math.floor(Math.random() * words.length)]

const shuffle = (array) => {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function Hangman() {
  const gridSize = 15
  const totalBlocks = gridSize * gridSize
  const [word, setWord] = useState(null)
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongGuesses, setWrongGuesses] = useState(0)

  const maxErrors = 50

  const shuffledBlockOrder = useMemo(
    () => shuffle(Array.from({ length: totalBlocks }, (_, i) => i)),
    []
  )

  useEffect(() => {
    setWord(getRandomWord())
  }, [])

  if (!word) return null

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter)) return
    const isCorrect = word.includes(letter)
    setGuessedLetters([...guessedLetters, letter])
    if (!isCorrect) {
      setWrongGuesses(wrongGuesses + 1)
    }
  }

  const handleReset = () => {
    setWord(getRandomWord())
    setGuessedLetters([])
    setWrongGuesses(0)
  }

  const isWinner = word.split('').every((letter) => guessedLetters.includes(letter))
  const isLoser = wrongGuesses >= maxErrors

  const uniqueLetters = [...new Set(word.split(''))]
  const correctLetters = uniqueLetters.filter((letter) =>
    guessedLetters.includes(letter)
  )

  const revealPercentage = correctLetters.length / uniqueLetters.length
  const revealCount = Math.floor(revealPercentage * totalBlocks)

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const firstRow = alphabet.slice(0, 13)
  const secondRow = alphabet.slice(13)

  const renderWord = () =>
    word.split('').map((letter, i) => (
      <span key={i} className="border-b-2 w-6 mx-1 text-2xl text-center">
        {guessedLetters.includes(letter) || isLoser ? letter : '_'}
      </span>
    ))

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-6 p-4">
      {/* IMAGEM + BLOCOS PRETOS */}
      <div className="relative w-96 h-96 overflow-hidden rounded shadow-lg">
        <img
          src="/forca.jpg"
          alt="Imagem"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 z-10">
          {shuffledBlockOrder.map((blockIndex, i) => {
            const row = Math.floor(blockIndex / gridSize)
            const col = blockIndex % gridSize
            const blockSize = 100 / gridSize
            const isHidden = i < revealCount

            return (
              <div
                key={blockIndex}
                className="absolute transition-opacity duration-300"
                style={{
                  backgroundColor: 'black',
                  zIndex: 10,
                  top: `${row * blockSize}%`,
                  left: `${col * blockSize}%`,
                  width: `${blockSize}%`,
                  height: `${blockSize}%`,
                  opacity: isHidden ? 0 : 1,
                }}
              />
            )
          })}
        </div>
      </div>

      {/* PALAVRA */}
      <div className="flex justify-center flex-wrap">{renderWord()}</div>

      {/* ERROS */}
      <div className="text-lg">Erros: {wrongGuesses} / {maxErrors}</div>

      {/* TECLADO */}
      <div className="space-y-2">
        <div className="flex flex-wrap justify-center gap-2">
          {firstRow.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter) || isWinner || isLoser}
              className="bg-blue-500 text-white rounded px-3 py-2 disabled:opacity-40"
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {secondRow.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter) || isWinner || isLoser}
              className="bg-blue-500 text-white rounded px-3 py-2 disabled:opacity-40"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTADO */}
      {(isWinner || isLoser) && (
        <div className="text-xl font-semibold">
          {isWinner ? '🎉 Você venceu!' : `💀 Você perdeu! A palavra era "${word}"`}
        </div>
      )}

      {/* RESET */}
      <button
        onClick={handleReset}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
      >
        Jogar Novamente
      </button>
    </div>
  )
}
