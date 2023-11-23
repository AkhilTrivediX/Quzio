import React, { useState,useEffect,useRef } from 'react';
import styles from '../styles/matchpairs.module.css';

function randomOrderGenerator(count) {
  return [3, 1, 2, 0];
}

function CreateMatchPairs({ position, pairs, quesStatus, setQuesStatus }) {
  const [currentOrder,setCurrentOrder]=useState(randomOrderGenerator(4));
  const optionsOrder=currentOrder;
  const columnRef=useRef();
  const pairRef=useRef();

  function getNearestRelativeParent(element) {
    let ancestor = element.parentElement;
    
    while (ancestor) {
        const computedStyle = getComputedStyle(ancestor);
        if (computedStyle.position === 'relative') {
            return ancestor;
        }
        
        ancestor = ancestor.parentElement;
    }

    // If no relatively positioned ancestor is found, you can return null or document.body
    return null;
}

  async function updateOrderPosition(){
    let columns=columnRef.current.childNodes;
    let pairs=pairRef.current.childNodes;
    currentOrder.forEach((pairIndex,ActualIndex)=>{
      let targetPair=pairs[ActualIndex]
      let column=columns[pairIndex];
      let heightDifference=targetPair.getBoundingClientRect().height-column.getBoundingClientRect().height;
      
      targetPair.style.top=(((0-targetPair.offsetTop)+(column.offsetTop)-(heightDifference/2))|| targetPair.style.top)+'px';
      
      console.log(targetPair.offsetTop+' and '+column.offsetTop+' for index '+actualIndex)
    })

  }

  useEffect(()=>{
    console.log('Order Position Updation Called')
    updateOrderPosition();
  },[currentOrder])
  

  function choseOption(e,optionNumber) {
    console.log('Running choseOption for '+position+' as '+quesStatus[position])
    console.log(quesStatus)
    if(quesStatus[position]!='listed') return console.log('Found '+quesStatus[position]);
    if (optionNumber === 0) {
      setQuesStatus((prevStatus) => {
        prevStatus[position] = 'right';
        return { ...prevStatus };
      });
    } else {
      setQuesStatus((prevStatus) => {
        prevStatus[position] = 'wrong';
        let childN=e.target.parentNode.childNodes;
        childN.forEach((child=>{
            child.style.border="4px solid rgba(255, 48, 69, 0.6)";
            child.style.backgroundColor= "rgba(255,25,25, 0.2)"
        }))
        return { ...prevStatus };
      });
    }
  }

  return (
    <div className={styles.modal} key={position}>
      <div className={styles.questionSection}>
        <div className={styles.questionNumber}>Q {position}</div>
        <div className={styles.question}>Match with correct pairs.</div>
      </div>
      <div className={styles.answersArea}>
      <div className={styles.columnSection} ref={columnRef}>
        {optionsOrder.map((optionIndex, actualIndex) => (
                <div className={styles.column} key={actualIndex}>{pairs[actualIndex][0]}</div>
        ))}
        </div>

        <div className={styles.pairSection} ref={pairRef}>
        {optionsOrder.map((optionIndex, actualIndex) => (
                <div className={styles.pair} key={actualIndex} onClick={()=>{setCurrentOrder([0,1,2,3])}}>{pairs[optionIndex][1]}</div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default CreateMatchPairs;