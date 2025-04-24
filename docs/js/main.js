import { handleTokenQueryParam, getWebApp } from "./io.js";
import { initRecipes } from "./recipes.js";

// ----------------------
// Globals
// ----------------------
const loginContainer = document.querySelector("#login-container");
const headerEl = document.querySelector("#header");

// ----------------------
// Event listeners
// ----------------------

/* When page is loaded */
document.addEventListener("DOMContentLoaded", async () => {
  handleDOMContentLoaded();
});

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  const { recipes, shoppingList, shoppingSuggestions, error, warn } =
    await getWebApp(`${state.getWebAppUrl()}/session-opener`);

  if (warn) {
    document.dispatchEvent(new CustomEvent("fetch-warn", { detail: { warn } }));
    return { error: warn };
  }

  if (error) {
    document.dispatchEvent(new CustomEvent("fetch-fail"));
    return { error };
  }

  initRecipes(recipes);
}
