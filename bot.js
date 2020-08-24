const Discord = require('discord.js');
const NanaAPI = require("nana-api");
const nana = new NanaAPI();
var mysql = require('mysql'); 
var con = mysql.createConnection({
  host: process.env.mysqlhost,
  user: process.env.mysqluser,
  password: process.env.mysqlpw,
  database: process.env.mysqldb
});

const client = new Discord.Client();
const {prefix,token}=require('./config.json');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

function addXp(id){

  var sql = "UPDATE users SET vreme=vreme+1 WHERE DiscordId="+mysql.escape(id);
  con.query(sql, function (err, result) {
    if (err) throw err;
    //console.log("dodat 1 xp");
  });
}

var poruke=["Go to horny jail","bonk","kys","sta to radis krompiru","ono tvoje","<:bonk:746893067155669092>","tuzna si","baka"];
var bonks=["https://media1.tenor.com/images/c409b7031d3768c24db8bc0cbb1a2cb5/tenor.gif","https://media1.tenor.com/images/347f852d3dfa48502406fa949fcc1449/tenor.gif","https://media1.tenor.com/images/2bee3954016b407ddaa255e2ca6dc529/tenor.gif"];
var voice=[];

function DodajMuGa(){

  voice.forEach(element => {
    addXp(element);
  });
 
}
setInterval(DodajMuGa,60*1000);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`nhentai.net`,{type: "WATCHING"});
  
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if(newState.channel!=null){
  //console.log("usao "+newState.id);

 
    con.query("SELECT count(*) as total FROM users WHERE DiscordId= "+mysql.escape(newState.id), function (err, result, fields) {
      if (err) throw err;
      if(result[0].total){
    //  console.log("Korisnik je vec u bazi");
      }
      else{

        var sql = "INSERT INTO users (DiscordId, vreme) VALUES ('"+newState.id+"', '0')";
        con.query(sql, function (err, result) {
          if (err) throw err;
         // console.log("Korisnik dodat u bazu");
        });
      }
    });

    // var role=newState.guild.roles.cache.find(role=> role.name==="voice");
    // newState.member.roles.add(role);
    voice.push(newState.id);
  }else{
    Array.prototype.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
          what = a[--L];
          while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1);
          }
      }
      return this;
  };

    // console.log("izasao "+oldState.id);
    // var role=oldState.guild.roles.cache.find(role=> role.name==="voice");
    // oldState.member.roles.remove(role);
   voice.remove(newState.id);
  }
});

client.on('message', msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args=msg.content.slice(prefix.length).trim().split(' ');
    const command=args.shift().toLowerCase();
    if(command=="xp"){
      if(!args.length){
        var sql = "SELECT * FROM users where DiscordId="+mysql.escape(msg.author.id);
        con.query(sql, function (err, result,fields) {
          if (err) throw err;
          if(!result[0])
          msg.channel.send(`${msg.author.username} ne postoji u bazi`);
          else
          msg.channel.send(`${msg.author.username} imas `+result[0].vreme+` XP`);
          
        });

      }else{
        var user=args[0];
        try{
          user=getUserFromMention(args[0]);
        }catch(e){
          console.log(e);
        }finally{
        }
        if(user instanceof Discord.User){
        var sql = "SELECT * FROM users where DiscordId="+mysql.escape(user.id);
        con.query(sql, function (err, result,fields) {
          if (err) throw err;
          if(!result[0])
          msg.channel.send(`${user.username} ne postoji u bazi`);
          else
            msg.channel.send(`${user.username} ima `+result[0].vreme+` XP`);
        });
      }else{
        msg.channel.send("Pogresno ime");
      }

      }
    }
  if(command=="bonk"){
    if(!args.length){
      msg.reply("ukucaj koga hoces da bonkujes");
    }else{
      const img=bonks[Math.floor(Math.random() * bonks.length)]
      var user=args[0];
      try{
        user=getUserFromMention(args[0]);
      }catch(e){
        console.log(e);
      }finally{
      }
      var exampleEmbed = {
        title: `${msg.author.username} bonked ${args[0]}`,
        image: {
          url: img,
        },
      };
     if(user instanceof Discord.User){
      exampleEmbed = {
        title: `${msg.author.username} bonked ${user.username}`,
        image: {
          url: img,
        },
      };
     }



      msg.channel.send({ embed: exampleEmbed });
    }
  }
  if(command=="horny"){
    var chance =Math.random()*100;
    if(chance<10){

      msg.channel.send(poruke[Math.floor(Math.random() * poruke.length)]);
    }else{
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
      msg.channel.send(`ako hoces vise tagova stavi + izmedju (stockings+rape), ako ima razmake koristi _ (big_breasts)`);
    }    
  }
}


});

client.login(process.env.BOT_TOKEN);
