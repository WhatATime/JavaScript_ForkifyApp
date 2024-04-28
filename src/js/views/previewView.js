// MVC architecture
// PREVIEW module
// Serves as help for bookmarks and search results view

//////////////////////////////////////////////////////////
// IMPORTS

import View from './view';
import icons from 'url:../../img/icons.svg';

// Child class of VIEW class
class PreviewView extends View {
  // NO parent element needed
  _parentElement = '';

  /**
   * Function that generates a markup string
   * @returns HTML markup string for preview data (needed for search results and bookmarks view)
   */
  _generateMarkup() {
    // Get recipe ID from Browser without #
    const id = window.location.hash.slice(1);

    // Return markup string
    // Data is coming from VIEW class
    return `
    <li class="preview">
        <a class="preview__link ${
          this._data.id === id ? 'preview__link--active' : ''
        }" href="#${this._data.id}">
            <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${this._data.title}</h4>
              <p class="preview__publisher">${this._data.publisher}</p>
              <div class="preview__user-generated ${
                this._data.key ? '' : 'hidden'
              }">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
        </a>
    </li>`;
  }
}

export default new PreviewView();
