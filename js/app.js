// populate dropdowns
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

var armorData = [];
var weaponData = [];

var purplePlates = [1, 3, 5, 8, 11, 14, 18, 22, 26, 30];
var goldPlates = [2, 5, 8, 12, 16, 21, 27, 33, 39, 45];
var legendPlates = [3, 9, 15, 24, 33, 42, 54, 66, 78, 90];

// get armor damage multipliers
$.getJSON('https://mossumossu.github.io/ALDamage/res/armorMultipliers.json', function(data){
    armorData = data;
});

// get weapon data
function getWeaponData(){
    return $.getJSON('https://mossumossu.github.io/ALDamage/res/weapons.json', function(data){
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

// on input
$(".input").change(function () {

    // read input values
    var currentWeapon = $('#dd-weapon').val();
    var currentLevel = parseInt($('#dd-weaponLevel').val());
    var currentFP = parseInt($('#txt-FP').val());
    var currentEff = (parseInt($('#txt-Eff').val()))/100;
    var cReload = parseInt($('#txt-Reload').val());
    var cArmor = $('#dd-targetArmor').val().toLowerCase();

    // initialize some other variables
    var armorMod = 1;
    var nextLevel = currentLevel + 1;
    var shots = weaponData[currentWeapon].Shots;
    var modifier = weaponData[currentWeapon].Modifier;
    var cRoF, cBaseDPShot, cFDPShot, cDPS, uRoF, uBaseDPShot, uFDPShot, uDPS;
    var plates = [];

    // find armor modifier
    if(cArmor != "neutral"){
        armorData.forEach(function(item){
            if(item.AmmoType == weaponData[currentWeapon].AmmoType && item.weaponType == weaponData[currentWeapon].WeaponType){
                armorMod = item[cArmor];
            };
        });
    };  

    // check weapon rarity and populate plates array appropriately
    if(weaponData[currentWeapon].Rarity == "Purple"){
        plates = purplePlates;
    }
    else if (weaponData[currentWeapon].Rarity == "Gold"){
        plates = goldPlates;
    }
    else if (weaponData[currentWeapon].Rarity == "Legendary"){
        plates = legendPlates;
    };

    // calculate base damage per shot
    cBaseDPShot = weaponData[currentWeapon].L0Damage + ((weaponData[currentWeapon].L10Damage - weaponData[currentWeapon].L0Damage) / 10 ) * currentLevel;
    cBaseDPShot = Math.round(cBaseDPShot);

    // final damage per shot
    cFDPShot = cBaseDPShot * currentEff * ((100 + currentFP) / 100) * modifier * armorMod;

    // rate of fire
    cRoF = weaponData[currentWeapon].L0RoF + ((weaponData[currentWeapon].L10RoF - weaponData[currentWeapon].L0RoF) / 10 ) * currentLevel;
    cRoF = cRoF * Math.sqrt(200/(cReload + 100));
    
    // and damage per second
    cDPS = (cFDPShot * shots) / cRoF;

    // update display
    document.getElementById('Shots').innerHTML = weaponData[currentWeapon].Shots;              
    document.getElementById('DPShot').innerHTML = cBaseDPShot;
    document.getElementById('RoF').innerHTML = Number(cRoF).toFixed(2);
    document.getElementById('cFDPShot').innerHTML = Number(cFDPShot).toFixed(2);
    document.getElementById('DPS').innerHTML = Number(cDPS).toFixed(2);

    // if the weapon isn't max level, calculate and display info on next level
    if(currentLevel < 10) {

        // calculate base damage per shot
        uBaseDPShot = weaponData[currentWeapon].L0Damage + ((weaponData[currentWeapon].L10Damage - weaponData[currentWeapon].L0Damage) / 10 ) * nextLevel;
        uBaseDPShot = Math.round(uBaseDPShot);
        
        // final damage per shot
        uFDPShot = uBaseDPShot * currentEff * ((100 + currentFP) / 100) * modifier * armorMod;

        // rate of fire
        uRoF = weaponData[currentWeapon].L0RoF + ((weaponData[currentWeapon].L10RoF - weaponData[currentWeapon].L0RoF) / 10 ) * nextLevel;
        uRoF = uRoF * Math.sqrt(200/(cReload + 100));

        // and damage per second
        uDPS = (uFDPShot * shots) / uRoF;
        
        // update display
        document.getElementById('uShots').innerHTML = weaponData[currentWeapon].Shots;              
        document.getElementById('uDPShot').innerHTML = uBaseDPShot;
        document.getElementById('uRoF').innerHTML = Number(uRoF).toFixed(2);
        document.getElementById('uFDPShot').innerHTML = Number(uFDPShot).toFixed(2);
        document.getElementById('uDPS').innerHTML = Number(uDPS).toFixed(2);
        document.getElementById('Plates').innerHTML = plates[currentLevel];              
        document.getElementById('DPSPPlate').innerHTML = Number((uDPS - cDPS) / plates[currentLevel]).toFixed(2);
    }
    // if the weapon is max level
    else {
        document.getElementById('uShots').innerHTML = "-";              
        document.getElementById('uDPShot').innerHTML = "-";
        document.getElementById('uRoF').innerHTML = "-";
        document.getElementById('uFDPShot').innerHTML = "-";
        document.getElementById('uDPS').innerHTML = "-";    
        document.getElementById('Plates').innerHTML = "-";              
        document.getElementById('DPSPPlate').innerHTML = "-";
    } 
});

// when filter dropdown is changed
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