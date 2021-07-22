const publicIdGenerator = name => {
    return new Promise((resolve, reject)=>{
        let time = Date.now(),
            nameList = name.split(''),
            character = nameList[(Math.floor(Math.random()*nameList.length))];    //select random character in username  
        character = character.toUpperCase();
        resolve(time.toString()+character);
    });
};

module.exports = publicIdGenerator;