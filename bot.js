const Discord = require('discord.js');
const NanaAPI = require("nana-api");
const nana = new NanaAPI();

const client = new Discord.Client();
const {prefix,token}=require('./config.json');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`nhentai.net`,{type: "WATCHING"});
  
});

client.on('message', msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args=msg.content.slice(prefix.length).trim().split(' ');
    const command=args.shift().toLowerCase();
  if(command=="horny"){
      if(!args.length){

              nana.search("english").then((g) =>{
         
        var pages=Math.ceil(g.num_results/25);

        nana.search("english",getRandomInt(0,pages)).then((n) =>{
          msg.channel.send(`https://nhentai.net/g/${n.results[getRandomInt(0,25)].id}/`);
        });

       });
          
       
        
      
      } else if(args.length==1){
      var tag=args[0].replace("_"," ");
            nana.search("english+"+tag).then((g) =>{

        var pages=Math.ceil(g.num_results/25);
        

        nana.search("english+"+tag,getRandomInt(0,pages)).then((n) =>{
          
          msg.channel.send(`https://nhentai.net/g/${n.results[getRandomInt(0,25)].id}/`);
        });
        
      });
    }
    else{
      msg.channel.send(`ako hoces vise tagova stavi + izmedju (stockings+yaoi), ako ima razmake koristi _ (big_breasts)`);
    }    
  }


});

client.login(process.env.BOT_TOKEN);
