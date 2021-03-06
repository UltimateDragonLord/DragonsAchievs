{
	/*
	let Game = {
		crate: () => { },
		crateTooltip: () => { },
		Achievement: class { construction() { Game.Achievements.push({ "order": 0 }) } },
		hasAchievement: () => { },
		Win: class { },
		last: {},
		Achievements: []
	}*/

	let Achievement = function Achievement(name, desc, icon) {
		let answer = new Game.Achievement(name, desc, icon);

		answer.dragon = 1;

		return answer;
	}

	let Win = function Win(what) {
		Game.Win(what);
		if (typeof Game.Achievements[what] !== "undefined" && Game.Achievements[what].dragon == 1) {
			DragonSave.Achievements[what] = 1;
			DragonAchievSaveConfig();
		}
	}
	
	eval("Game.crate =" + Game.crate.toString().split("shadow';").join(" shadow';\nif (me.darky == 1) classes+=' darky'; //Dragon's achievements injection").split("mysterious?").join("mysterious? (me.dragon == 1) ? 'background-image:url(\\\'https://i.imgur.com/JKKvixm.png\\\')'/*Dragon's achievements injection*/ : "));

	eval("Game.crateTooltip = " + Game.crateTooltip.toString().split("if (mysterious) icon=[0,7];").join("if (mysterious) icon=[0,7]; if (mysterious && me.dragon == 1) icon = [0, 0, 'https://i.imgur.com/JKKvixm.png']"));

	if (typeof Dragon === 'undefined') {
		let style = document.createElement("style");
		style.type = "text/css";
		style.textContent = ".dragon:before{background:url(https://i.imgur.com/q8nNdkI.png);background-position:120px 0px;}";
		document.head.appendChild(style);
	}

	//-------------------------------------------------------------------
	
	function changeAchievementIcon(me,iconURL,pos) {
	pos = typeof pos !== 'undefined' ? pos : [0,0];
	pos.push(iconURL);
	me.icon=pos;
	Game.RebuildUpgrades()
	}
	
	//-------------------------------------------------------------------

	if(!Game.customCrate) Game.customCrate = []
	Game.customCrate = Game.customCrate.concat([

		// ~ ~ ~ BUILDINGS ~ ~ ~ 

		new Achievement("Build up", "Own <b>4000</b> buildings.", [1, 0, "https://i.imgur.com/GGrHHrA.png"], 1),
		new Achievement("You built the guilt", "Own <b>8000</b> buildings.", [5, 0, "https://i.imgur.com/RWbOLsf.png"], 1),

		// ~ ~ ~ UPGRADES ~ ~ ~ 

		new Achievement("Purchaser of Upgrades", "Purchase <b>300</b> upgrades.", [0, 1, "https://i.imgur.com/GGrHHrA.png"], 1),
		new Achievement("Grade up", "Purchase <b>400</b> upgrades.", [1, 1, "https://i.imgur.com/GGrHHrA.png"], 1),

		// ~ ~ ~ SHADOW ~ ~ ~ 

		new Achievement("Demigod complex", "Name yourself <b>Dragon</b>.<q>Have you made this mod?.</q>", [2, 12], 1), Game.last.pool = "shadow",
	])

	//-------------------------------------------------------------------

	let Achievements = {}
	Game.AchievementsById.forEach(achievement => {
		Achievements[achievement.name] = achievement
	})

	Achievements["Build up"].order = 5011
	Achievements["You built the guilt"].order = 5015

	Achievements["Purchaser of Upgrades"].order = 6001
	Achievements["Grade up"].order = 6002

	Achievements["Demigod complex"].order = 30202

	Object.values(Achievements).forEach(achievement => {
		Game.AchievementsById[achievement.id] = achievement
	})

	//-------------------------------------------------------------------

	if (typeof Dragon === 'undefined') {
		Dragon = {};
	}
	Dragon.prestigeUpgradesOwned = 0;
	let getTotalBuildings = () => {
		let amount = 0
		Game.ObjectsById.forEach(object => { amount += object.amount })
		return amount
	}

	let getMinimalBuildingAmount = () => {
		let minimalAmount = Infinity
		Game.ObjectsById.forEach(object => { minimalAmount = Math.min(minimalAmount, object.amount) })
		return minimalAmount
	}

	//-------------------------------------------------------------------

	Game.registerHook('check',[
		function () { var count = 0; for (var i in Game.UpgradesById) { var me = Game.UpgradesById[i]; if (me.bought && me.pool == "prestige") count++; } Darky.prestigeUpgradesOwned = count; },

		function () { if (getTotalBuildings() >= 4000) Win("Build up") },
		function () { if (getTotalBuildings() >= 8000) Win("You built the guilt") },
		
		function () { if (Game.UpgradesOwned >= 300) Win("Purchaser of Upgrades") },
		function () { if (Game.UpgradesOwned >= 400) Win("Grade up") },	

		function () { if (name == "Dragon") Win("Demigod complex") },
	])

	//-------------------------------------------------------------------

	DragonSavePrefix = "DragonPackage";

	DragonAchievSaveConfig = function () {
		localStorage.setItem(DragonSavePrefix, JSON.stringify(DragonSave));
	}

	DragonAchievSaveDefault = function () {
		if (typeof DragonSave === 'undefined') {
			DragonSave = {};
		}
		
		DragonSave.Achievements = {};
		for (var i in Game.Achievements) {
			var me = Game.Achievements[i];
			if (me.dragon == 1) {
				DragonSave.Achievements[me.name] = 0;
			}
		}
		DragonAchievSaveConfig();
	}

	DragonAchievLoadConfig = function () {
		if (localStorage.getItem(DragonSavePrefix) != null) {
			DragonSave = JSON.parse(localStorage.getItem(DragonSavePrefix));
			if (typeof DragonSave.Achievements === 'undefined') {
				DragonSave.Achievements = {};
			}
			for (var i in Game.Achievements) {
				var me = Game.Achievements[i];
				if (me.darky == 1) {
					if (typeof DragonSave.Achievements[me.name] === "undefined") {
						DragonSave.Achievements[me.name] = 0;
						DragonAchievSaveConfig();
					}
					else if (DragonSave.Achievements[me.name] == 1) {
						Win(me.name);
					}
				}
			}
		}
		else {
			DragonAchievSaveDefault();
		}
	}

	let oldReset = Game.HardReset
	Game.HardReset = new Proxy(oldReset, {
		apply: function (func, thisArg, args) {
			if (args[0] == 2) {
				DragonAchievSaveDefault();
			}
			return func.apply(thisArg, args);
		}
	})

	DragonAchievLoadConfig();
	
	DragonAchievMigrateOldSave = function () {	
		for (var i in Game.Achievements) {
			var me = Game.Achievements[i];
			if (me.dragon == 1) {
				if (typeof DragonSave[me.name] !== "undefined") {
					DragonSave.Achievements[me.name] = DragonSave[me.name];
					if (DragonSave[me.name]) {
						Win(me.name);
					}
					delete DragonSave[me.name];
				}
			}
		}
		DragonAchievSaveConfig();
	}
	DragonAchievMigrateOldSave();

	//-------------------------------------------------------------------

	Game.Win("Third-party")
	Game.Notify("Dragon's Achievements Alpha", " <b>5</b> new Achievements have been added, enjoy and thank you for using my mod!", [17, 26, "https://i.imgur.com/3jNJJNw.png"]);
	PlaySound("https://freesound.org/data/previews/203/203121_777645-lq.mp3");
}
