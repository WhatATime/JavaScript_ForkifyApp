// MVC architecture
// BOOKMARKS VIEW module

//////////////////////////////////////////////////////////
// IMPORTS

import View from './view';
import previewView from './previewView';

//////////////////////////////////////////////////////////
// MODULE IMPLEMENTATION
// Implementation of bookmarks view

// Child instance of VIEW class
class BookmarksView extends View {
  // Parent element is bookmarks view
  _parentElement = document.querySelector('.bookmarks__list');
  // Predifined error message
  _errorMessage = 'No bookmarks yet. Find a recipe and bookmark it.';
  _message = '';

  /**
   * Event listener that executes the handler function after load event
   * @param {function} handler Function that is executed, serves as callback function
   */
  addHandlerRender(handler) {
    // Waiting for load event for executing handler to render bookmarks
    window.addEventListener('load', handler);
  }

  /**
   * Function that returns a markup string for all bookmarked recipes
   * @returns Markup string for all recipes
   */
  _generateMarkup() {
    // Map over all bookmared recipes and create a markup string for each of them
    // Join the array to one string
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
