function D6(){
	var that = new Cube({
		size:45, faceClass:'red',
		addContentToFace:function(face, index){face.innerHTML += drawDots(index,'red');}
	});
	
	that.landingOrientation = function (score){
		var spin = [0,0,0];	
		var wobble = Math.floor(Math.random()*40) - 20;
		
		switch(score) {
		case 1:	spin = [0,0,wobble];break;
		case 2:	spin = [90,270+wobble,90];break;
		case 3:	spin = [270,wobble,0];break;
		case 4:	spin = [90,wobble,0];break;
		case 5:	spin = [0,90+wobble,0];break;
		case 6:	spin = [0,180,wobble];break;				
		};
		return spin;
	};
	
	return that;
	
	function drawDots(amount,color){				
		var dotPatterns = [
		[{x:50,y:50}],
		[{x:20,y:80},{x:80,y:20}],
		[{x:15,y:15},{x:50,y:50},{x:85,y:85}],
		[{x:20,y:20},{x:20,y:80},{x:80,y:20},{x:80, y:80}],
		[{x:20,y:20},{x:20,y:80},{x:80,y:20},{x:80, y:80},{x:50,y:50}],
		[{x:20,y:15},{x:20,y:50},{x:20,y:85},{x:80, y:15},{x:80,y:50},{x:80,y:85}],
		];
		var pattern = dotPatterns[amount]
		var string = '';
		string += '<svg height="100%" width="100%" style="position:absolute;top:0px;left:0px">'
		for (var i = 0; i < pattern.length; i++){
			string += '<circle cx="'+ pattern[i].x +'%" cy="' + pattern[i].y +'%" r="8%" stroke="' + color + '" stroke-width="1" fill="' + color + '" />';
		}
		string += '</svg>';
		return string;
	};

};

function D4 () {
	var that = new Tetrahedron({
		size:65,faceClass:'red',addContentToFace:
		function(face, index){face.appendChild(markNumbersOnTip(index,'red'));}
	});
	
	that.landingOrientation = function (score){
		var spin = [0,0,0];		
		var wobble = Math.floor(Math.random()*40) - 20;
		
		switch(score) {
		case 1:	spin = [240,wobble,0];break;
		case 2:	spin = [120,wobble,60];break;
		case 3:	spin = [120,wobble,300];break;
		case 4:	spin = [0,0,wobble];break;			
		};
		return spin;
	};
	
	return that;
	function markNumbersOnTip (faceNumber,color){
		var frame = document.createElement('div');
		frame.style.position = 'absolute';
		frame.style.width = '70px';
		frame.style.height = ''+ 70 * Math.sqrt(3) / 2 +'px';
		frame.style.left = '0px';
		frame.style.top = '0px';

		var points = [];
		for (var i = 0; i<3; i++) {
			points[i] = document.createElement('div');
			points[i].innerText = rightNumber(i,faceNumber) ;
			//points[i].appendChild (stripe(i,faceNumber)) ;
			points[i].style.position = 'absolute';
			points[i].style.width = '20px';
			points[i].style.height = '20px';
			points[i].style.textAlign = 'center';
			points[i].style.fontSize = '20px';
			frame.appendChild(points[i]);
		}
		
		points[0].style.left = '50%';
		points[0].style.top = '15%';
		points[0].style.transform = 'translateX(-50%)';
		
		points[1].style.left = '10%';
		points[1].style.bottom = '5%';
		points[1].style.transform = 'rotate(-120deg)';
		
		points[2].style.right = '10%';
		points[2].style.bottom = '5%';
		points[2].style.transform = 'rotate(120deg)';
		
		return frame;
		function rightNumber(p,f) {
			return [['4','3','2'],['4','1','3'],['4','2','1'],['1','2','3']]
			[f][p];
		}
		
		function stripe(p,f){
			var n = [[4,3,2],[4,1,3],[4,2,1],[1,2,3]][f][p];
			var node = document.createElement('svg');
			
					node.style.position = 'absolute';
		node.style.width = '20px';
		node.style.height = '20px';
		node.style.left = '0px';
		node.style.top = '0px';
			
			
			for (var j = 0; j < n; j++ ){
				node.innerHTML += '<line x1="0" y1="' + (3+j*5) + '" x2="100" y2="' + (3+j*5) + '" style="stroke:rgb(255,0,0);stroke-width:2" />'
			}
			
			return node;
		}
		
	};
	
};

function D8() {
	var that = new Octahedron({
		size:55,faceClass:'red',
		addContentToFace:function(face, index){face.innerText = index+1;}
	});
	that.landingOrientation = function (score){
		var spin = [0,0,0];		
		var wobble = Math.floor(Math.random()*20) - 10;
		
		switch(score) {
		case 1:	spin = [35,0,0];break;
		case 2:	spin = [35,270,0];break;
		case 3:	spin = [35,180,0];break;
		case 4:	spin = [35,90,0];break;
		case 5:	spin = [35,0,180];break;
		case 6:	spin = [35,270,180];break;
		case 7:	spin = [35,180,180];break;
		case 8:	spin = [35,90,180];break;
		};
		spin[1] += wobble;
		return spin;
	};
	
	return that;	
};

function D10() {
	var that = new PentagonalTrapezohedron({
		size:45,faceClass:'red',
		addContentToFace:function(face, index){
			face.innerText = index+1;
			if (index+1 === 6 || index+1 === 9) {face.innerText+='.'};
		}
	});
	that.landingOrientation = function (score){
		var spin = [0,0,0];		
		var wobble = Math.floor(Math.random()*10) - 5;
		
		switch(score) {
		case 1:	spin = [36,0,0];break;
		case 2:	spin = [36,288,0];break;
		case 3:	spin = [36,216,0];break;
		case 4:	spin = [36,144,0];break;
		case 5:	spin = [36,72,0];break;
		case 6:	spin = [36,252,180];break;//
		case 7:	spin = [36,180,180];break;//
		case 8:	spin = [36,180,180];break;//
		case 9:	spin = [36,108,180];break;//
		case 10:spin = [36,36,180];break;//
		};
		spin[2] += wobble;
		return spin;
	};
	
	return that;	
};

function D12() {
	var that = new Dodecahedron({
		size:60,faceClass:'red',
		addContentToFace:function(face, index){
			face.innerText = index+1;
			if (index+1 === 6 || index+1 === 9) {face.innerText+='.'};
		}
	});
	that.landingOrientation = function (score){
		var spin = [0,0,0];		
		var wobble = Math.floor(Math.random()*20) - 10;
		
		switch(score) {
		case 1:	spin = [0,0,0];break;//
		case 2:	spin = [60,210,20];break;//
		case 3:	spin = [60,145,340];break;//
		case 4:	spin = [280,0,180];break;//
		case 5:	spin = [114,180,144];break;//
		case 6:	spin = [114,180,214];break;//
		case 7:	spin = [114,180,72];break;//
		case 8:	spin = [290,0,110];break;//
		case 9:	spin = [64,210,230];break;//
		case 10:	spin = [230,25,25];break;
		case 11:	spin = [60,144,124];break;//
		case 12:	spin = [0,180,100];break;//
		};
		//spin[1] += wobble;
		return spin;
	};
	
	return that;	
};

function D20() {
	var that = new Icosahedron({
		size:80,faceClass:'red smallerText',
		addContentToFace:function(face, index){
			face.innerText = ''+(index+1);
			if (index+1 === 6 || index+1 === 9) {face.innerText+='.'};
		}
	});
	that.landingOrientation = function (score){
		var spin = [0,0,0];		
		var wobble = Math.floor(Math.random()*20) - 10;
		
		switch(score) {
		case 1:	spin = [0,0,0];break;
		case 2:	spin = [330,0,180];break;
		case 3:	spin = [330,0,60];break;
		case 4:	spin = [324,0,300];break;
		case 5:	spin = [290, 35, 260];break;
		case 6:	spin = [300, 324, 0];break;
		case 7:	spin = [290, 35, 370];break;
		case 8:	spin = [312, 324, 120];break;
		case 9:	spin = [290, 35, 140];break;
		case 10:	spin = [300, 324, 228];break;
		case 11:	spin = [0,180,180];break;
		case 12:	spin = [335,180,0];break;
		case 13:	spin = [156,0,300];break;
		case 14:	spin = [320, 180, 240];break;
		case 15:	spin = [120, 324, 108];break;
		case 16:	spin = [120, 36, 12];break;
		case 17:	spin = [305, 215, 176];break;
		case 18:	spin = [120, 36, 252];break;
		case 19:	spin = [305,215,55];break;
		case 20:	spin = [120, 36, 132];break;
		};
		//spin[1] += wobble;
		return spin;
	};
	
	return that;	
};


function roll (target,score) {
		if (isMoving(target)) {return false;}
		if (typeof(score) == 'undefined' ) {score = Math.floor(Math.random()*(target.childElementCount))+1};	
		
		var twist = function(){return Math.floor(Math.random()*360)-180};
		var slide = function(m){return Math.floor(Math.random()*m)};
		
		var startSpin = {x:twist(),y:twist(),z:twist()};
		var midSpin = {x:twist(),y:twist(),z:twist()};
		
		if (score === 0) {
			gradual(target, {spin:startSpin},{duration:1})
			.then(() => gradual(target, {move:[0,0,0]},	{duration:30}) )
			return;
		};			
		
		target.move = {units:'vw'};
		var endSpin = target.landingOrientation(score);
		gradual(target, {spin:startSpin},{duration:1})
		.then(() => gradual(target, {move:[0,0,50]},	{duration:30}) )
		.then(() => gradual(target, {move:[15+slide(5),0,0],spin:midSpin},{speed:1.4}) )
		.then(() => gradual(target, {move:[50+slide(10),0,0],spin:endSpin},{speed:1.2}) );
		
		return score;
	};