

// const classes = ["class-a","class-b","class-c","class-d","class-e"];
// const hrs = ['hr1','hr2','hr3','hr4','hr5'];


  
// //filtering teachers based on handlingClasses to be implemented later
// const teacherSubjects = [
//   { teacherId: 1, subject: "Math", handlingClasses: ["class-a", "class-b"] },
//   { teacherId: 2, subject: "Science", handlingClasses: ["class-c"] },
//   { teacherId: 3, subject: "English", handlingClasses: ["class-d", "class-e"] },
//   { teacherId: 4, subject: "History", handlingClasses: ["class-a"] },
//   { teacherId: 5, subject: "Geography", handlingClasses: ["class-b", "class-c", "class-d"] },
//   { teacherId: 6, subject: "Art", handlingClasses: ["class-e"] },
// ];

// const timeTableCollection = [];

// function generateRandomGibberish() {
//   const letters = 'abcdefghijklmnopqrstuvwxyz';
//   let gibberish = '';

//   for (let i = 0; i < 5; i++) {
//     const randomIndex = Math.floor(Math.random() * letters.length);
//     const randomLetter = letters[randomIndex];
//     gibberish += randomLetter;
//   }

//   return gibberish;
// }
// let workingDays = ['monday','tuesday','wednesday','thursday','friday'];
// let numClasses = classes.length;
// let hoursPerDay = hrs.length;
// function autoGenerateTimeTable() {
//   for(let w = 0;w < workingDays.length;w++){//for every working days 
//     for(let j =0;j<hoursPerDay;j++){// for every hour
//         let tmpTeachers = [...teacherSubjects];// get available teachers 
//         for(let k=0;k<numClasses;k++){
//             let rIndex = Math.floor(Math.random() * tmpTeachers.length);

//             let rand = tmpTeachers[rIndex];// instead of assigning randomly choose one from available teachers 
//             const timetableObj = {
//               "day":workingDays[w],
//               "className":classes[k],
//               "hr":j+1,
//               "subject":rand.subject,
//               "meet-id":generateRandomGibberish(),
//               "handledBy":rand.teacherId

//             }//create the object
//             timeTableCollection.push(timetableObj);//add to database
//             tmpTeachers.splice(rIndex,1);// available teachers changes
//             // console.log(tmpTeachers);
            
            
//         }
//     } 
//   }
//   }
  


 

  

  // const filteredTimetable = timeTableCollection.filter(timetable => timetable.day === "monday");
  // // console.log(timeTableCollection);


  // console.log(filteredTimetable);



//   const getTimeTableClass = (className) => {
//     const timeTableOfClass = [...timeTableCollection.filter(entry => entry.className === className)];
//     console.log("Time Table for " , className);
//     console.log(timeTableOfClass);
//   }

// // getTimeTableClass('class-b');


// const getTimeTableTeacher = (teacherId) => {
//   const teacherTimeTable = timeTableCollection.filter(ele => ele.handledBy == teacherId);
//   console.log("Time table for teacher with Teacher ID : ",teacherId);
//   console.log(teacherTimeTable);
// }

// getTimeTableTeacher(2);

const formatHour = (hr) =>{
  if(hr.includes('pm')){
    var i = hr.indexOf('pm');
    var v = hr.slice(0,i);
    if(v == 12) return v;
    return (12 + parseInt(v));
  }else{
    var i = hr.indexOf('am');
    var v = hr.slice(0,i);
    if(v == 12) return parseInt(v)-12;
    return v;
  }
  

}

function isTimeRangeCurrent(timeRange) {
  const currentTime = new Date();
  const currHour = currentTime.getHours();

  const timeParts = timeRange.split('-');
  var startHour = timeParts[0];
  var endHour = timeParts[1];
  
  if(currHour >= formatHour(startHour) && currHour < formatHour(endHour) ){
    return true;
  }
  return false;
  


}
const timeRange = '1pm-2pm';

console.log(isTimeRangeCurrent(timeRange));





