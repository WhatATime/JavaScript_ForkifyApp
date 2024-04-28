// MVC architecture
// MODEL module

//////////////////////////////////////////////////////////
// IMPORTS
// Import constants from configuration file
import { API_URL, RES_PER_PAGE, KEY } from './config';
// Import AJAX function from helper function file
import { AJAX } from './helpers';

//////////////////////////////////////////////////////////
// MODEL IMPLEMENTATION

/**
 * STATE variable which stores the current recipe, search result and bookmarks
 */
export const state = {
  // Current recipe
  recipe: {},
  // Information regarding search query
  search: {
    // The search query
    query: '',
    // Results from search query
    results: [],
    // First page for result pagination
    page: 1,
    // Defined number of results per page for pagination
    resultsPerPage: RES_PER_PAGE,
  },
  // Bookmarks
  bookmarks: [],
};

/**
 * Function that creates a recipe object from data
 * @param {Object} data
 * @returns Object which contains all information of a recipe
 */
const createRecipeObject = function (data) {
  // Destructuring of recipe information from data parameter
  const { recipe } = data.data;

  // Return the recipe object
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    source: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // Short-circuiting of key
    // If no key exists, nothing happens
    // If key exists, key is added to recipe object
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Function that loads a recipe from the API thanks to specific ID
 * @param {string} id The ID of a recipe
 */
export const loadRecipe = async function (id) {
  try {
    // Fetch new recipe from API
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // Create a recipe object from fetched data and store in STATE
    state.recipe = createRecipeObject(data);

    // If the loaded recipe is part of the bookmark array, mark it as bookmarked in STATE
    // Needed as bookmark is not laoded from server directly
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Print error to console and throw it for rendering in DOM
    console.error(`${err} ❌`);
    throw err;
  }
};

/**
 * Function that loads the recipes after a search query
 * @param {string} query Query string that the user typed in the search field
 */
export const loadSearchResults = async function (query) {
  try {
    // Store the search query in the STATE
    state.search.query = query;

    // Fetch recipes from API with query parameter
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // Store all search results in STATE
    // Mao over all recipies and store each in array
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // Reset current page for pagniation
    state.search.page = 1;
  } catch (err) {
    // Print error to console and throw it for rendering in DOM
    console.error(`${err} ❌`);
    throw err;
  }
};

/**
 * Function that returns an array with recipes regarding a requested page for pagination
 * @param {number} page The number which defines which result page should be displayed
 * @returns Array with recipes
 */
export const getSearchResultsPage = function (page = state.search.page) {
  // Store the requested page in the STATE
  state.search.page = page;

  // Get the index of the first recipe on requested page
  // e.g. with 10 results per page, if request is the first page, it is (1-1) * 10 = 0
  const start = (page - 1) * state.search.resultsPerPage;

  // Get the index of the last recipe on requested page
  // e.g. with 10 results per page, if request is the first page, it is 1 * 10 = 10
  const end = page * state.search.resultsPerPage;

  // Return the selected array of recipes
  // e.g. with 10 results per page, if request is the first page, returned are the recipes from index 0 to 9
  return state.search.results.slice(start, end);
};

/**
 * Function that updates the quantity of ingredients and number of servings of current recipe
 * @param {number} newServings Number of new servings
 */
export const updateServings = function (newServings) {
  // Update the quantity of ingredients in STATE regarding the new number of servings
  // New quantitiy = (Old quantity * New number of servings) / Old number of servings
  // Loop over all ingredients of recipe
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // Update the number of servings of recipe in STATE
  state.recipe.servings = newServings;
};

/**
 * Function that stores all the bookmarks in local storage (Browser storage)
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Function that adds a recipe to bookmarks array and local storage
 * @param {Object} recipe Object that contains the recipe
 */
export const addBookmark = function (recipe) {
  // Add recipe information to bookmarks array in STATE
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Update bookmarks in local storage
  persistBookmarks();
};

/**
 * Function that deletes recipe from bookmark array and from local storage
 * @param {string} id The recipe ID
 */
export const deleteBookmark = function (id) {
  // Find index of recipe in bookmarks array
  const index = state.bookmarks.findIndex(el => el.id === id);

  // Delete array element (Recipe) from bookmarks array
  state.bookmarks.splice(index, 1);

  // Mark current recipe not as bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Update bookmarks in local storage
  persistBookmarks();
};

/**
 * Function that loads the bookmarks from local storage after reloading the page
 */
const init = function () {
  // Get data from local storage
  const storage = localStorage.getItem('bookmarks');
  // If data exists, load bookmarks into STATE
  if (storage) state.bookmarks = JSON.parse(storage);
};
// Directly initialize after page reload
init();

/**
 * Developer function to delete the bookmarks from lokal storage
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// Only call for developer purposes
// clearBookmarks()

/**
 * Function that uploads a new recipe to API. Uploaded recipe gets saved as current recipe in STATE and automatically bookmarked.
 * @param {Object} newRecipe Recipe object to upload to API, comes from form
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    // Format the ingredients in form data
    // Parse object to array
    const ingredients = Object.entries(newRecipe)
      // Filter for ingredients that are not empty (entry is [key, value] pair)
      // e.g ['ingredient-1', '4,kg,Pasta']
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      // Create new array which includes ingrediens
      // e.g. ['4','kg','Pasta']
      .map(ing => {
        const ingArray = ing[1].split(',').map(el => el.trim());

        // Array has to have 3 entries
        if (ingArray.length !== 3) throw new Error('Wrong ingredient format!');

        // Destructure ingredients array
        const [quantity, unit, description] = ingArray;

        // Return object containing the quantity, unit and description in needed format
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Construct a recipe object from form data
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Fetch API call with data to upload
    // Returns again recipe data if Promise successfull
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    // Store returned recipe data as current recipe in STATE
    state.recipe = createRecipeObject(data);

    // Automatically add bookmark to current recipe
    addBookmark(state.recipe);
  } catch (err) {
    // Throw error to render to DOM
    throw err;
  }
};
