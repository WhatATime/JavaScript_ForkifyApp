// MVC architecture
// SEARCH VIEW module

//////////////////////////////////////////////////////////
// MODULE IMPLEMENTATION
// Implementation of search bar

class SearchView {
  // Parent element is the search bar
  _parentEl = document.querySelector('.search');

  /**
   * Function that returns the query string from the search bar after form submit
   * @returns Query string
   */
  getQuery() {
    // Get the search query
    const query = this._parentEl.querySelector('.search__field').value;
    // Clear the search bar
    this._clearInput();
    // Return the query string
    return query;
  }

  /**
   * Event listener that executes the handler function after submitting the form
   * @param {function} handler Function that is executed, serves as callback function
   */
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      // Prevent default form behaviour
      e.preventDefault();
      // Execute the handler function
      handler();
    });
  }

  /**
   * Function that clears the search bar
   */
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
