import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring";

function MemoryGame({options, setOptions, highScore, setHighScore}) {
  const [game, setGame] = useState([])
  const [flippedCount, setFlippedCount] = useState(0)
  const [flippedIndexes, setFlippedIndexes] = useState([])

  const colors = [
    '#ecdb54',
    '#e34132',
    '#6ca0dc',
    '#944743',
    '#dbb2d1',
    '#ec9787',
    '#00a68c',
    '#645394',
    '#6c4f3d',
    '#ebe1df',
    '#bc6ca7',
    '#bfd833',
  ]
  const pictureurls = [ 
    'https://image.16pic.com/00/61/44/16pic_6144095_s.jpg?imageView2/0/format/png',
    'http://lh3.ggpht.com/_6VYfw1bbhTM/SLoBP5A1YJI/AAAAAAAARpg/BXGzmVSVyfQ/s512/%E8%97%A5%E5%B8%AB%E4%BD%9B015.jpg',
    'https://lh3.googleusercontent.com/proxy/xsVmMiR7ECTSUB4idcp7erlfgeBk5ZCrmqUJ93EK1IvE8TpvFUlfNbDj9ydeVXSb8n5DwdWqpoNfTogN6rLay7U2mRXCuF6q4FiTfqZnfdzO',
    'https://www.merit-times.com/news_pic/20200721/1417685_1005472.jpg',
    'https://nianjue.org/cacheimg/4b/dd/548ce44000f5192c1ba1fb2ed3e2.jpg',
    'http://www.fodizi.tw/uploadfile/201612/19/055599376.jpg',
    'https://image.16pic.com/00/61/44/16pic_6144095_s.jpg?imageView2/0/format/png',
    'http://lh3.ggpht.com/_6VYfw1bbhTM/SLoBP5A1YJI/AAAAAAAARpg/BXGzmVSVyfQ/s512/%E8%97%A5%E5%B8%AB%E4%BD%9B015.jpg',
    'https://lh3.googleusercontent.com/proxy/xsVmMiR7ECTSUB4idcp7erlfgeBk5ZCrmqUJ93EK1IvE8TpvFUlfNbDj9ydeVXSb8n5DwdWqpoNfTogN6rLay7U2mRXCuF6q4FiTfqZnfdzO',
    'https://www.merit-times.com/news_pic/20200721/1417685_1005472.jpg',
    'https://nianjue.org/cacheimg/4b/dd/548ce44000f5192c1ba1fb2ed3e2.jpg',
    'http://www.fodizi.tw/uploadfile/201612/19/055599376.jpg',
  ]

  useEffect(() => {
    const newGame = []
    for (let i = 0; i < options / 2; i++) {
      const firstOption = {
        id: 2 * i,
        colorId: i,
        color: colors[i],
        pictureurl:pictureurls[i],
        flipped: false,
      }
      const secondOption = {
        id: 2 * i + 1,
        colorId: i,
        color: colors[i],
        pictureurl:pictureurls[i],
        flipped: false,
      }

      newGame.push(firstOption)
      newGame.push(secondOption)
    }

    const shuffledGame = newGame.sort(() => Math.random() - 0.5)
    setGame(shuffledGame)
  }, [])

  useEffect(() => {
    // Loads when the game variable changes
    const finished = !game.some(card => !card.flipped)
  if (finished && game.length > 0) {
    setTimeout(() => {
      const bestPossible = game.length
      let multiplier

      if (options === 12) {
        multiplier = 5
      } else if (options === 18) {
        multiplier = 2.5
      } else if (options === 24) {
        multiplier = 1
      }

      const pointsLost = multiplier * (0.66 * flippedCount - bestPossible)

      let score
      if (pointsLost < 100) {
        score = 100 - pointsLost
      } else {
        score = 0
      }

      if (score > highScore) {
        setHighScore(score)
        const json = JSON.stringify(score)
        localStorage.setItem('memorygamehighscore', json)
      }

      const newGame = confirm('You Win!, SCORE: ' + score + ' New Game?')
      if (newGame) {
        const gameLength = game.length
        setOptions(null)
        setTimeout(() => {
          setOptions(gameLength)
        }, 5)
      } else {
        setOptions(null)
      }
    }, 500)
  }
  }, [game])

  if (flippedIndexes.length === 2) {
    // Runs if two cards have been flipped
    const match = game[flippedIndexes[0]].colorId === game[flippedIndexes[1]].colorId

    if (match) {
      const newGame = [...game]
      newGame[flippedIndexes[0]].flipped = true
      newGame[flippedIndexes[1]].flipped = true
      setGame(newGame)
  
      const newIndexes = [...flippedIndexes]
      newIndexes.push(false)
      setFlippedIndexes(newIndexes)
    } else {
      const newIndexes = [...flippedIndexes]
      newIndexes.push(true)
      setFlippedIndexes(newIndexes)
    }
  }

  if (game.length === 0) return <div>loading...</div>
  else {
    return (
      <div id="cards">
        {game.map((card, index) => (
          <div className="card" key={index}>
            <Card
              id={index}
              color={card.color}
              pictureurl={card.pictureurl}
              game={game}
              flippedCount={flippedCount}
              setFlippedCount={setFlippedCount}
              flippedIndexes={flippedIndexes}
              setFlippedIndexes={setFlippedIndexes}
            />
          </div>
        ))}
      </div>
    )
  }
}

function Card({
  id,
  color,
  pictureurl,
  game,
  flippedCount,
  setFlippedCount,
  flippedIndexes,
  setFlippedIndexes,
}) {
  const [flipped, set] = useState(false)
  const {transform, opacity} = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: {mass: 5, tension: 500, friction: 80},
  })

  useEffect(() => {
    console.log('Flipped Indexes Changed')
    if (flippedIndexes[2] === true && flippedIndexes.indexOf(id) > -1) {
      setTimeout(() => {
        set(state => !state)
        setFlippedCount(flippedCount + 1)
        setFlippedIndexes([])
      }, 1000)
    } else if (flippedIndexes[2] === false && id === 0) {
      setFlippedCount(flippedCount + 1)
      setFlippedIndexes([])
    }
  }, [flippedIndexes])

  const onCardClick = () => {
    console.log('Card Clicked')
    if (!game[id].flipped && flippedCount % 3 === 0) {
      set(state => !state)
      setFlippedCount(flippedCount + 1)
      const newIndexes = [...flippedIndexes]
      newIndexes.push(id)
      setFlippedIndexes(newIndexes)
    } else if (
      flippedCount % 3 === 1 &&
      !game[id].flipped &&
      flippedIndexes.indexOf(id) < 0
    ) {
      set(state => !state)
      setFlippedCount(flippedCount + 1)
      const newIndexes = [...flippedIndexes]
      newIndexes.push(id)
      setFlippedIndexes(newIndexes)
    }
  }

  return (
    <div onClick={onCardClick}>
      <a.div
        className="c back"
        style={{
          opacity: opacity.interpolate(o => 1 - o),
          transform,
        }}
      />
      <a.div
        className="c front"
        style={{
          opacity,
          transform: transform.interpolate(t => `${t} rotateX(180deg)`),
          // background: color,
          backgroundImage: `url(${pictureurl})`,
        }}
      />
    </div>
  )
}

export default MemoryGame;