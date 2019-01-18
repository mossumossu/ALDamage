let ddWeapon = $('#dd-weapon');
ddWeapon.empty();
ddWeapon.append('<option selected="true" disabled>Choose Weapon</option>');
ddWeapon.prop('selectedIndex', 0);

let ddWeaponLevel = $('#dd-weaponLevel');
ddWeaponLevel.empty();
for(i=0; i < 11; i++){
    ddWeaponLevel.append('<option value:' + i + '>' + i + '</option>')
}
ddWeaponLevel.prop('selectedIndex', 0);

const url = 'https://mossumossu.github.io/ALDamage/res/weapons.json';

var weaponData = [];

var purplePlates = [1, 3, 5, 8, 11, 14, 18, 22, 26, 30];
var goldPlates = [2, 5, 8, 12, 16, 21, 27, 33, 39, 45];
var legendPlates = [3, 9, 15, 24, 33, 42, 54, 66, 78, 90];

// populate weapon data array from .json
function getWeaponData(){
    return $.getJSON(url, function(data){
        weaponData = data;
    });
};

// populate weapon dropdown from array
getWeaponData().done(function(){
    weaponData.forEach(function(item, index) {
        ddWeapon.append(new Option(item.Name, index));
    });
});

getWeaponData();

$(".input").change(function () {
    var currentWeapon = $('#dd-weapon').val();
    var currentLevel = parseInt($('#dd-weaponLevel').val());
    var currentFP = parseInt($('#txt-FP').val());
    var currentEff = (parseInt($('#txt-Eff').val()))/100;

    console.log(currentEff);
    console.log(currentFP);

    var nextLevel = currentLevel + 1;
    var shots = weaponData[currentWeapon].Shots;
    var modifier = weaponData[currentWeapon].Modifier;
    var cRoF, cBaseDPShot, cDPShot, cDPS, uRoF, uBaseDPShot, uDPShot, uDPS;
    var plates = [];

    cBaseDPShot = weaponData[currentWeapon].L0Damage + ((weaponData[currentWeapon].L10Damage - weaponData[currentWeapon].L0Damage) / 10 ) * currentLevel;
    cDPShot = cBaseDPShot * currentEff * ((100 + currentFP) / 100) * modifier;

    cRoF = weaponData[currentWeapon].L0RoF + ((weaponData[currentWeapon].L10RoF - weaponData[currentWeapon].L0RoF) / 10 ) * currentLevel;
    cDPShot = Math.round(cDPShot);

    cDPS = (cDPShot * shots) / cRoF;

    document.getElementById('Shots').innerHTML = weaponData[currentWeapon].Shots;              
    document.getElementById('DPShot').innerHTML = Math.round(cDPShot);
    document.getElementById('RoF').innerHTML = Number(cRoF).toFixed(2);
    document.getElementById('DPS').innerHTML = Number(cDPS).toFixed(2);

    if(weaponData[currentWeapon].Rarity == "Purple"){
        plates = purplePlates;
    }
    else if (weaponData[currentWeapon].Rarity == "Gold"){
        plates = goldPlates;
    }
    else if (weaponData[currentWeapon].Rarity == "Legendary"){
        plates = legendPlates;
    }

    if(currentLevel < 10) {
        uBaseDPShot = weaponData[currentWeapon].L0Damage + ((weaponData[currentWeapon].L10Damage - weaponData[currentWeapon].L0Damage) / 10 ) * nextLevel;
        uDPShot = uBaseDPShot * currentEff * ((100 + currentFP) / 100) * modifier;

        uRoF = weaponData[currentWeapon].L0RoF + ((weaponData[currentWeapon].L10RoF - weaponData[currentWeapon].L0RoF) / 10 ) * nextLevel;
        uDPShot = Math.round(uDPShot);

        uDPS = (uDPShot * shots) / uRoF;
        
        document.getElementById('uShots').innerHTML = weaponData[currentWeapon].Shots;              
        document.getElementById('uDPShot').innerHTML = uDPShot;
        document.getElementById('uRoF').innerHTML = Number(uRoF).toFixed(2);
        document.getElementById('uDPS').innerHTML = Number(uDPS).toFixed(2);

        document.getElementById('Plates').innerHTML = plates[currentLevel];              
        document.getElementById('DPSPPlate').innerHTML = Number((uDPS - cDPS) / plates[currentLevel]).toFixed(2);
    }
    else {
        document.getElementById('uShots').innerHTML = "-";              
        document.getElementById('uDPShot').innerHTML = "-";
        document.getElementById('uRoF').innerHTML = "-";
        document.getElementById('uDPS').innerHTML = "-";
    
        document.getElementById('Plates').innerHTML = "-";              
        document.getElementById('DPSPPlate').innerHTML = "-";
    } 
});

$("#dd-classFilter").change(function (){
    ddWeapon.empty();
    ddWeapon.append('<option selected="true" disabled>Choose Weapon</option>');
    ddWeapon.prop('selectedIndex', 0);

    if($('#dd-classFilter').val() == "ALL"){
        weaponData.forEach(function(item, index) {
            ddWeapon.append(new Option(item.Name, index));
        });
    }
    else{
        weaponData.forEach(function(item, index) {
            if(item.WeaponType == $('#dd-classFilter').val())
                ddWeapon.append(new Option(item.Name, index));
        });
    };    
    document.getElementsByTagName("p").innerHTML = "-";
})

$(document).foundation()