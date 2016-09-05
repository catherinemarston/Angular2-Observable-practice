/// <reference path="../typings/tsd.d.ts" />

import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'my-app',
    template: `
        <input id="search" type="text" class="form-control">
    `
})

//********version without OBSERVABLES*****
// **************

// export class AppComponent {
//     constructor(){
//
//     var debounced = _.debounce(function(text){
//       var url = "https://api.spotify.com/v1/search/?type=artist&q=" + text;
//       $.getJSON(url, function(artists){
//         console.log(artists);
//       })
//     },400);
//       $("#search").keyup(function(event){
//         var text = event.target.value;
//
//         if (text.length < 3)
//         return;
//
//         debounced(text);
// //three separate promises - nested callbacks === callback HELL!
// //reactive js comes into place here
//
//       })
//     }
// }

//version with OBSERVABLES

export class AppComponent {
    constructor() {

  var keyups = Observable.fromEvent($("#search"), "keyup")
  .map(event => event.target.value)
  .filter(text => text.length >=3)
  .debounceTime(400)
  .distinctUntilChanged()
  .flatMap(searchTerm => {
    //this would normally go in a service. Bad idea to have this logic in a controller but for a simple example, it will suffice.
    var url = "https://api.spotify.com/v1/search/?type=artist&q=" + searchTerm;
        var promise = $.getJSON(url);
        //getJSON method returns a promise
        var observable = Observable.fromPromise(promise);
        //we can get this promise and create an observable... promise will be pushed into observable stream
        return observable;
        //now we can have an observable within in an observable, which is where flatMap comes into play.
  });
  //start with an observable and keep putting filters on it
  //

  var subscription = keyups.subscribe(data => console.log(data));
//now data is the JSON object we get from the server

   }
}
