import {expect} from 'chai';
import {List, Map} from 'immutable'
import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {
   describe('setEntries', () => {
      it('добавляет записи к состоянию', () => {
         const state = Map();
         const entries = ['One', 'Two'];
         const nextState = setEntries(state, entries);

         expect(nextState).to.equal(Map({
             entries: List.of('One','Two')
         }));
      });
   });
   describe('next', () => {
      it('берёт для голосования следующие две записи', () => {
        const state = Map({
           entries: List.of('One', 'Two', 'Three')
        });
        const nextState = next(state);

        expect(nextState).to.equal(Map({
            vote: Map({pair: List.of('One', 'Two')}),
            entries: List.of('Three')
        }));
      });
      it('помещает победителя текущего голосования в конец списка записей', () => {
         const state = Map({
             vote: Map({pair:List.of('One','Two'), tally:Map({'One':2, 'Two':3})}),
             entries: List.of('Three', 'Four', 'Five')
         });
         const nextState = next(state);
         expect(nextState).to.equal(
             Map({
                 vote: Map({pair: List.of('Three', 'Four')}),
                 entries: List.of('Five', 'Two')
             })
         );
      });
      it('в случае ничьей помещает обе записи в конец списка', () => {
         const state = Map({
             vote: Map({pair:List.of('One','Two'), tally:Map({'One':2, 'Two':2})}),
             entries: List.of('Three', 'Four', 'Five')
         });
         const nextState = next(state);
         expect(nextState).to.equal(
             Map({
                 vote: Map({pair: List.of('Three', 'Four')}),
                 entries: List.of('Five', 'One','Two')
             })
         );
      });
      it('когда остаётся лишь одна запись, помечает её как победителя', () => {
         const state = Map({
             vote: Map({pair:List.of('One','Two'), tally:Map({'One':2, 'Two':3})}),
             entries: List()
         });
         const nextState = next(state);
         expect(nextState).to.equal(
             Map({
                 winner: 'Two'
             })
         );
      });

   });

   describe('vote', () => {
      it('создаёт результат голосования для выбранной записи', ()=>{
         const state =  Map({
             vote: Map({pair: List.of('One', 'Two')}),
             entries: List()
         });
         const nextState = vote(state, 'One');

         expect(nextState).to.equal(Map({
             vote: Map(
                 {
                     pair: List.of('One', 'Two'),
                     tally: Map({'One': 1})
                 }),
             entries: List()
             }))
      });
      it('добавляет в уже имеющийся результат для выбранной записи', () => {
          const state = Map({
              vote: Map({
                  pair: List.of('One', 'Two'),
                  tally: Map({
                      'One': 2,
                      'Two': 3
                  })
              }),
              entries: List()
          });

          const nextState = vote(state, 'Two');
          expect(nextState).to.equal(
            Map({
                vote: Map({pair: List.of('One','Two'), tally:Map({'One':2, 'Two': 4})}),
                entries: List()
            })
          );
      });
   });
});