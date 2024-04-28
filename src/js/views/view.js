// MVC architecture
// MAIN VIEW module

//////////////////////////////////////////////////////////
// IMPORTS
import icons from 'url:../../img/icons.svg';

//////////////////////////////////////////////////////////
// ClASS DECLARATION

/**
 * Class which serves as parent class for all "View" instances. Includes methods each "View" class should contain.
 */
export default class View {
  // Protected data variable
  _data;

  /**
   * Protected function that clears the parent element from any HTML
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Public function that renders a loading spinner to parent element
   */
  renderSpinner() {
    // Generate markup string
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    // Clear parent element
    this._clear();
    // Insert markup string
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Public function that renders an Error message to the DOM in parent element
   * @param {string} message Message which should describe the error
   */
  renderError(message = this._errorMessage) {
    // Generate markup string
    const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
         </div>`;
    // Clear parent element
    this._clear();
    // Insert markup string
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Public function that renders any message to the DOM in parent element
   * @param {string} message
   */
  renderMessage(message = this._message) {
    // Generate markup string
    const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
         </div>`;
    // Clear parent element
    this._clear();
    // Insert markup string
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Public function that renders the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g.recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM. Predefined as true.
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View instance
   */
  render(data, render = true) {
    // Guard clause which checks if data object exists or if data is not empty
    // If not, then return and render Error to DOM
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // Store data in protected global data variable
    this._data = data;

    // Generate markup string
    const markup = this._generateMarkup();

    // If render = false, return markup string and dont render string to DOM
    // If render = true, render markup string to DOM
    if (!render) return markup;

    // Clear the parent element from any HTML
    this._clear();

    // Insert markup string in parent Element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Public function that updates the new data in the DOM without rendering the whole DOM again. Avoid re-rendering all images.
   * @param {Object} data The data to be rendered (e.g.recipe)
   */
  update(data) {
    // Store data in protected global data variable
    this._data = data;

    // Generate markup with new data
    const newMarkup = this._generateMarkup();

    // Create a virtual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Select all elements from virtual DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // Select all elements from current DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Loop over all the elements of virtual DOM and search for differences with current DOM
    newElements.forEach((newEl, i) => {
      // Select corresponding element from current DOM
      const curEl = curElements[i];

      // Update texts in current DOM element, if text in virtual element is different
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update attribute in current DOM element, if attribute in virtual element is different
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
}
