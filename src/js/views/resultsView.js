// MVC architecture
// SEARCH VIEW module

//////////////////////////////////////////////////////////
// IMPORTS

import View from './view';
import previewView from './previewView';

//////////////////////////////////////////////////////////
// MODULE IMPLEMENTATION
// Implementation of search result view

// Child instance of VIEW class
class ResultsView extends View {
  // Parent element is results view
  _parentElement = document.querySelector('.results');
  // Predefined error/success messages
  _errorMessage = 'No recipes found for your query! Please try again.';
  _message = '';

  /**
   * Function that returns a markup string for all requested recipes
   * @returns Markup string for all recipes
   */
  _generateMarkup() {
    // Map over all search results and create a markup string for each of them
    // Join the array to one string
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
