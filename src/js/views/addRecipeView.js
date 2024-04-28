// MVC architecture
// ADD RECIPE VIEW module

//////////////////////////////////////////////////////////
// IMPORTS

import View from './view';

//////////////////////////////////////////////////////////
// MODULE IMPLEMENTATION
// Implementation of add recipe view

// Child class of VIEW class
class AddRecipeView extends View {
  // Parent element is upload view
  _parentElement = document.querySelector('.upload');
  // Predefined success message
  _message = 'Recipe was successfully uploaded.';
  // Select modal window
  _window = document.querySelector('.add-recipe-window');
  // Select overlay
  _overlay = document.querySelector('.overlay');
  // Select Open Modal button
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  // Select Close Modal button
  _btnClose = document.querySelector('.btn--close-modal');

  /**
   * Constructor which binds the Handler function to the class
   */
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  /**
   * Function that toggles the hidden class on the modal window and overlay
   */
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  /**
   * Function to add an event listener to the open modal button
   */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Function to add an event listener to the close modal button and to the overlay
   */
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Event listener that executes the handler function after submitting the new recipe form
   * @param {function} handler Function that is executed, serves as callback function
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // Prevent default form behaviour
      e.preventDefault();
      // Destructure the form data into new array
      const dataArray = [...new FormData(this)];
      // Parse the array data into new object
      const data = Object.fromEntries(dataArray);
      // Execute the handler function with data object
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
