const Discord = require('discord.js');
const NanaAPI = require("nana-api");
const nana = new NanaAPI();
var mysql = require('mysql'); 
const fs = require('fs');
var http = require('http');
const fetch = require("node-fetch");
var cheerio = require('cheerio');
const cloudflareScraper = require('cloudflare-scraper');
const hypixel=process.env.hypixel;
var con = mysql.createConnection({
  host: process.env.mysqlhost,
  user: process.env.mysqluser,
  password: process.env.mysqlpw,
  database: process.env.mysqldb
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
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

var poruke=["Go to horny jail","bonk","kys","sta to radis krompiru","ono tvoje","<:bonk:741385199685992500>","tuzna si","baka"];
var bonks=["https://media1.tenor.com/images/c409b7031d3768c24db8bc0cbb1a2cb5/tenor.gif","https://media1.tenor.com/images/347f852d3dfa48502406fa949fcc1449/tenor.gif","https://media1.tenor.com/images/2bee3954016b407ddaa255e2ca6dc529/tenor.gif"];
var voice=[];

function getId(playername) {
  
  return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
    .then(data => data.json())
    .then(player => player.id)
    .catch(function(){
      return "069a79f444e94726a5befca90e38aaf5";
    });

}

async function bwstats(name,channel){
  const id=await getId(name);
  const response=await fetch(`https://api.hypixel.net/player?key=${hypixel}&uuid=${id}`)
  .then(data => data.json());
  try{
    const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Bedwars Stats for '+name)
    .setURL(`https://plancke.io/hypixel/player/stats/${name}#BedWars`)
    .setThumbnail(`https://minotar.net/avatar/${name}.png`)
    .addFields(
      { name: 'Winstreak', value: response.player.stats.Bedwars.winstreak, inline: true },
      { name: 'Diamonds Collected', value: response.player.stats.Bedwars.diamond_resources_collected_bedwars, inline: true },
      { name: 'Emeralds Collected', value: response.player.stats.Bedwars.emerald_resources_collected_bedwars, inline: true },
      { name: '\u200B', value: '\u200B' },
      { name: 'Doubles Kills', value: response.player.stats.Bedwars.eight_two_kills_bedwars, inline: true },
      { name: 'Doubles Deaths', value: response.player.stats.Bedwars.eight_two_deaths_bedwars, inline: true },
      { name: 'Doubles Wins', value: response.player.stats.Bedwars.eight_two_wins_bedwars, inline: true },
      { name: '\u200B', value: '\u200B' },
      { name: 'Overall Kills', value: response.player.stats.Bedwars.kills_bedwars, inline: true },
      { name: 'Overall Deaths', value: response.player.stats.Bedwars.deaths_bedwars, inline: true },
      { name: 'Overall Wins', value: response.player.stats.Bedwars.wins_bedwars, inline: true }
    )
    .setTimestamp()
    .setFooter('Vanilla', 'https://cdn.discordapp.com/avatars/746781735643250829/d02b27cf6c394ec5003f673ec346d877.png?size=4096');
    channel.send(exampleEmbed);
  }catch(error){
    channel.send("jeiga");
  }
}
function ScrapeMangaGo(url) {
  return new Promise((resolve, reject) => {
    const http = require('http'),
      https = require('https');

    let client = http;

    if (url.toString().indexOf("https") === 0) {
      client = https;
    }
	      var loc=new URL(url);
    console.log(loc.hostname);
    console.log(loc.pathname+loc.search);
    const options={
      hostname: loc.hostname,
      path:loc.pathname+loc.search,
       headers: {
    'User-Agent': 'Request-Promise'
  }
    }

    client.get(options, (resp) => {
     console.log('STATUS: ' + resp.statusCode);// nothing here executes
            console.log('HEADERS: ' + JSON.stringify(resp.headers));
      let chunks = [];

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        chunks.push(chunk);
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

    }).on("error", (err) => {
      reject(err);
    });
  });
}
function DodajMuGa(){

  voice.forEach(element => {
    addXp(element);
  });
 
}
setInterval(DodajMuGa,60*1000);
function prodjiJednog(obj,i){
  setTimeout(function(i){
    (async(url) => {
           
       var buf = await ScrapeMangaGo(url);
	    
       
       $= cheerio.load(buf.toString('utf-8'));
      chapters=$('#chapter_tab').eq(0).text().trim().replace("Chapters(",'').replace(")",'');
      name=$('h1').eq(0).text().trim();
      latestchap=$("#chapter_table").find("h4").find("a").attr("href");
      if(obj.chapters!=chapters)
      {
        console.log("izasao novi chap za: "+obj.name);
       // console.log(link.DiscordId);
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Izasao je novi chapter za '+obj.name)
        .setURL(obj.manga)
        .addField("Chapter "+chapters,"[link]"+"("+obj.latestchap+")")
        .setTimestamp()
        .setFooter('Vanilla', 'https://cdn.discordapp.com/avatars/746781735643250829/d02b27cf6c394ec5003f673ec346d877.png?size=4096');
        
        client.users.fetch(obj.DiscordId).then(user => user.send(exampleEmbed)).catch(console.error);
        console.log("Obavestenje poslato");
        var sql = "UPDATE mangago SET chapters = '"+chapters+"' WHERE name="+mysql.escape(name)+";";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("chapters updated");
         // console.log(chapters);
        });

      }else{
       // console.log("nema novog chap");
      }
     })(obj.manga);

},i*5000);
  
}
function ProdjiSve(result){
  var i=1;
  result.forEach(link=> {
    prodjiJednog(link,i++);

  });
 
  //console.log(i);
  setTimeout(ponovi,i*5000);
}
function ponovi(){
  console.log("[manga]: ponovi");
  var sql = "SELECT * FROM mangago";
  con.query(sql, function (err, result,fields) {
    if (err) throw err;
    if(!result[0]){
    console.log("[manga]: prazno");
    setTimeout(ponovi,10000);
    }
    else{
      ProdjiSve(result);
  }
    
  });

}
setTimeout(ponovi,10000);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`nhentai.net`,{type: "WATCHING"});
  
});

client.on('voiceStateUpdate', (oldState, newState) => {
	if(!newState.member.user.bot){
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
  voice.remove(newState.id);

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
	}
});

client.on('message', msg => {
	  //reacts to messages
  if(msg.author.bot) return;
 
  if(msg.content.includes("kingu") || msg.content.includes("<:pwease:750099877899272273>"))
  {
    var chance =Math.random()*100;
    console.log(chance);
    if(chance<30){
    const channel = msg.member.voice.channel;
      if (!channel) return console.error("Nisi u voice!");
      channel.join().then(connection => {
        // Yay, it worked!
        console.log("Successfully connected.");
	       msg.react('754801062409666620');
        const dispatcher= connection.play('https://raw.githubusercontent.com/igorkandic/nhentai/master/combobreak.mp3');
        dispatcher.on("finish", () => {channel.leave();});
        
        
      }).catch(e => {
        // Oh no, it errored! Let's log it to console :)
        console.error(e);
      });
    }
  }
	
	  if(!msg.content.startsWith(prefix) &&(msg.content.includes("seno") || msg.content.includes("se~no") || msg.content.includes("se no") ))
  {
    var chance =Math.random()*100;
    console.log(chance);
    if(chance<30){
    const channel = msg.member.voice.channel;
      if (!channel) return console.error("Nisi u voice!");
      channel.join().then(connection => {
        // Yay, it worked!
        console.log("Successfully connected.");
	      msg.react('754801820181987408');
        const dispatcher= connection.play('https://raw.githubusercontent.com/igorkandic/nhentai/master/seno.mp3');
        dispatcher.on("finish", () => {channel.leave();});
        
        
      }).catch(e => {
        // Oh no, it errored! Let's log it to console :)
        console.error(e);
      });
    }
  }
	
	
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args=msg.content.slice(prefix.length).trim().split(' ');
    const command=args.shift().toLowerCase();
	if(command=="test"){
	msg.channel.send(voice);
		
	}
	  if(command=="notify"){
      const discID=msg.author.id;
      if(args.length==1){
        var url=args[0];
        
        if(url.includes("mangago.me/read-manga/"))
        {
          
          url=url.replace("www.",'');
          (async(url) => {
                  
             var buf =  await ScrapeMangaGo(url);

           
            $= cheerio.load(buf.toString('utf-8'));
           chapters=$('#chapter_tab').eq(0).text().trim().replace("Chapters(",'').replace(")",'');
           name=$('h1').eq(0).text().trim();
           latestchap=$("#chapter_table").find("h4").find("a").attr("href");
           var sql = "INSERT INTO mangago (DiscordId, manga,chapters,latestchap,name) VALUES ('"+discID+"', '"+url+"','"+chapters+"','"+latestchap+"',"+mysql.escape(name)+")";
           
           con.query(sql, function (err, result) {
            if (err) 
            {msg.channel.send("Duplikat");
            console.log(err);
          }
            else
           msg.channel.send("Dodato");
          });
          })(url);
        

      }
        else
        msg.channel.send("Link nije dobar");
      
      }
      if(args.length==2){
        var url=args[0];
	      url=url.replace("www.",'');
        if(args[1]=="remove"){
          
          var sql="DELETE FROM mangago WHERE manga='"+url+"' AND DiscordId="+mysql.escape(discID);
          con.query(sql, function (err, result) {
            if (err) throw err;
            msg.channel.send("Obrisano");
          });
        
        }
      }
    }
    if(command=="list"){
      var sql = "SELECT * FROM mangago where DiscordId="+mysql.escape(msg.author.id);
      con.query(sql, function (err, result,fields) {
        if (err) throw err;
        if(!result[0])
        msg.channel.send("Prazno.");
        else{
          var list = new Discord.MessageEmbed()
          .setColor('#0099ff');
          
          
       
        result.forEach(link=> {
          list.addField(link.name," ["+link.name+"]("+link.manga+")");
        });
          msg.channel.send(list);
      }
        
      });
    }
	//povezi mc sa dc
    if(command=="mc"){
      if(args.length==1){
      var discID=msg.author.id;
      var mcName=args[0];
      var sql = "UPDATE users SET minecraft='"+mcName+"' WHERE DiscordID="+discID;
        con.query(sql, function (err, result) {
          if (err) throw err;
         msg.channel.send("Minecraft username set to: "+mcName);
        });
      }
      else{
        msg.channel.send("ukucaj minecraft ime");
      }

    }
    if(command=="bedwars"){
      //vuce iz baze
      if(args.length==0)
      {
        con.query("SELECT minecraft FROM users WHERE DiscordId= "+mysql.escape(msg.author.id), function (err, result, fields) {
          if (err) throw err;
          if(result[0].minecraft==""){
        msg.channel.send("Povezi mc sa komandom !mc IME");
          }
          else{
            //kod za stats
          //  msg.channel.send("stats of "+result[0].minecraft);
          bwstats(result[0].minecraft,msg.channel);
          }
        });

      }
      //proverava za nekoga
      if(args.length==1)
      {
        //moze biti direkt mc ime
        //moze biti tag
        var user=args[0];
        try{
          user=getUserFromMention(args[0]);
        }catch(e){
          console.log(e);
        }finally{
        }
        if(user instanceof Discord.User){
        var sql = "SELECT minecraft FROM users where DiscordId="+mysql.escape(user.id);
        con.query(sql, function (err, result,fields) {
          if (err) throw err;
          if(result[0].minecraft=="")
          msg.channel.send(user.username+` nema postavljen mc`);
          else
            //kod za stats
          //  msg.channel.send("stats of "+result[0].minecraft);
           bwstats(result[0].minecraft,msg.channel);
        });
      }else{
        //kod za stats
        // msg.channel.send("stats of "+args[0]);
        bwstats(args[0],msg.channel);
      }

      }

    }
	if(command=="baka"){
	    const channel = msg.member.voice.channel;
      if (!channel) return console.error("Nisi u voice!");
      channel.join().then(connection => {
        // Yay, it worked!
        //console.log("Successfully connected.");
        const dispatcher= connection.play('https://raw.githubusercontent.com/igorkandic/nhentai/master/combobreak.mp3');
        dispatcher.on("finish", () => {channel.leave();});
        
        
      }).catch(e => {
        // Oh no, it errored! Let's log it to console :)
        console.error(e);
      });
	}
	    if(command=="seno"){
      const channel = msg.member.voice.channel;
      if (!channel) return msg.channel.send("Demo sonnan ja dame Mou sonnan ja hora");
      channel.join().then(connection => {
        // Yay, it worked!
        console.log("Successfully connected.");
        const dispatcher= connection.play('https://raw.githubusercontent.com/igorkandic/nhentai/master/seno.mp3');
        dispatcher.on("finish", () => {channel.leave();});
        
        
      }).catch(e => {
        // Oh no, it errored! Let's log it to console :)
        console.error(e);
      });
    }
	    if(command=="day"){
      if(!args.length){
        var sql = "CALL GetTodayXP(?)";
        con.query(sql,msg.author.id, function (err, result,fields) {
          if (err) throw err;
          if(!result[0][0])
          msg.channel.send(`${msg.author.username} danas nisi bila u voice`);
          else
          msg.channel.send(`${msg.author.username} danas `+result[0][0].vreme+` XP`);
          
        });

      }
      else
      {
                var user=args[0];
        try{
          user=getUserFromMention(args[0]);
        }catch(e){
          console.log(e);
        }finally{
        }
        if(user instanceof Discord.User){
        var sql = "CALL GetTodayXP(?)";
        con.query(sql,user.id, function (err, result,fields) {
          if (err) throw err;
          if(!result[0][0])
          msg.channel.send(`${user.username} danas nije bio u voice`);
          else
            msg.channel.send(`${user.username} danas `+result[0][0].vreme+` XP`);
        });
      }else{
        msg.channel.send("Pogresno ime");
      }
      }
      
    }
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
