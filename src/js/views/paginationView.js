// MVC architecture
// PAGINATION VIEW module

//////////////////////////////////////////////////////////
// IMPORTS

import View from './view';
import icons from 'url:../../img/icons.svg';

//////////////////////////////////////////////////////////
// MODULE IMPLEMENTATION
// Implementation of pagination view

// Child class of VIEW class
class PaginationView extends View {
  // Parent element is the pagination view
  _parentElement = document.querySelector('.pagination');

  /**
   * Event listener that executes the handler function after clicking the previous or next page button
   * @param {function} handler Function that is executed, serves as callback function
   */
  addHandlerButton(handler) {
    // Add event handler to parent element (event delegation)
    this._parentElement.addEventListener('click', function (e) {
      // Get the closest button parent element (necessary if click was on icon)
      // Here the correct button (previous or next) is selected
      const btn = e.target.closest('.btn--inline');
      // If no button clicked, but somewhere elese in parent element, do nothing
      if (!btn) return;
      // Get requested page from button dataset
      const goToPage = +btn.dataset.goto;
      // Execute handler function with selected page
      handler(goToPage);
    });
  }

  /**
   * Function that creates the markup string for the previous button
   * @param {number} page Number indicating the previous page
   * @returns HTML markup string
   */
  _generateMarkupPrev(page) {
    return `
        <button data-goto="${
          page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
        </button>`;
  }

  /**
   * Function that creates the markup string for the previous button
   * @param {number} page Number indicating the next page
   * @returns HTML markup string
   */
  _generateMarkupNext(page) {
    return `
    <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${page + 1}</span>
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>`;
  }

  /**
   * Function that creates the markup string for the pagination buttons
   * @param {number} page Number indicating the next page
   * @returns HTML markup string
   */
  _generateMarkup() {
    // Get the current page number
    const currentPage = this._data.page;

    // Get the total number of pages needed to display the search results dependent on the number of results per page
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Current page is the page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupNext(currentPage);
    }

    // Current page is the last page, and there are other pages
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupPrev(currentPage);
    }
    // Current page is not the page 1 and not the last page, and there are other pages
    if (currentPage < numPages) {
      return (
        this._generateMarkupPrev(currentPage) +
        this._generateMarkupNext(currentPage)
      );
    }

    // Current page is the page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
