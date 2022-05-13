let myWord;
let buttons;
let tryCounter = 0;
let hasWon = false;
let attempts = [];
const wordList = 'about,above,acres,adult,after,again,agree,ahead,alike,alive,allow,alone,along,aloud,among,angle,angry,apart,apple,arrow,aside,avoid,aware,badly,basic,basis,began,begun,being,below,birds,birth,black,blank,blind,block,blood,board,bound,brain,brass,brave,bread,break,brick,brief,bring,broad,broke,brown,brush,build,built,burst,cabin,canal,carry,catch,cause,chain,chair,chart,check,chest,chief,child,chose,class,claws,clean,clear,climb,clock,close,cloth,cloud,coach,coast,color,could,count,court,cover,crack,cream,cross,crowd,curve,daily,dance,death,depth,dirty,doing,doubt,dozen,drawn,dream,dress,dried,drink,drive,drove,eager,early,earth,eaten,eight,empty,enemy,enjoy,enter,equal,event,every,exact,exist,extra,fence,fewer,field,fifth,fifty,fight,final,first,flame,flies,floor,folks,force,forth,forty,found,frame,fresh,front,fruit,fully,funny,giant,given,glass,globe,goose,grade,grain,graph,grass,great,green,group,grown,guard,guess,guide,habit,happy,heard,heart,heavy,hello,honor,horse,house,human,hurry,image,judge,knife,known,label,labor,large,later,laugh,learn,least,leave,level,light,local,loose,lower,lucky,lunch,lungs,lying,magic,major,maybe,means,meant,metal,might,model,money,month,motor,mouse,mouth,movie,music,nails,needs,never,night,noise,north,noted,occur,ocean,offer,older,orbit,order,other,ought,outer,owner,paint,paper,parts,party,peace,piano,piece,pilot,pitch,place,plain,plane,plant,plate,point,porch,pound,power,press,price,pride,prize,proud,prove,pupil,queen,quick,quiet,quite,radio,raise,ranch,range,reach,ready,refer,rhyme,right,river,rocky,rough,round,route,ruler,saved,scale,scene,score,seems,sense,serve,seven,shade,shake,shall,shape,share,sharp,sheep,sheet,shelf,shine,shirt,shoot,shore,short,shout,shown,sides,sight,silly,since,skill,slabs,slave,sleep,slept,slide,slope,small,smell,smile,smoke,snake,solar,solid,solve,sound,south,space,speak,speed,spell,spend,spent,spite,split,sport,stage,stand,start,state,steam,steel,steep,stems,stick,stiff,still,stock,stone,stood,store,storm,story,stove,straw,strip,stuck,sugar,sweet,swept,swing,swung,table,taken,tales,taste,teach,tears,teeth,thank,there,these,thick,thing,think,third,those,three,threw,throw,thumb,tight,tired,title,today,topic,total,touch,tower,trace,track,trade,trail,train,tribe,trick,tried,truck,trunk,truth,twice,uncle,under,union,until,upper,using,usual,value,vapor,visit,voice,vowel,wagon,waste,watch,water,weigh,whale,wheat,wheel,where,which,while,white,whole,whose,women,world,worry,worse,worth,would,write,wrong,wrote,young,youth,zebra'.split(',');


const myFunction = async () => {
    myWord = wordList[Math.floor(Math.random() * wordList.length)];
    buttons = [1, 2, 3, 4, 5].map((i) => document.getElementById("word" + i));
    for (let i = 0; i < buttons.length; i++) {
        if (i != buttons.length - 1) {
            buttons[i].addEventListener("keypress", (e) => {
                if (e.code == "Enter") return;
                setTimeout(() => {
                    buttons[i + 1].focus();
                }, 10);
            })
        }
        if (i != 0) {
            buttons[i].addEventListener("keydown", (e) => {
                if (e.code !== "Backspace") return;
                setTimeout(() => {
                    buttons[i - 1].focus();
                }, 10);
            })
        }
    }

}

document.addEventListener('DOMContentLoaded', () => myFunction());

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const map = {
    "green": "🟩",
    "red": "🟥",
    "yellow": "🟨",
}

const copyAttempts = () => {
    const blockAttempt = attempts.map((attempt) => (attempt.map((word) => map[word])).join('')).join('\n');
    navigator.clipboard.writeText(`${tryCounter == 5 ? -1 : tryCounter}/5\n` + blockAttempt);
    alert('Copied to clipboard');
}

const checkWord = async () => {

    if (tryCounter == 5) {
        alert("You lost!");
        return;
    }
    if (hasWon) {
        alert("You won!");
        return;
    }

    const word = buttons.map((button) => button.value).join('');
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await fetch(url);
    if (response.status == 404) {
        alert("INVALID WORD");
        return;
    }
    if (word.length !== 5) {
        alert("INVALID!");
        return;
    }
    tryCounter++;
    const checkDom = document.getElementById("checks");
    checkDom.innerHTML += `<div class="check" id = "try${tryCounter}"></div>`;
    const tryDom = document.getElementById(`try${tryCounter}`);
    let attempt = [];
    for (let i = 0; i < word.length; i++) {
        const indexes = [...myWord.matchAll(word[i])];
        if (indexes.length) {
            if (indexes.find((index => index.index == i))) {
                attempt.push("green");
                tryDom.innerHTML += `<span id = "green">${word[i]}</span>`;
            }
            else {
                attempt.push("yellow");
                tryDom.innerHTML += `<span id = "yellow">${word[i]}</span>`;
            }
        }
        else {
            attempt.push("red");
            tryDom.innerHTML += `<span id = "red">${word[i]}</span>`;
        }
        await sleep(300);
    }
    attempts.push(attempt);
    buttons[0].focus();
    if (tryCounter === 5) {
        alert("You lose! The word was " + myWord);
        document.getElementById("copybutton").disabled = false;
        document.getElementById("submitbutton").disabled = true;
        return;
    }
    if (word == myWord) {
        alert("YOU WIN");
        document.getElementById("copybutton").disabled = false;
        document.getElementById("submitbutton").disabled = true;
        hasWon = true;
        return;
    }
}

document.addEventListener("keydown", async (e) => {
    if (e.code === "Enter") {
        await checkWord();
        buttons.forEach(button => {
            button.value = '';
        });
    }
})