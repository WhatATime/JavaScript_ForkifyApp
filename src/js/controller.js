// MVC architecture
// CONTROLLER module

//////////////////////////////////////////////////////////
// IMPORTS

// Imports regarding Parcel
import 'core-js/actual';
import 'regenerator-runtime/runtime';

// Imports from MODEL and VIEW modules
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// Forkify API url
// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////////////////////////
// CONTROLLER IMPLEMENTATION

/**
 * Function that controls loading from API and rendering to DOM of a selected recipe
 */
const controlRecipes = async function () {
  try {
    // Get therecipe ID from the Browser without the #
    const id = window.location.hash.slice(1);

    // If there is no ID, return
    // Then nothing gets rendered
    if (!id) return;

    // Render spinner in the recipe view until data loaded
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // Updating bookmarks view with all bookmarks in STATE
    bookmarksView.update(model.state.bookmarks);

    // Load specific recipe
    await model.loadRecipe(id);

    // Render recipe to recipe view
    recipeView.render(model.state.recipe);
  } catch (err) {
    // Render error to DOM
    recipeView.renderError();
  }
};

/**
 * Function that controls the loading from API and rendering to DOM of search results
 */
const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();

    // If there is no query, do nothing
    if (!query) return;

    // Render spinner in results view until data loaded
    resultsView.renderSpinner();

    // Load search results
    await model.loadSearchResults(query);

    // Render the paginated results in results view
    // Display page 1
    resultsView.render(model.getSearchResultsPage());

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    // Log error to console
    console.log(err);
  }
};

/**
 * Function that controls the updates of the search results view regarding current page of pagination
 * @param {number} goToPage Result page which should be rendered in search results viwe
 */
const controlPagination = function (goToPage) {
  // Render NEW recipes
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination butons
  paginationView.render(model.state.search);
};

/**
 * Function that controls the update of the new servings
 * @param {number} newServings Number that indicates the new servinfs
 */
const controlServings = function (newServings) {
  // Update the recipe servings
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

/**
 * Function that controls the addition or deletion of bookmarks
 */
const controlAddBookmark = function () {
  // Add orremove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Function that controls the bookmarks view
 */
const controlBookmarks = function () {
  // Render the bookmarks in the bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Function that controls the addition of new recipe to API and DOM
 * @param {Object} newRecipe Object that contains the new recipe information
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner to recipe view
    addRecipeView.renderSpinner();

    // Upload new recipe data to API
    await model.uploadRecipe(newRecipe);

    // Render recipe to DOM
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render updated bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window after specified time
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // Log errors to console and render them to DOM
    console.log('❌', err);
    addRecipeView.renderError(err.message);
  }
};

/**
 * Initialisation function after page reload. Connects the control (handler) functions to corresponding view. Functions serve as callback function in event listeners.
 */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerButton(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
