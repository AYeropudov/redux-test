import {expect} from 'chai';
import {List, Map} from 'immutable'
describe('immutability', () => {
   describe('a number', () => {
       function increment(currentState) {
           return currentState + 1;
       }
       it('is immutable', () => {
           let state = 42;
           let nextState = increment(state);
           expect(nextState).to.equal(43);
           expect(state).to.equal(42);
       });
   });

   describe('a List', () => {
      function addToList(currentState, newItem) {
          return currentState.push(newItem);
      }

      it('is immutable list', () => {
         let currentState = List.of('One', 'Two');
         let nexState = addToList(currentState, 'Three');

         expect(currentState).to.equal(List.of('One','Two'));
         expect(nexState).to.equal(List.of('One','Two','Three'));
      });
   });
   
   describe('a tree', () => {
      function addToList(currentState, newItem) {
          return currentState.update('movies', movies => movies.push(newItem))
      }

      it('is immutable tree', () => {
         let state = Map({
             movies: List.of('One', 'Two')
         });

         let nextState = addToList(state, 'Three');

         expect(state).to.equal(Map({
             movies:List.of('One', 'Two')
         }));

         expect(nextState).to.equal(Map({
             movies: List.of('One','Two','Three')
         }));
      });

   });
});