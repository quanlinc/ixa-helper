import Deck from './deck';

const emptyHandler = () => ''

export default {
    '/card/deck.php': Deck,
    '/report/list.php': emptyHandler,
}