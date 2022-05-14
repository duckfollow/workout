import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [second, setSecond] = useState(15)
  const [time, setTime] = useState(second)
  const [count, setCount] = useState(0)
  const [isStart, setIsStart] = useState(false)
  var interval = null
  const sqSize = 200;
  const strokeWidth = 15;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const radius = (sqSize - strokeWidth) / 2;
  const dashArray = radius * Math.PI * 2;

  const clickStart = () => {
    var timer = time;
    setIsStart(true)
    interval = setInterval(() => {
      timer = timer - 1;
      setTime(timer)
      console.log(timer)
      if (timer <= 0) {
        clearInterval(interval)
        setCount(count => count + 1)
        setTime(second)
        setIsStart(false)
      }
    }, 1000)
  }

  const addSecond = () => {
    if (!isStart) {
      if (second < 60) {
        let newSecond = second + 5;
        setSecond(newSecond)
        setTime(newSecond)
      } else {
        setSecond(15)
        setTime(15)
      }
    }
  }
  return (

    <div className={styles.container}>
      <Head>
        <title>Workout</title>
        <meta name="description" content="Workout Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://workout.duckfollow.co"
          rel="noopener noreferrer">Workout</a>
        </h1>

        <p className={styles.description}>
          x{count}
        </p>

        <svg
          width={sqSize}
          height={sqSize}
          viewBox={viewBox}
          onClick={addSecond}>
          <circle
            className="circle-background"
            cx={sqSize / 2}
            cy={sqSize / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`} />
          <circle
            className="circle-progress"
            cx={sqSize / 2}
            cy={sqSize / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
            // Start progress marker at 12 O'Clock
            transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
            style={{
              strokeDasharray: dashArray,
              strokeDashoffset: (dashArray - dashArray * ((time * 100) / second) / 100)
            }} />
          <text
            className="circle-text"
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle">
            {time}
          </text>
        </svg>

        <p>
          <button className={styles.button} onClick={clickStart} disabled={isStart}>Start</button>
        </p>

        {/* <div className={styles.grid}>
          <div className={styles.card}>
              <Image src="/plank.png" alt="plank" width={64} height={64} />
          </div>
          <div className={styles.card}>
              <Image src="/yoga.png" alt="yoga" width={64} height={64} />
          </div>
          <div className={styles.card}>
              <Image src="/yoga1.png" alt="yoga1" width={64} height={64} />
          </div>
          <div className={styles.card}>
              <Image src="/yoga2.png" alt="yoga2" width={64} height={64} />
          </div>
        </div> */}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://tech.duckfollow.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by duckfollow
        </a>
      </footer>
    </div>
  )
}
