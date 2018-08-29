function updateMarkers(type, isShow){
  if(isShow){
    toggleMarkers(type, map);
  }else{
    toggleMarkers(type, null);
  }
  hideDetailPan()
  dirDisplay.setMap(null);
}

function toggleMarkers(type, dogmap){
  var makers = [];
  if(type == 'eat'){
    markers = eat;
  }else if(type == 'wor'){
    markers = wor;
  }else if(type == 'hot'){ 
    markers = hot;
  }else if(type == 'act'){ 
    markers = act;
  }else if(type == 'sho'){ 
    markers = sho;
  }else if(type == 'sup'){ 
    markers = sup;
  }else if(type == 'bea'){ 
    markers = bea;
  }else{ 
    markers = spo;
  }

  for(var x =0; x < markers.length; x++){
    markers[x].setMap(dogmap);
  }
}

function updateDetail(location, name, description){
  var detailData = {};
  var photoSlider=''; 
  
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({'location': location}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        var isFinded = false;
        for(let n= 0; n < results.length; n++){
          if(results[n].geometry.location.lat() == location.lat() && results[n].geometry.location.lng() == location.lng()){
            isFinded = getPlaceDetail(results[n].place_id, name, description);
            break;
          }
        }

        if(!isFinded){
          getPlaceDetail(results[0].place_id, name, description);
        }
        
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
function getPlaceDetail(place_id, name, descript){
  placeService.getDetails({placeId:place_id}, function(placeDetail, detailStatus){
    if(detailStatus == google.maps.places.PlacesServiceStatus.OK){
      var photo_Count = 0, main_Photo = '';
      if(placeDetail.photos){
        photo_Count = placeDetail.photos.length;  
      }

      if(photo_Count){
        main_Photo = placeDetail.photos[0].getUrl({'maxWidth':400, 'maxHeight':300});
        var thumbPhotos = placeDetail.photos; 
        var active = "active";
        var num = 1;
        for(let x= 0; x < thumbPhotos.length; x++){
          var photoUrl = thumbPhotos[x].getUrl({'maxWidth':1024, 'maxHeight':768});
          photoSlider += '<div id="item_'+num+'" class="item '+ active +'" style="text-align: center;height:100%" num="'+num+'">'
                        +'<img src="' + photoUrl + '" alt="Los Angeles" style="height:100%;    margin-left: auto; margin-right: auto;">'
                        +'</div>';
          active = ''; num += 1;
        }

        document.getElementById('photoSlider').innerHTML=photoSlider;
      }

      detailData = {
        mainPhoto : main_Photo,
        direction : "https://www.google.com/maps/dir//" + placeDetail.geometry.location.lat() + ", " + placeDetail.geometry.location.lng(),
        name : name,
        description : descript,
        address : placeDetail.formatted_address,
        phone : placeDetail.formatted_phone_number,
        rating : placeDetail.rating,
        website : placeDetail.website,
        viewInGoogle : placeDetail.url,
        photoCount : photo_Count
      };

    }
    selectedPlace = placeDetail.geometry.location;
    dirDisplay.setMap(null);
    insertDetailInfo(detailData);
    return true;
  });
}

function updateRoute(){
  var origin = {lat:myPos.lat,lng:myPos.lng};
  var destination = {lat:selectedPlace.lat(), lng:selectedPlace.lng()};
  dirService.route({
    origin: origin,
    destination: destination,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      dirDisplay.setMap(map);
      dirDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function updatePhotoSlider(photos){
  var photoSlider; 
  for(var x in photos){
    var photoUrl = placeDetail.photos[x].getUrl({'maxWidth':315, 'maxHeight':200});
    photoSlider += '<div class="item active">'
                  +'<img src="' + photoUrl + '" alt="Los Angeles" style="width:100%;">'
                  +'</div>';
  }
}

function movingMapToSearch(isSearching){
  if(isSearching && s_marker.getMap() == map){
    var s_pos = s_marker.getPosition();
    hideDetailPan();
    map.setCenter({lat:s_pos.lat(), lng:s_pos.lng()});
    map.setZoom(17); 
  }else{
    map.setCenter(myPos);
    map.setZoom(8);
  }
}

function createMarker(category, name, descript, latlng){
    var x_pos = Number(latlng.substr(0, latlng.indexOf(',')));
    var y_pos = Number(latlng.substr(latlng.indexOf(',')+1, latlng.lastIndexOf(",")-latlng.indexOf(',')-1));

    var newMarker = new google.maps.Marker({position:{lat:y_pos, lng:x_pos}});
    newMarker.addListener('click', function(){
      updateDetail(this.getPosition(), name , descript);
    });

    switch(category) {
      case 'Eat & Drink':
          newMarker.setIcon({url:window.location.href +'imgs/eat.png', size: new google.maps.Size(40,40)});
          eat.push(newMarker);
          break;
      case 'Workspace':
          newMarker.setIcon(window.location.href +'imgs/wor.png');
          wor.push(newMarker);
          break;
      case 'Hotels':
          newMarker.setIcon(window.location.href +'imgs/hot.png');
          hot.push(newMarker);
          break;
      case 'Activities':
          newMarker.setIcon(window.location.href +'imgs/act.png');
          act.push(newMarker);
          break;
      case 'Shops':
          newMarker.setIcon(window.location.href +'imgs/sho.png');
          sho.push(newMarker);
          break;
      case 'Supermarkets':
          newMarker.setIcon(window.location.href +'imgs/sup.png');
          sup.push(newMarker);
          break;
      case 'Beach':
          newMarker.setIcon(window.location.href +'imgs/bea.png');
          bea.push(newMarker);
          break;
      case 'Sports':
          newMarker.setIcon(window.location.href +'imgs/spo.png');
          spo.push(newMarker);
    }
}

function initData(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      myFunction(this);
    }
  };

  xhttp.open("GET", window.location.href+"/readKML.php", true);
  xhttp.send();

  function myFunction(xml) {
    var parser, xmlDoc;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml.responseText,"text/xml");
    
    var s = myLoop(xmlDoc.documentElement);
  }

  function myLoop(x) {
    var i, y, xLen, txt;
    txt = "";
    x = x.childNodes;
    xLen = x.length;
    for (i = 0; i < xLen ;i++) {
      y = x[i];
      if(y.tagName == 'Folder'){
        var items = y.childNodes;
        var category , markers=[];
        for (var l = 0; l <items.length; l++) {
          var item = items[l];
          if(item.nodeName == 'name'){
            category = item.firstChild.nodeValue;
          }else if(item.nodeName == 'Placemark'){
            var markAttrs = item.childNodes;
            var name, descript, latlng;
            for (var m = 0; m < markAttrs.length; m++) {
              var markAttr = markAttrs[m];
              if(markAttr.tagName == 'name'){
                name = markAttr.textContent;
              }else if(markAttr.tagName == 'description'){
                descript = markAttr.textContent;
              }else if(markAttr.tagName == 'Point'){
                latlng = markAttr.textContent;
              }
            }
            createMarker(category, name, descript,latlng);
          }
        }
      }
      if (y.nodeType != 3) {
        if (y.childNodes[0] != undefined) {
          txt += myLoop(y);
        }
      } else {
      txt += y.nodeValue + "<br>";
      }
    }
    return txt;
  }
  


}
