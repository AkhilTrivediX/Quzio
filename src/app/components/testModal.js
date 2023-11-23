'use client'
import Image from 'next/image'
import {BsStars,BsArrowLeft,BsArrowRight} from 'react-icons/bs'
import styles from '../styles/testModal.module.css'
import {useState,useEffect,useRef} from 'react';
import  CreateMCQ  from './createMCQ';
import CreateMatchPairs from './createMatch';
import {RxCrossCircled} from 'react-icons/rx'
import {BiCheckCircle} from 'react-icons/bi'
import {AiOutlineMinusCircle} from 'react-icons/ai'
import OpenAI from "openai";

export default function TestModal() {

    const [quesCount,setQuesCount]=useState(5);
    const [quesType,setQuesType]=useState(['MCQ']);
    const [modalState,setModalState]=useState('initial');
    const [loadingPercentage,setLoadingPercentage]=useState(0);
    const [showAdditional,setshowAdditional]=useState(false);
    const [queryTopic,setQueryTopic]=useState('');
    const [queryLevel,setQueryLevel]=useState('');
    const [topicError,setTopicError]=useState(false);
    const [levelError,setLevelError]=useState(false);
    const [questionsModals,setQuestionModals]=useState(<></>);
    const [currentQuestion,setCurrentQuestion]=useState(1);
    const [modalPosition,setModalPosition]=useState([0]);
    const [responseQuestion,setResponseQuestion]=useState({});
    const [quesStatus,setQuesStatus]=useState({});
    const mainRef=useRef();
    const statusIcon={
      'listed':<AiOutlineMinusCircle/>,
      'wrong':<RxCrossCircled/>,
      'right':<BiCheckCircle/>
    }

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true 
    });
    

    const modalsInitialPosition=[0, 0, 20, 60, 120, 200, 300, 420, 560, 720, 900, 1100, 1320, 1560, 1820, 2100, 2400, 2720, 3060, 3420, 3800];

    const sampleResponse2={
      topic:'Arrays in C',
      level:'BTech Computer Science',
      questions:[
      {
        type:'MCQ',
        question:'How do you initialize array in C?',
        options:['int arr[3] = {1,2,3};','int arr(3) = (1,2,3);','int arr[3] = (1,2,3);','int arr(3) = {1,2,3};']
      },
      {
        type:'Descriptive',
        question:'Explain the concept of dynamic arrays in data structures.',
        answer:' Dynamic arrays are arrays that can grow or shrink in size during runtime, allowing for efficient memory management. They provide the flexibility of a resizable collection, unlike static arrays with fixed sizes.'
      },
      {
        type:'Match Pairs',
        pairs:[
          ['Bubble Sort','Time Complexity of O(n^2)'],
          ['Selection Sort','Suitable for small partially sorted datasets'],
          ['Insertion Sort','Stable and Adaptive'],
          ['Cocktail Shaker Sort','Also known as the bidirection bubble sort']
        ]
      }
    ]}

    const sampleResponse={
      topic:'Arrays in C',
      level:'BTech Computer Science',
      questions:[
        {
          type:'MCQ',
          question:'How do you initialize array in C?',
          options:['int arr[3] = {1,2,3};','int arr(3) = (1,2,3);','int arr[3] = (1,2,3);','int arr(3) = {1,2,3};']
        },
      {
        type:'MCQ',
        question:'How do you initialize array in C?',
        options:['int arr[3] = {1,2,3};','int arr(3) = (1,2,3);','int arr[3] = (1,2,3);','int arr(3) = {1,2,3};']
      },
      {
        type:'MCQ',
        question:'How do you initialize array in C?',
        options:['int arr[3] = {1,2,3};','int arr(3) = (1,2,3);','int arr[3] = (1,2,3);','int arr(3) = {1,2,3};']
      },
      {
        type:'MCQ',
        question:'How do you initialize array in C?',
        options:['int arr[3] = {1,2,3};','int arr(3) = (1,2,3);','int arr[3] = (1,2,3);','int arr(3) = {1,2,3};']
      },
      {
        type:'MCQ',
        question:'How do you initialize array in C?',
        options:['int arr[3] = {1,2,3};','int arr(3) = (1,2,3);','int arr[3] = (1,2,3);','int arr(3) = {1,2,3};']
      },
    ]}


    useEffect(()=>{
        if(quesType.length==3){setQuesType(['Mixed']);}
        else if(quesType.includes('Mixed') && quesType.length!=1){
            setQuesType(quesType.filter(type=>type!='Mixed'));
        }
    },[quesType]);

    useEffect(() => {
      if (modalState !== 'loading') return;
      const intervalId = setInterval(() => {
        setLoadingPercentage(prevLoadingPercentage => {
          let divisor=(prevLoadingPercentage>60)?80:40;
          return prevLoadingPercentage + ((100-prevLoadingPercentage)/divisor)});
      }, 100);
    
      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, [modalState]);

    async function generation(){
      let errors=[];
      if(queryTopic=='') {
        errors.push('InvalidTopic')
        setTopicError(true);
      }
      if(queryLevel=='') {
        errors.push('InvalidLevel')
        setLevelError(true);
      }

      if(errors.length!=0) return;

      setModalState(modalState=='loading'?'initial':'loading')
/*
      await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream:true,
        messages: [
          {
            "role": "system",
            "content": "You are quiz assistant. You generate questions on the topic given at the level given and of given type. If type is mcq, give question with 4 options. End question with appropriate marking like ~Q."
          },
          {
            "role": "user",
            "content": "\"Topic: Arrays in C\" \"Level: Computer Science Engineering 2nd Year\" \"MCQ:3\"\nThere should be one correct option and that should be on top."
          },
          {
            "role": "assistant",
            "content": "Q:How do you initialize array in C?~Q\nint arr[3] = {1,2,3};\nint arr(3) = (1,2,3);\nint arr[3] = (1,2,3);\nint arr(3) = {1,2,3};~S\nQ:In most programming languages, array indices typically start at:~Q\n0\n-1\n1\nundefined~S\nQ:What is the time complexity of accessing an element in an array by its index?~Q\nO(1)\nO(n)\nO(log n)\nO(n^2)~S"
          },
          {
            "role": "user",
            "content": `\"Topic: ${queryTopic}\" \"Level: ${queryLevel}\" \"MCQ:${quesCount}\"\nThere should be one correct option and that should be on top.`
          }
        ],
        temperature: 1,
      }).then((async response=>{

        console.log(response)
        for (const chunk of response) {
          console.log(chunk.choices[0].delta.content);
        }
        return
        
    */

      console.log('Generation Should start now!')
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages:  [{
          "role": "system",
          "content": "You are quiz assistant. You generate questions on the topic given at the level given and of given type. If type is mcq, give question with 4 options. End question with appropriate marking like ~Q. Correct option should be marked with (Correct)"
        },
        {
          "role": "user",
          "content": "\"Topic: Arrays in C\" \"Level: Computer Science Engineering 2nd Year\" \"MCQ:3\"\nThere should be one correct option and that should be on top."
        },
        {
          "role": "assistant",
          "content": "Q:How do you initialize array in C?~Q\nint arr[3] = {1,2,3};(Correct)\nint arr(3) = (1,2,3);\nint arr[3] = (1,2,3);\nint arr(3) = {1,2,3};~S\nQ:In most programming languages, array indices typically start at:~Q\n0(Correct)\n-1\n1\nundefined~S\nQ:What is the time complexity of accessing an element in an array by its index?~Q\nO(1)(Correct)\nO(n)\nO(log n)\nO(n^2)~S"
        },
        {
          "role": "user",
          "content": `\"Topic: ${queryTopic}\" \"Level: ${queryLevel}\" \"MCQ:${quesCount}\"\nThere should be one correct option and that should be on top.`
        }
      ],
        stream: true,
      });
    
      let mainResponse="";
      for await (const chunk of response) {
        console.log(chunk.choices[0].delta.content);
        mainResponse+=chunk.choices[0].delta.content;
        let chunktext=document.createElement('div')
        chunktext.innerText=chunk.choices[0].delta.content;
        chunktext.className=styles.chunkText;
        chunktext.style.left=`${Math.floor(Math.random()*((90-10+1))+1)+10}%`
        mainRef.current.appendChild(chunktext)
      }

      //console.log(response.usage.total_tokens);
        //let mainResponse=response.choices[0].message.content;
        let respParts=mainResponse.split('~S');
        let filteredResponse={
          topic:queryTopic+' for '+queryLevel,
          level:queryLevel,
          questions:[]
        };
        respParts.forEach((respPart,index)=>{
          if(index!=quesCount){
              let respQuestion=respPart.substring(respPart.indexOf('Q:')+2,respPart.indexOf('~Q'));
              let respOptions=respPart.substring(respPart.indexOf('~Q')+3).split('\n');
              console.log(respQuestion);
              console.log(respOptions);
              filteredResponse.questions.push({type:'MCQ',question:respQuestion,options:respOptions});
          }
        })
        setTimeout(()=>{
          generationComplete(filteredResponse);
          setModalState('quiz');
          },400)
      
    }


     /* setTimeout(()=>{
        setLoadingPercentage(100)
        let samp="Q:Which organ is responsible for pumping blood to the entire body?~Q\nHeart\nLungs\nBrain\nLiver~S\nQ:Which part of the body is responsible for breathing?~Q\nLungs\nHeart\nStomach\nKidneys~S\nQ:Which organ filters waste from the blood and regulates fluid balance?~Q\nKidneys\nStomach\nLiver\nHeart~S"
        let respParts=samp.split('~S');
        let filteredResponse={
          topic:queryTopic+' for '+queryLevel,
          level:queryLevel,
          questions:[]
        };
        respParts.forEach((respPart,index)=>{
          if(index!=quesCount){
              let respQuestion=respPart.substring(respPart.indexOf('Q:')+2,respPart.indexOf('~Q'));
              let respOptions=respPart.substring(respPart.indexOf('~Q')+3).split('\n');
              console.log(respQuestion);
              console.log(respOptions);
              filteredResponse.questions.push({type:'MCQ',question:respQuestion,options:respOptions});
          }
        })
        
        setTimeout(()=>{
          generationComplete(filteredResponse);
          setModalState('quiz');
        },400)
      },2000)
    }*/

    async function generationComplete(responses){
      console.log(responses);
      setModalPosition(modalsInitialPosition[quesCount-1]);
      //setQuestionModals(questions)
      setResponseQuestion(responses);
      
    }

   

    useEffect(()=>{
      if(topicError && queryTopic!=''){
        setTopicError(false);
      }
      if(levelError && queryLevel!=''){
        setLevelError(false);
      }
    },[queryTopic,queryLevel])



function changePage(direction){
  if(direction=='previous' && (currentQuestion>=2)){
    let nextPos=currentQuestion-1;
    setCurrentQuestion(nextPos);
    setModalPosition((modalPosition)+(60+quesCount*20))
    
  }
  else if(direction=='next' && (currentQuestion<quesCount)){
    let nextPos=currentQuestion+1;
    setCurrentQuestion(nextPos);
    setModalPosition((modalPosition)-(60+quesCount*20))
  }
}


  return (

    <div className={styles.main} ref={mainRef}>
    <div className={`${styles.scrollButtonsHolder} ${modalState=='quiz'?'':styles.scrollHidden}`}>
      <div className={`${styles.scrollButton} ${currentQuestion<2?styles.scrollLocked:''}`} onClick={()=>changePage('previous')}><BsArrowLeft/></div>
      <div className={styles.temporaryMarker}></div>
      <div className={`${styles.scrollButton} ${currentQuestion>=quesCount?styles.scrollLocked:''}`} onClick={()=>changePage('next')}><BsArrowRight/></div>
    </div>
    <div className={`${styles.creationModal}`+(modalState=='loading'?` ${styles.loadingState}`:(modalState=='quiz')?` ${styles.hiddenState}`:'')}>
            <div className={`${styles.inputGroup}`}>
                <div className={styles.inputText}>Test me on topic </div>
                <input className={`${styles.inputBox}`+(topicError?` ${styles.inputError}`:'')} type="text" id="topic" requiredminlength="3" maxLength="50" size="16" placeholder="Binary Search Trees" onChange={(e)=>setQueryTopic(e.target.value)}/>
              </div>    
              <div className={`${styles.inputGroup}`}>
                <div className={styles.inputText}>at the level of </div>
                <input className={`${styles.inputBox}`+(levelError?` ${styles.inputError}`:'')} type="text" id="level" requiredminlength="3" maxLength="50" size="19" placeholder="BTech 2nd Year Student" onChange={(e)=>setQueryLevel(e.target.value)}/>
              </div>        
              <div className={styles.countGroup}>
                <div className={styles.groupHeading}>QUESTION<br/>COUNT</div>
                <div className={styles.countButtonGroup}>
                  <div className={`${styles.countButton}`+(quesCount==3?` ${styles.countButtonSelected}`:'')} onClick={()=>setQuesCount(3)}>3</div>
                  <div className={`${styles.countButton}`+(quesCount==5?` ${styles.countButtonSelected}`:'')} onClick={()=>setQuesCount(5)}>5</div>
                  <div className={`${styles.countButton}`+(quesCount==10?` ${styles.countButtonSelected}`:'')} onClick={()=>setQuesCount(10)}>10</div>
                </div>
              </div>
              <div className={styles.typeGroup}>
                <div className={styles.groupHeading}>QUESTION<br/>TYPES</div>
                <div className={styles.typeButtonGroup}>
                  <div className={`${styles.typeButton}`+(quesType.includes('MCQ')?` ${styles.typeButtonSelected}`:'')} onClick={()=>!quesType.includes('MCQ')?setQuesType([...quesType,'MCQ']):{}}>MCQ</div>
                  <div className={`${styles.typeButton}`+(quesType.includes('Match Pairs')?` ${styles.typeButtonSelected}`:'')} onClick={()=>!quesType.includes('Match Pairs')?setQuesType([...quesType,'Match Pairs']):{}}>Match Pairs</div>
                  <div className={`${styles.typeButton}`+(quesType.includes('Descriptive')?` ${styles.typeButtonSelected}`:'')} onClick={()=>!quesType.includes('Descriptive')?setQuesType([...quesType,'Descriptive']):{}}>Descriptive</div>
                  <div className={`${styles.typeButton}`+(quesType.includes('Mixed')?` ${styles.typeButtonSelected}`:'')} onClick={()=>setQuesType(['Mixed'])}>Mixed</div>
                </div>
              </div>

              <div className={styles.additionOptionsButton} onClick={()=>setshowAdditional(!showAdditional)}>ADDITIONAL OPTIONS</div>
              <div className={`${styles.quesGroup}`+(!showAdditional?` ${styles.hidden}`:'')}>
                <div className={styles.groupHeading} style={{marginRight:"5px"}}>SAMPLE<br/>QUESTION</div>
                <input className={styles.inputBox} type="text" id="Squestion" requiredminlength="3" maxLength="50" size="22" placeholder="What is in-order transversal?"/>
              </div>
              <div className={`${styles.quesGroup}`+(!showAdditional?` ${styles.hidden}`:'')}>
                <div className={styles.groupHeading} style={{marginRight:"5px"}}>SAMPLE<br/>ANSWER</div>
                <input className={styles.inputBox} type="text" id="Sanswer" requiredminlength="3" maxLength="50" size="23" placeholder="Left -> Root -> Right Node"/>
              </div>
              <div className={styles.generateButton} onClick={generation}><BsStars/> Generate</div>
              <div className={styles.loadingSection}>
              <div className={styles.loadingText}>Generating Questions...</div>
              <div className={styles.progressBar}>
                <div className={styles.progressIndicator} style={{width:loadingPercentage+'%'}}></div>
              </div>
              </div>
        </div>
        <div className={styles.questionModals} style={{width:quesCount*100+'%',left:(modalPosition)+'%'}}>{
          ((!responseQuestion.questions)?<></>:(responseQuestion.questions.map((question,index)=>{
            if(question.type=='MCQ'){
              //return createMCQ(index+1,question.question,question.options,quesStatus,setQuesStatus);
              if(!quesStatus[index+1]) {
                let temp=quesStatus;
                temp[index+1]='listed';
                setQuesStatus(temp);
            }
              return (<CreateMCQ
              position={index+1} // Make sure each component has a unique key
              key={index+1}
              question={question.question}
              options={question.options}
              quesStatus={quesStatus}
              setQuesStatus={setQuesStatus}
            />)
            }
            else if(question.type=='Match Pairs'){
              //return createMCQ(index+1,question.question,question.options,quesStatus,setQuesStatus);
              if(!quesStatus[index+1]) {
                let temp=quesStatus;
                temp[index+1]='listed';
                setQuesStatus(temp);
            }
              return (<CreateMatchPairs
              position={index+1} // Make sure each component has a unique key
              key={index+1}
              pairs={question.pairs}
              quesStatus={quesStatus}
              setQuesStatus={setQuesStatus}
            />)
            }
        })))
        }</div>
        {
          (responseQuestion.questions)?
        (<div className={styles.statsSection}>
          <div className={styles.statTopic}>{responseQuestion.topic}</div>
          <div className={styles.statQuestionType}>
            {
              responseQuestion.questions.map((question,index)=><div className={styles.statType} key={index}>{question.type=='MCQ'?'Multiple Choice':question.type}</div>)
            }
          </div>
          <div className={styles.questionAttempts}>
            {
              Object.values(quesStatus).map((status,index)=><div className={styles.attemptIcon} key={index}>{statusIcon[status]}</div>)
            }
          </div>
        </div>):<></>}
    </div>
  )}