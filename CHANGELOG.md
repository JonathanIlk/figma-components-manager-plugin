Version 6:

- Add font-size setting for users to customize text size in the UI

Version 5:

- Enable seamless updates for the UI without re-rerendering the whole view
- Add functionality to sort variants by their variant properties
- Migrate to Vue.js for the UI

Version 4:

- Skip incorrect components when rendering view
- Add Resize handle to plugin window to allow user resizing
- Optimize automatic refresh to use partial updates instead of fully rescanning the document. This improves performance significantly on large documents.
- Add option to toggle automatic refresh on/off, Add button to manually refresh the view
- Add possibility to cycle through instances of a component variant
- Restyle Component variants view to be more table-like for better readability