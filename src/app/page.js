import Image from 'next/image'
import styles from './styles/page.module.css'
import TestModal from './components/testModal'

export default function Home() {
  return (
    <main className={styles.main} styles={"root:--primary-theme:rgb(255,10,10);--primary-ascent:rgb(22, 102, 250);"}>
      <div className={styles.backgroundElementsGroup}>
        <div className={styles.backgroundBall} style={{top:"30%",left:"30%",width:"300px"}}></div>
        <div className={styles.backgroundBall} style={{top:"20%",left:"55%",width:"150px"}}></div>
        <div className={styles.backgroundBall} style={{top:"40%",left:"50%",width:"200px"}}></div>
        
      </div>
      <div className={styles.mainArea}>
        <TestModal/>
      </div>
    </main>
  )
}
